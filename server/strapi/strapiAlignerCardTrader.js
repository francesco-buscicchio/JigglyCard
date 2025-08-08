import { strapi } from "@strapi/client";
import axios from "axios";
import { config } from "dotenv";
import { Readable } from "stream";
import { Blob } from "buffer";
import qs from "qs";

config();
const cardtraderApiToken = process.env.CARDTRADER_API_KEY;
const strapiApiToken = process.env.STRAPI_API_TOKEN;
const strapiUrl = process.env.STRAPI_URL;
const strapiUploadToken = process.env.STRAPI_UPLOAD_TOKEN;
const cardsTraderApiBaseUrl = process.env.CARDTRADER_API_BASE_URL;

const client = strapi({
  baseURL: strapiUrl,
  auth: strapiApiToken,
});

const configCardTrader = {
  headers: {
    Authorization: `Bearer ${cardtraderApiToken}`,
  },
};

// ---- INIZIALIZZA MAPPE PER CACHE ----
let tcgMap,
  categoryMap,
  setMap,
  rarityMap,
  languageMap,
  conditionMap,
  productMap,
  variantMap;

await initializeCache();

await createProductsOnStrapi();
await syncProductsImages();
// await checkVariantsAvailability();

async function initializeCache() {
  // Prendi tutti i dati con paginazione ampia (assumendo max 10000 oggetti, regola se necessario)
  const pagOpts = { pagination: { page: 1, pageSize: 10000 }, populate: "*" };

  const [
    tcgs,
    categories,
    sets,
    rarities,
    languages,
    conditions,
    products,
    variants,
  ] = await Promise.all([
    client.collection("tcgs").find(pagOpts),
    client.collection("categories").find(pagOpts),
    client.collection("sets").find(pagOpts),
    client.collection("rarities").find(pagOpts),
    client.collection("languages").find(pagOpts),
    client.collection("conditions").find(pagOpts),
    client.collection("products").find(pagOpts),
    client.collection("variants").find(pagOpts),
  ]);

  tcgMap = new Map(tcgs.data.map((x) => [x.cardtraderID?.toString(), x]));
  categoryMap = new Map(
    categories.data.map((x) => [x.cardtraderID?.toString(), x])
  );
  setMap = new Map(sets.data.map((x) => [x.cardtraderID?.toString(), x]));
  rarityMap = new Map(rarities.data.map((x) => [x.name, x]));
  languageMap = new Map(languages.data.map((x) => [x.short_name, x]));
  conditionMap = new Map(conditions.data.map((x) => [x.name, x]));
  productMap = new Map(
    products.data.map((x) => [x.cardtraderID?.toString(), x])
  );
  variantMap = new Map(
    variants.data.map((x) => [`${x.product}-${x.condition}-${x.language}`, x])
  );
}

// ------ METODI PRINCIPALI ------

async function createProductsOnStrapi() {
  const { expansions, categories, products, games } = await getAllData();

  for (let product of products.data) {
    await sleep(100);
    await createTcg(product, games);
    await sleep(100);
    await createCategory(product, categories);
    await sleep(100);
    await createSet(product, expansions);
    await sleep(100);
    await createRarity(product);
    await sleep(100);
    await createCondition(product);
    await sleep(100);
    await createLanguage(product);
    await sleep(100);
    await createProduct(product);
    await sleep(100);
    await createVariants(product);
  }
}

async function syncProductsImages() {
  const products = await getAllProducts();
  const blueprintsArray = [];

  for (let product of products) {
    if (!product.set) continue;

    const setID = product.set.cardtraderID;
    if (product.thumbnail) continue;

    await sleep(500);
    if (!blueprintsArray[setID]) {
      const result = await getBlueprintCardTrader(setID);
      blueprintsArray[setID] = result.data;
    }

    const blueprintFiltered = blueprintsArray[setID].filter(
      (val) => val.id === product.blueprintID
    );

    if (!blueprintFiltered.length) continue;

    const blueprintData = blueprintFiltered[0];
    let imageUrl = "";

    if (blueprintData.image)
      imageUrl = "https://www.cardtrader.com/" + blueprintData.image.url;
    else imageUrl = blueprintData.image_url;

    const imageToUse = await downloadImage(imageUrl);

    const blob = new Blob([imageToUse], { type: "image/jpeg" });
    const form = new FormData();
    form.append("files", blob, `${product.documentId}.jpg`);

    try {
      const uploadResponse = await fetch(
        "https://honorable-belief-ab1c5a7281.strapiapp.com/api/upload",
        {
          method: "POST",
          body: form,
          headers: {
            Authorization: `Bearer ${strapiUploadToken}`,
          },
        }
      );

      const responseJson = await uploadResponse.json();
      const uploadedFiles = responseJson;
      const thumbnailId = uploadedFiles[0].id;

      await client.collection("products").update(product.documentId, {
        thumbnail: thumbnailId,
      });
    } catch (e) {
      console.log(e.message);
    }
  }
}

// ----------- CRUD ENTITÀ ------------

async function createTcg(product, games) {
  const tcgID = product.game_id?.toString();
  if (!tcgMap.has(tcgID)) {
    const tcg = games.data.find((game) => game.id === product.game_id);
    if (!tcg) return;
    const tcgData = {
      name: tcg.display_name,
      cardtraderID: tcg.id.toString(),
      slug: normalizeSlug(tcg.name),
      description: "",
    };
    try {
      const created = await client.collection("tcgs").create(tcgData);
      tcgMap.set(tcgID, created.data);
    } catch (e) {
      console.log("Error creating game:", e);
    }
  }
}

async function createCategory(product, categories) {
  const categoryID = product.category_id?.toString();
  if (!categoryMap.has(categoryID)) {
    const tcgID = product.game_id?.toString();
    const tcgDoc = tcgMap.get(tcgID);
    const category = categories.data.find(
      (cat) => cat.id === product.category_id
    );
    if (!tcgDoc || !category) return;
    const categoryData = {
      name: category.name,
      cardtraderID: category.id.toString(),
      slug: normalizeSlug(category.name),
      description: "",
      tcg: tcgDoc.documentId,
    };
    try {
      const created = await client
        .collection("categories")
        .create(categoryData);
      categoryMap.set(categoryID, created.data);
    } catch (e) {
      const errorBody = await e.response?.json?.();
      console.log("Error creating category:", errorBody || e);
    }
  }
}

async function createSet(product, expansions) {
  const setID = product.expansion?.id?.toString();
  if (!setMap.has(setID)) {
    const tcgID = product.game_id?.toString();
    const tcgDoc = tcgMap.get(tcgID);
    const set = expansions.data.find((exp) => exp.id === product.expansion.id);
    if (!tcgDoc || !set) return;
    const expansionData = {
      name: set.name,
      code: set.code,
      cardtraderID: set.id.toString(),
      slug: normalizeSlug(set.name),
      tcg: tcgDoc.documentId,
    };
    try {
      const created = await client.collection("sets").create(expansionData);
      setMap.set(setID, created.data);
    } catch (e) {
      const errorBody = await e.response?.json?.();
      console.log("Error creating expansion:", errorBody || e);
    }
  }
}

async function createRarity(product) {
  const rarityKey = Object.keys(product.properties_hash).find((key) =>
    key.endsWith("_rarity")
  );
  const rarityID = product.properties_hash[rarityKey];
  if (!rarityMap.has(rarityID)) {
    const rarityData = {
      name: rarityID,
      short_name: rarityID,
      slug: normalizeSlug(rarityID),
    };
    try {
      const created = await client.collection("rarities").create(rarityData);
      rarityMap.set(rarityID, created.data);
    } catch (e) {
      console.log("Error creating rarity:", e);
    }
  }
}

async function createLanguage(product) {
  const languageKey = Object.keys(product.properties_hash).find((key) =>
    key.endsWith("_language")
  );
  const languageID = product.properties_hash[languageKey];
  if (!languageMap.has(languageID)) {
    const languageData = {
      name: languageID,
      short_name: languageID,
    };
    try {
      const created = await client.collection("languages").create(languageData);
      languageMap.set(languageID, created.data);
    } catch (e) {
      console.log("Error creating language:", e);
    }
  }
}

async function createCondition(product) {
  const conditionID = product.properties_hash.condition;
  if (!conditionMap.has(conditionID)) {
    const conditionData = {
      name: conditionID,
      short_name: conditionID,
    };
    try {
      const created = await client
        .collection("conditions")
        .create(conditionData);
      conditionMap.set(conditionID, created.data);
    } catch (e) {
      const errorBody = await e.response?.json?.();
      console.log("Error creating condition:", errorBody || e);
    }
  }
}

async function createProduct(product) {
  const productID = product.id?.toString();
  if (!productMap.has(productID)) {
    const rarityKey = Object.keys(product.properties_hash).find((key) =>
      key.endsWith("_rarity")
    );
    const rarityID = product.properties_hash[rarityKey];
    const rarityDoc = rarityMap.get(rarityID);
    const categoryDoc = categoryMap.get(product.category_id?.toString());
    const setDoc = setMap.get(product.expansion?.id?.toString());

    const code = product.properties_hash.collector_number
      ? product.properties_hash.collector_number.split("/")[0]
      : product.properties_hash.collector_number;

    const tags = [
      "yc9rj6klofl3x618tlfcx042",
      "li0wur3zy7yz97ape7ka84sg",
      "x34kvpiym4w0z6iewupxa6qo",
    ];
    const randomTag = tags[Math.floor(Math.random() * tags.length)];

    if (!rarityDoc || !categoryDoc || !setDoc) return;

    const productData = {
      name: product.name_en,
      rarity: rarityDoc.documentId,
      category: categoryDoc.documentId,
      cardtraderID: product.id,
      set: setDoc.documentId,
      slug: normalizeSlug(product.name_en),
      description: "",
      tag: randomTag,
      code: code,
      blueprintID: product.blueprint_id,
    };

    try {
      const created = await client.collection("products").create(productData);
      productMap.set(productID, created.data);
    } catch (e) {
      const errorBody = await e.response?.json?.();
      console.log("Error creating product:", errorBody || e);
    }
  }
}

async function createVariants(product) {
  const productID = product.id?.toString();
  const productDoc = productMap.get(productID);

  const conditionID = product.properties_hash.condition;
  const conditionDoc = conditionMap.get(conditionID);

  const languageKey = Object.keys(product.properties_hash).find((key) =>
    key.endsWith("_language")
  );
  const languageID = product.properties_hash[languageKey];
  const languageDoc = languageMap.get(languageID);

  if (!productDoc || !conditionDoc || !languageDoc) return;

  const key = `${productDoc.documentId}-${conditionDoc.documentId}-${languageDoc.documentId}`;
  if (!variantMap.has(key)) {
    const variantData = {
      name:
        languageDoc.short_name.toUpperCase() +
        "-" +
        conditionDoc.short_name.toUpperCase(),
      price: product.price_cents,
      quantity: product.quantity,
      language: languageDoc.documentId,
      condition: conditionDoc.documentId,
      product: productDoc.documentId,
    };

    try {
      const result = await client.collection("variants").create(variantData);

      const newVariantId = result.data.documentId;
      const currentVariants = (productDoc.variants || []).map((v) =>
        typeof v === "string" ? v : v.documentId
      );
      const updatedVariants = [...currentVariants, newVariantId];

      await client.collection("products").update(productDoc.documentId, {
        variants: updatedVariants,
      });

      variantMap.set(key, result.data);
    } catch (e) {
      const errorBody = await e.response?.json?.();
      console.log("Error creating variant:", errorBody || e);
    }
  } else {
    // Aggiornamento variante se necessario (opzionale)
    // await client.collection("variants").update(variantMap.get(key).documentId, {
    //   price: product.price_cents,
    //   quantity: product.quantity,
    // });
  }
}

// ------------- FUNZIONI DI SUPPORTO -------------

async function getAllData() {
  try {
    const expansions = await getExpansionsCardTrader();
    const categories = await getCategoriesCardTrader();
    const products = await getProductsCardTrader();
    const games = await getGamesCardTrader();
    return { expansions, categories, products, games };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getBlueprintCardTrader(idExpansion) {
  const url = `${cardsTraderApiBaseUrl}/blueprints/export?expansion_id=${idExpansion}`;
  const result = await axios.get(url, configCardTrader);
  return result;
}

async function getExpansionsCardTrader() {
  const url = `${cardsTraderApiBaseUrl}/expansions/export`;
  const result = await axios.get(url, configCardTrader);
  return result;
}
async function getCategoriesCardTrader() {
  const url = `${cardsTraderApiBaseUrl}/categories`;
  const result = await axios.get(url, configCardTrader);
  return result;
}
async function getProductsCardTrader() {
  const url = `${cardsTraderApiBaseUrl}/products/export`;
  const result = await axios.get(url, configCardTrader);
  return result;
}
async function getGamesCardTrader() {
  const url = `${cardsTraderApiBaseUrl}/games`;
  const result = await axios.get(url, configCardTrader);
  return result;
}

async function getAllProducts() {
  let page = 1;
  const pageSize = 25;
  let allProducts = [];
  let totalPages = 1;

  do {
    const response = await client.collection("products").find({
      pagination: {
        page,
        pageSize,
      },
      populate: "*",
    });
    const { data, meta } = response;
    allProducts = allProducts.concat(data);

    totalPages = meta?.pagination?.pageCount || 1;
    page++;
  } while (page <= totalPages);

  return allProducts;
}

async function downloadImage(url) {
  const response = await axios({
    url,
    method: "GET",
    responseType: "arraybuffer",
  });
  return Buffer.from(response.data);
}

function normalizeSlug(slug) {
  return slug
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^A-Za-z0-9-_.~]/g, "-");
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
