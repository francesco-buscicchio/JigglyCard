import { strapi } from "@strapi/client";
import axios from "axios";
import { config } from "dotenv";
import puppeteer from "puppeteer";
import { Readable } from "stream";
import { Blob } from "buffer";

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
const categoriesIndex = client.collection("categories");
const conditionsIndex = client.collection("conditions");
const languagesIndex = client.collection("languages");
const productsIndex = client.collection("products");
const raritiesIndex = client.collection("rarities");
const setsIndex = client.collection("sets");
const tcgsIndex = client.collection("tcgs");
const variantsIndex = client.collection("variants");

await createProductsOnStrapi();
await syncProductsImages();
await checkVariantsAvailability();

async function checkVariantsAvailability() {
  const products = await getProductsCardTrader();
  const cardtraderProducts = products.data;
  const strapiProducts = await productsIndex.find({
    locale: "en",
    populate: "*",
  });

  for (const strapiProduct of strapiProducts.data) {
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
  const products = await productsIndex.find({
    locale: "en",
    populate: "*",
  });

  for (let product of products.data) {
    if (product.thumbnail) continue;

    let link = `https://www.cardtrader.com/cards/${product.slug}-${product.rarity.slug}-${product.code}`;
    if (product.set.cards) link += `-${product.set.cards}`;
    link += `-${product.set.slug}`;

    let link2 = `https://www.cardtrader.com/cards/${product.slug}-${product.code}`;
    if (product.set.cards) link2 += `-${product.set.cards}`;
    link2 += `-${product.set.slug}`;

    const imageBuffer = await getThumbnail(link, 10);
    const imageBuffer2 = await getThumbnail(link2, 10);
    const imageToUse = imageBuffer || imageBuffer2;

    if (!imageToUse) continue;

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
  for (let product of products.data) {
    await createTcg(product, games);
    await createCategory(product, categories);
    await createSet(product, expansions);
    await createRarity(product);
    await createCondition(product);
    await createLanguage(product);
    await createProduct(product);
    await createVariants(product);
  }
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
async function getProductExists(id) {
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
      await tcgsIndex.create(tcgData);
    } catch (e) {
      const errorBody = await e.response.json();
      console.log("Error creating game:", errorBody);
    }
  }
}
async function getVariantExists(productID, conditionID, languageID) {
  return await variantsIndex.find({
    locale: "en",
    populate: "*",
    filters: {
      product: {
        $eq: productID,
      },
      condition: {
        $eq: conditionID,
      },
      language: {
        $eq: languageID,
      },
    },
  });
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
    const cardtraderID = product.id.toString();

    const productData = {
      name: product.name_en,
      cardtraderID: cardtraderID,
      slug: normalizeSlug(product.name_en),
      description: "",
      category: categoryDocument.data[0].documentId,
      set: setDocument.data[0].documentId,
      rarity: rarityDocument.data[0].documentId,
      code: code,
      tag: randomTag,
    };

    try {
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
    productID,
    conditionID,
    languageID
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
      const result = await variantsIndex.create(variantData);

      const newVariantId = result.data.documentId;
      const currentVariants = (productDocument.data[0].variants || []).map(
        (v) => (typeof v === "string" ? v : v.documentId)
      );
      const updatedVariants = [...currentVariants, newVariantId];
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
async function getThumbnail(url, limit = 1000) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  const bestImage = await page.evaluate(() => {
    const prefix = "https://www.cardtrader.com/uploads/blueprints/";
    const imgs = Array.from(document.querySelectorAll("img"));
    console.log(imgs);
    const matches = imgs.filter((img) => img.src.includes(prefix));
    return matches.length > 0 ? matches[0].src : null;
  });

  await browser.close();

  if (bestImage) {
    const imageBuffer = await downloadImage(bestImage);
    return imageBuffer; // Restituisce il Buffer dell'immagine
  }

  return null;
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
