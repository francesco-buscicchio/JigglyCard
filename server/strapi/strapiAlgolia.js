import https from "https";
import { strapi } from "@strapi/client";
import qs from "qs";
import { algoliasearch } from "algoliasearch";
import { config } from "dotenv";

const agent = new https.Agent({
  rejectUnauthorized: false,
});
config();
const strapiUrl = process.env.STRAPI_URL;
const strapiApiToken = process.env.STRAPI_API_TOKEN;
const algoliaApplicationId = process.env.ALGOLIA_APPLICATION_ID;
const algoliaApiKey = process.env.ALGOLIA_API_KEY;

const algoliaClient = algoliasearch(algoliaApplicationId, algoliaApiKey);

const strapiClient = strapi({
  baseURL: strapiUrl,
  auth: strapiApiToken,
});

const productsIndex = strapiClient.collection("products");
const variantsIndex = strapiClient.collection("variants");
const setIndex = strapiClient.collection("sets");
const categoriesIndex = strapiClient.collection("categories");

//await syncAlgoliaToStrapiProducts();
//await syncAlgoliaToStrapiSets();
//await syncAlgoliaMassimoMinimo();
await syncAlgoliaToStrapiMenu();

async function syncAlgoliaMassimoMinimo() {
  const products = await getProducts();

  let minorPrice = 100000000;
  let maxPrice = 0;

  for (const product of products) {
    for (const variant of product.variants) {
      if (variant.price < minorPrice) {
        minorPrice = variant.price;
      }
      if (variant.price > maxPrice) {
        maxPrice = variant.price;
      }
    }
  }

  const obj = [
    {
      objectID: "minMax",
      minimo: minorPrice / 100,
      massimo: maxPrice / 100,
    },
  ];

  await algoliaClient
    .saveObjects({
      indexName: "filters",
      objects: obj,
    })
    .then((val) => {
      console.log("Massimo e Minimo Salvati");
    });
}

async function syncAlgoliaToStrapiProducts() {
  const products = await getProducts();
  const productsToSave = [];
  for (const product of products) {
    const variants = await getProductVariants(product.id);
    const category = await getCategory(product.category.documentId);

    const productQuantity = variants.data.length
      ? variants.data.reduce((acc, variant) => {
          return acc + (variant.quantity || 0);
        })
      : 0;

    const conditionsList = [];
    const languagesList = [];
    let minorPrice = 10000000;
    let totalQuantity = 0;

    for (let variant of variants.data) {
      const condition = variant.condition;
      conditionsList.push(condition.short_name);
      languagesList.push(variant.language.short_name);
      if (variant.price < minorPrice) {
        minorPrice = variant.price;
      }
      if (variant.quantity) {
        totalQuantity += variant.quantity;
      }
    }

    const productData = {
      objectID: product.id,
      name: product.name,
      tags: product.tag ? [product.tag.name] : [],
      available: totalQuantity > 0,
      conditions: conditionsList.length > 0 ? conditionsList : ["N/A"],
      expansion: product.set ? product.set.name : "N/A",
      languages: languagesList,
      tcg: category.data[0].tcg ? category.data[0].tcg.name : "N/A",
      type: product.category ? product.category.slug : "N/A",
      code: `${product.set.code} ${product.code}`,
      number: Number(product.code),
      shortDescription: product.description,
      thumbnailImage: product.thumbnail
        ? [
            `https://honorable-belief-ab1c5a7281.media.strapiapp.com${product.thumbnail.url.replace(
              /^\/uploads/,
              ""
            )}`,
          ]
        : null,
      salePrice: minorPrice / 100,
      images: [product.thumbnail],
      variantsDetails: variants.data.map((variant) => ({
        id: variant.id,
        quantity: variant.quantity,
        documentId: variant.documentId,
        language: variant.language.short_name,
        condition: variant.condition.short_name,
        price: variant.price / 100,
      })),
      quantity: totalQuantity,
    };

    productsToSave.push(productData);
  }

  console.log("Prodotti da salvare:", productsToSave.length);
  await algoliaClient
    .saveObjects({
      indexName: "ecommerce",
      objects: productsToSave,
    })
    .then((val) => {
      console.log("Prodotti Salvati");
    });
}

async function syncAlgoliaToStrapiMenu() {
  const categories = await getCategories();
  const menuToSave = { objectID: "menu" };

  for (let item of categories.data) {
    if (!item.tcg || !item.tcg.name) continue;

    if (!menuToSave[item.tcg.name])
      menuToSave[item.tcg.name] = {
        categories: [],
      };

    const categoryData = {
      objectID: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description,
      image: item.image ? `${item.image.url.replace(/^\/uploads/, "")}` : null,
    };

    menuToSave[item.tcg.name].categories.push(categoryData);
  }

  await algoliaClient
    .saveObjects({
      indexName: "menu",
      objects: [menuToSave],
    })
    .then((val) => {
      console.log(`Menu Salvato`);
    });
}

async function syncAlgoliaToStrapiSets() {
  const sets = await getSets();

  const setsToSave = [];

  for (const set of sets) {
    const setData = {
      objectID: set.id,
      name: set.name,
      code: set.code,
      expansion: set.slug,
      tags: ["HEROBANNER"],
      description: set.description,
      hasThumbnailImage: set.thumbnail ? true : false,
      thumbnailImage: set.thumbnail
        ? `https://honorable-belief-ab1c5a7281.media.strapiapp.com${set.thumbnail[0].url.replace(
            /^\/uploads/,
            ""
          )}`
        : null,
    };
    setsToSave.push(setData);
  }

  console.log("Set da salvare:", setsToSave.length);
  await algoliaClient
    .saveObjects({
      indexName: "ecommerce",
      objects: setsToSave,
    })
    .then((val) => {
      console.log("Set Salvati");
    });
}

async function getProducts() {
  let page = 1;
  const pageSize = 25;
  let allProducts = [];
  let totalPages = 1;

  do {
    const response = await productsIndex.find({
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

async function getConditions() {
  return await strapiClient.collection("conditions").find({
    populate: "*",
  });
}

async function getProductVariants(productID) {
  const variantsI = strapiClient.collection("variants");
  return await variantsI.find({
    populate: "*",
    filters: {
      product: {
        $eq: productID,
      },
    },
  });
}

async function getCategory(categoryID) {
  return await categoriesIndex.find({
    populate: "*",
    filters: {
      documentId: {
        $eq: categoryID,
      },
    },
  });
}

async function getCategories() {
  return await categoriesIndex.find({
    populate: "*",
  });
}

async function getSets() {
  let page = 1;
  const pageSize = 25;
  let allSets = [];
  let totalPages = 1;

  do {
    const response = await setIndex.find({
      pagination: {
        page,
        pageSize,
      },
      populate: "*",
    });
    const { data, meta } = response;
    allSets = allSets.concat(data);

    totalPages = meta?.pagination?.pageCount || 1;
    page++;
  } while (page <= totalPages);

  return allSets;
}
