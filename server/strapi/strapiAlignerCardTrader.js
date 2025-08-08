import { strapi } from "@strapi/client";
import axios from "axios";
import { config } from "dotenv";
import puppeteer from "puppeteer";
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

await createProductsOnStrapi();
await syncProductsImages();
//await checkVariantsAvailability();

async function checkVariantsAvailability() {
  const products = await getProductsCardTrader();
  const cardtraderProducts = products.data;
  const strapiProducts = await getAllProducts();

  for (const strapiProduct of strapiProducts) {
    for (const variant of strapiProduct.variants) {
      const variantData = await variantsIndex.find({
        locale: "en",
        populate: "*",
        filters: {
          documentId: {
            $eq: variant.documentId,
          },
        },
      });

      let productFiltered = cardtraderProducts.filter((product) => {
        return (
          product.id === Number(strapiProduct.cardtraderID) &&
          product.properties_hash.condition ===
            variantData.data[0].condition.name
        );
      });

      if (productFiltered.length === 0) {
        console.log(
          `Removing variant ${variant.documentId} for product ${strapiProduct.name} (${strapiProduct.documentId})`
        );
        updateVariant(variant, strapiProduct, 0);
      } else {
        // Filter by language
        const languageKey = Object.keys(
          productFiltered[0].properties_hash
        ).find((key) => key.endsWith("_language"));
        productFiltered = productFiltered.filter((product) => {
          return (
            product.properties_hash[languageKey] ===
            variantData.data[0].language.name
          );
        });

        // If we have a product with the same condition and language
        // and the quantity is different, update the variant
        if (productFiltered.length !== 0) {
          if (
            Number(productFiltered[0].quantity) !==
            Number(variantData.data[0].quantity)
          ) {
            console.log(
              `Updating variant ${variant.documentId} for product ${strapiProduct.name} (${strapiProduct.documentId})`
            );
            updateVariant(variant, strapiProduct, productFiltered[0].quantity);
          }
        }
        // If we don't have a product with the same condition and language
        // remove the variant
        else {
          console.log(
            `Removing variant ${variant.documentId} for product ${strapiProduct.name} (${strapiProduct.documentId})`
          );
          updateVariant(variant, strapiProduct, 0);
        }
      }
    }
  }
}

async function updateVariant(variant, product, quantity) {
  await variantsIndex.update(variant.documentId, {
    quantity: quantity,
    product: null,
  });

  const currentVariants = (product.variants || []).map((v) =>
    typeof v === "string" ? v : v.documentId
  );
  const updatedVariants = [...currentVariants];

  await productsIndex.update(product.documentId, {
    variants: updatedVariants,
  });
}

async function syncProductsImages() {
  const productsIndex = client.collection("products");
  const products = await getAllProducts();
  const blueprintsArray = [];

  for (let product of products) {
    await sleep(5000);
    const setID = product.set.cardtraderID;

    if (product.thumbnail) continue;

    if (!blueprintsArray[setID]) {
      const result = await getBlueprintCardTrader(setID);
      blueprintsArray[setID] = result.data;
    }

    const blueprintFiltered = blueprintsArray[setID].filter((val) => {
      return val.id === product.blueprintID;
    });

    if (!blueprintFiltered.length) continue;

    const blueprintData = blueprintFiltered[0];

    const imageToUse = await downloadImage(blueprintData.image.url);

    const blob = new Blob([imageToUse], { type: "image/jpeg" });
    const form = new FormData();
    form.append("files", blob, `${product.documentId}.jpg`);

    const uploadResponse = await fetch("http://localhost:1337/api/upload", {
      method: "POST",
      body: form,
      headers: {
        Authorization: `Bearer ${strapiUploadToken}`,
      },
    });

    const responseJson = await uploadResponse.json();

    const uploadedFiles = responseJson;
    const thumbnailId = uploadedFiles[0].id;

    await productsIndex.update(product.documentId, {
      thumbnail: thumbnailId,
    });
  }
}
async function createProductsOnStrapi() {
  const { expansions, categories, products, games } = await getAllData();

  //for (let i = 0; i < 1000; i++) {
  //const product = products.data[i];
  for (let product of products.data) {
    try {
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
    } catch (e) {
      console.log("Errore");
      console.log(e.message);
    }
  }
  // }
}
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
async function getTcgExists(id) {
  const tcgsIndex = client.collection("tcgs");
  return await tcgsIndex.find({
    locale: "en",
    populate: "*",
    filters: {
      cardtraderID: {
        $eq: id,
      },
    },
  });
}
async function getRarityExists(name) {
  const raritiesIndex = client.collection("rarities");
  return await raritiesIndex.find({
    locale: "en",
    populate: "*",
    filters: {
      name: {
        $eq: name,
      },
    },
  });
}
async function getLanguageExists(name) {
  const languagesIndex = client.collection("languages");
  return await languagesIndex.find({
    locale: "en",
    populate: "*",
    filters: {
      short_name: {
        $eq: name,
      },
    },
  });
}
async function getCategoryExists(id) {
  const categoriesIndex = client.collection("categories");
  return await categoriesIndex.find({
    locale: "en",
    populate: "*",
    filters: {
      cardtraderID: {
        $eq: id,
      },
    },
  });
}
async function getSetExists(id) {
  const setsIndex = client.collection("sets");
  return await setsIndex.find({
    locale: "en",
    populate: "*",
    filters: {
      cardtraderID: {
        $eq: id,
      },
    },
  });
}
async function getConditionExists(name) {
  const conditionsIndex = client.collection("conditions");
  return await conditionsIndex.find({
    locale: "en",
    populate: "*",
    filters: {
      name: {
        $eq: name,
      },
    },
  });
}
async function createTcg(product, games) {
  const tcgID = product.game_id;
  const tcgExists = await getTcgExists(tcgID);
  if (tcgExists.data.length === 0) {
    const tcg = games.data.array.find((game) => game.id === tcgID);
    const tcgData = {
      name: tcg.display_name,
      cardtraderID: tcg.id.toString(),
      slug: normalizeSlug(tcg.name),
      description: "",
    };
    try {
      const tcgsIndex = client.collection("tcgs");
      await tcgsIndex.create(tcgData);
    } catch (e) {
      console.log("Error creating game:", e);
    }
  }
}

async function getProductExists(id) {
  const productsIndex = client.collection("products");
  return await productsIndex.find({
    locale: "en",
    populate: "*",
    filters: {
      cardtraderID: {
        $eq: id,
      },
    },
  });
}

async function getVariantExists(productID, conditionID, languageID) {
  const result = await client.collection("variants").find({
    filters: {
      product: { $eq: productID },
      condition: { $eq: conditionID },
      language: { $eq: languageID },
    },
    populate: "*",
  });
  return result;
}
async function createCategory(product, categories) {
  const categoryID = product.category_id;
  const tcgID = product.game_id;
  const categoryExists = await getCategoryExists(categoryID);
  if (categoryExists.data.length === 0) {
    const tcgData = await getTcgExists(tcgID);
    const category = categories.data.find((cat) => cat.id === categoryID);
    const categoryData = {
      name: category.name,
      cardtraderID: category.id.toString(),
      slug: normalizeSlug(category.name),
      description: "",
      tcg: tcgData.data[0].documentId,
    };
    try {
      const categoriesIndex = client.collection("categories");
      await categoriesIndex.create(categoryData);
    } catch (e) {
      const errorBody = await e.response.json();
      console.log("Error creating category:", errorBody);
    }
  }
}
async function createSet(product, expansions) {
  const setID = product.expansion.id;
  const tcgID = product.game_id;
  const setExists = await getSetExists(setID);
  if (setExists.data.length === 0) {
    const tcgData = await getTcgExists(tcgID);
    const set = expansions.data.find((exp) => exp.id === setID);
    const expansionData = {
      name: set.name,
      code: set.code,
      cardtraderID: set.id.toString(),
      slug: normalizeSlug(set.name),
      tcg: tcgData.data[0].documentId,
    };
    try {
      const setsIndex = client.collection("sets");
      await setsIndex.create(expansionData);
    } catch (e) {
      const errorBody = await e.response.json();
      console.log("Error creating expansion:", errorBody);
    }
  }
}
async function createRarity(product) {
  const rarityKey = Object.keys(product.properties_hash).find((key) =>
    key.endsWith("_rarity")
  );
  const rarityID = product.properties_hash[rarityKey];
  const rarityExists = await getRarityExists(rarityID);
  if (rarityExists.data.length === 0) {
    const rarityData = {
      name: rarityID,
      short_name: rarityID,
      slug: normalizeSlug(rarityID),
    };

    try {
      const raritiesIndex = client.collection("rarities");
      await raritiesIndex.create(rarityData);
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
  const languageExists = await getLanguageExists(languageID);
  if (languageExists.data.length === 0) {
    const languageData = {
      name: languageID,
      short_name: languageID,
    };

    try {
      const languagesIndex = client.collection("languages");
      await languagesIndex.create(languageData);
    } catch (e) {
      console.log("Error creating language:", e);
    }
  }
}
async function createCondition(product) {
  const conditionID = product.properties_hash.condition;
  const conditionExists = await getConditionExists(conditionID);
  if (conditionExists.data.length === 0) {
    const conditionData = {
      name: conditionID,
      short_name: conditionID,
    };

    try {
      const conditionsIndex = client.collection("conditions");
      await conditionsIndex.create(conditionData);
    } catch (e) {
      const errorBody = await e.response.json();
      console.log("Error creating condition:", errorBody);
    }
  }
}
async function createProduct(product) {
  const productID = product.id;
  const productExists = await getProductExists(productID);
  const tags = [
    "yc9rj6klofl3x618tlfcx042",
    "li0wur3zy7yz97ape7ka84sg",
    "x34kvpiym4w0z6iewupxa6qo",
  ];
  const randomTag = tags[Math.floor(Math.random() * tags.length)];

  if (productExists.data.length === 0) {
    const rarityKey = Object.keys(product.properties_hash).find((key) =>
      key.endsWith("_rarity")
    );
    const rarityID = product.properties_hash[rarityKey];
    const rarityDocument = await getRarityExists(rarityID);
    const categoryDocument = await getCategoryExists(product.category_id);
    const setDocument = await getSetExists(product.expansion.id);
    const code = product.properties_hash.collector_number
      ? product.properties_hash.collector_number.split("/")[0]
      : product.properties_hash.collector_number;

    const productData = {
      name: product.name_en,
      rarity: rarityDocument.data[0].documentId,
      category: categoryDocument.data[0].documentId,
      cardtraderID: product.id,
      set: setDocument.data[0].documentId,
      slug: normalizeSlug(product.name_en),
      description: "",
      tag: randomTag,
      code: code,
      blueprintID: product.blueprint_id,
    };

    try {
      const productsIndex = client.collection("products");
      await productsIndex.create(productData);
    } catch (e) {
      const errorBody = await e.response.json();
      console.log("Error creating product:", errorBody);
    }
  }
}
async function createVariants(product) {
  const productID = product.id;
  const productDocument = await getProductExists(productID);

  const conditionID = product.properties_hash.condition;
  const conditionDocument = await getConditionExists(conditionID);

  const languageKey = Object.keys(product.properties_hash).find((key) =>
    key.endsWith("_language")
  );
  const languageID = product.properties_hash[languageKey];
  const languageDocument = await getLanguageExists(languageID);

  const variantExists = await getVariantExists(
    productDocument.data[0].id,
    conditionDocument.data[0].id,
    languageDocument.data[0].id
  );

  if (variantExists.data.length === 0) {
    const variantData = {
      name:
        languageDocument.data[0].short_name.toUpperCase() +
        "-" +
        conditionDocument.data[0].short_name.toUpperCase(),
      price: product.price_cents,
      quantity: product.quantity,
      language: languageDocument.data[0].documentId,
      condition: conditionDocument.data[0].documentId,
    };

    try {
      const variantsIndex = client.collection("variants");
      const result = await variantsIndex.create(variantData);

      const newVariantId = result.data.documentId;
      const currentVariants = (productDocument.data[0].variants || []).map(
        (v) => (typeof v === "string" ? v : v.documentId)
      );
      const updatedVariants = [...currentVariants, newVariantId];
      const productsIndex = client.collection("products");
      await productsIndex.update(productDocument.data[0].documentId, {
        variants: updatedVariants,
      });
    } catch (e) {
      const errorBody = await e.response.json();
      console.log("Error creating product:", errorBody);
    }
  } else {
    await variantsIndex.update(variantExists.data[0].documentId, {
      price: product.price_cents,
      quantity: product.quantity,
    });
  }
}

async function downloadImage(url) {
  const response = await axios({
    url,
    method: "GET",
    responseType: "arraybuffer", // Ottieni i dati come un array di byte
  });

  // Crea un Buffer dal contenuto dell'immagine
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

async function getAllProducts() {
  let page = 1;
  const pageSize = 25;
  let allProducts = [];
  let totalPages = 1;

  do {
    const query = qs.stringify({
      pagination: {
        page,
        pageSize,
      },
      populate: "*",
    });

    const response = await productsIndex.find(query);
    const { data, meta } = response;
    allProducts = allProducts.concat(data);

    totalPages = meta?.pagination?.pageCount || 1;
    page++;
  } while (page <= totalPages);

  return allProducts;
}
