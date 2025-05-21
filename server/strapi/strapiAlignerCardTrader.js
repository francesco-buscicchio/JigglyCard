import { strapi } from "@strapi/client";
import axios from "axios";
import { config } from "dotenv";
import puppeteer from "puppeteer";
import { Readable } from "stream";
import { Blob } from "buffer";

const client = strapi({
  baseURL: "http://localhost:1337/api",
  auth: "f73611b51d1200d2b839291010ae88ef2212279a438c2b54ed035c0d67ebee2f245370a01849bef98f548cec35ac7a54056f63c20601427dee96cdf5ec216a1528d7c64855c3893e24d3bc552d6bce79eb2f0ec64aca137f893c2c1b537bca8e0f77665990e36074bc22824575ceaa13e338fec8efaffbcd827b21c2336c8e80",
});

config();
const token =
  "eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJjYXJkdHJhZGVyLXByb2R1Y3Rpb24iLCJzdWIiOiJhcHA6MTI5MTEiLCJhdWQiOiJhcHA6MTI5MTEiLCJleHAiOjQ5MDIzNTU5ODQsImp0aSI6IjBiMWQyNDc3LThiMjgtNGE4NC05NDM5LTlhNDBmZWZkOGUxNSIsImlhdCI6MTc0NjY4MjM4NCwibmFtZSI6IkppZ2dseWNhcmQgQXBwIDIwMjQxMTI4MTA0NzA4In0.e94ifYnH6ihm_jBG-vhwYbBGSS67tMlIl9crr2hF6dSPNdRyoU7NY3DWHgWRSUnQjLkwAJH5-J7D6aEets9jas347jEKha_7nG3QQOgzl7CXfYWlO9Xoh28DtRd4ldGILnH5s-siW9LRM8EGhSyjHcJB6HSVoDohRjzI8N2tWGj6j1DljPoN0YAYue4p5bQWiXmSIQdfm_pegOEjTD-SrSq1whq_C46gO7TW9JcH2tEtojEX0D5-G_88j4hbwEaQxVcMQ4YyAO0xhAf3qowI5_o22VOaehgt1z2pJI0jeOXedOG7aCqQ_gyV4-0pkVWzdUu2vAhfe95uSAQLAns4Hw";
const configCardTrader = {
  headers: {
    Authorization: `Bearer ${token}`,
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

async function syncProductsImages() {
  const products = await productsIndex.find({
    locale: "en",
    populate: "*",
  });
  for (let product of products.data) {
    if (product.thumbnail) continue;
    let link = `https://www.cardtrader.com/cards/${product.slug}-${product.rarity.slug}-${product.code}-${product.set.cards}-${product.set.slug}`;
    const imageBuffer = await getThumbnail(link, 10);
    if (!imageBuffer) continue;

    const blob = new Blob([imageBuffer], { type: "image/jpeg" });
    const form = new FormData();
    form.append("files", blob, `${product.documentId}.jpg`);

    const uploadResponse = await fetch("http://localhost:1337/api/upload", {
      method: "POST",
      body: form,
      headers: {
        Authorization: `Bearer e0038a3fca0ff82db81f90b7fe2aac40efb1a35134f3cf03a2715bfa9cefdc627cfc323c2d8453af76c8ee9df21e20b17cc6263f592b662bab664a2db7e085da85835c7edff1fc15306c77c81a604c596d42f61df6acb32df00cfd1f0c0cee68964136e75f05d8935987d2b598156ac873fefa59371329c3e2b345f8d2553e90`,
      },
    });

    const uploadedFiles = await uploadResponse.json();
    const thumbnailId = uploadedFiles[0].id;

    await productsIndex.update(product.documentId, {
      thumbnail: thumbnailId,
    });
  }
}

async function createProductsOnStrapi() {
  const { expansions, categories, products, games } = await getAllData();
  let i = 0;
  for (let product of products.data) {
    await createTcg(product, games);
    await createCategory(product, categories);
    await createSet(product, expansions);
    await createRarity(product);
    await createCondition(product);
    await createLanguage(product);
    await createProduct(product);
    await createVariants(product);
    i++;
    if (i > 3) {
      return;
    }
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
  const url = "https://api.cardtrader.com/api/v2/expansions/export";
  const result = await axios.get(url, configCardTrader);
  return result;
}
async function getCategoriesCardTrader() {
  const url = "https://api.cardtrader.com/api/v2/categories";
  const result = await axios.get(url, configCardTrader);
  return result;
}
async function getProductsCardTrader() {
  const url = "https://api.cardtrader.com/api/v2/products/export";
  const result = await axios.get(url, configCardTrader);
  return result;
}
async function getGamesCardTrader() {
  const url = "https://api.cardtrader.com/api/v2/games";
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
      slug: tcg.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^A-Za-z0-9-_.~]/g, "-"),
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
      slug: category.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^A-Za-z0-9-_.~]/g, "-"),
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
      slug: set.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^A-Za-z0-9-_.~]/g, "-"),
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
      slug: rarityID
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^A-Za-z0-9-_.~]/g, "-"),
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
      slug: product.name_en
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^A-Za-z0-9-_.~]/g, "-"),
      description: "",
      category: categoryDocument.data[0].documentId,
      set: setDocument.data[0].documentId,
      rarity: rarityDocument.data[0].documentId,
      code: code,
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
