import fetch from "node-fetch";
import https from "https";

import { algoliasearch } from "algoliasearch";
import { config } from "dotenv";

const agent = new https.Agent({
  rejectUnauthorized: false,
});

config();
let url = process.env.SERVER_PRODUCTS;

const client = algoliasearch(
  process.env.ALGOLIA_APPLICATION_ID,
  process.env.ALGOLIA_API_KEY
);
const indexName = "ecommerce";

fetch(url, { method: "Get", agent })
  .then((res) => res.json())
  .then(async (json) => {
    try {
      const array = [];

      //ARRAY PER FILTRI
      let allLanguages = [];
      let allConditions = [];
      let allTypes = [];
      let allTcg = [];

      for (let item of json.products) {
        const languageOptionId = getOptionId(item.options, "Lingua");
        const conditionOptionId = getOptionId(item.options, "Condizioni");

        let quantity = 0;

        allTypes.push(item.material);
        allTcg.push(item.type ? item.type.value : "NA");

        const variantsDetails = item.variants.map((variant) => {
          quantity += variant.inventory_quantity;
          return {
            id: variant.id,
            language: getOptionValue(variant.options, languageOptionId),
            condition: getOptionValue(variant.options, conditionOptionId),
            price: getLowestPrice(variant.prices) / 100,
          };
        });

        let languages = item.variants.map((variant) =>
          getOptionValue(variant.options, languageOptionId)
        );
        languages = languages.filter((item, i, ar) => ar.indexOf(item) === i);
        allLanguages = allLanguages.concat(languages);

        let conditions = item.variants.map((variant) =>
          getOptionValue(variant.options, conditionOptionId)
        );
        conditions = conditions.filter((item, i, ar) => ar.indexOf(item) === i);
        allConditions = allConditions.concat(conditions);

        const obj = {
          objectID: item.id,
          name: item.title,
          code: getCardCode(item.title),
          shortDescription: item.description,
          thumbnailImage: item.thumbnail,
          salePrice: processVariants(item.variants) / 100,
          tcg: item.type ? item.type.value : "N.A.",
          type: item.material,
          images: item.images.map((image) => {
            return image.url;
          }),
          expansion: item.collection ? item.collection.title : "N.A.",
          tags: item.tags.map((tag) => {
            return tag.value;
          }),
          variantsDetails: variantsDetails,
          languages: languages,
          conditions: conditions,
          quantity: quantity,
          available: quantity > 0,
        };
        array.push(obj);
      }

      const filtersArray = createFilterIndexObjects(
        allLanguages,
        allConditions,
        allTypes,
        allTcg
      );

      client
        .saveObjects({
          indexName: "ecommerce",
          objects: array,
        })
        .then((val) => {
          console.log("Prodotti Salvati");
        });

      client
        .saveObjects({
          indexName: "filters",
          objects: filtersArray,
        })
        .then((val) => {
          console.log("Filtri Salvati");
        });
    } catch (error) {
      console.log(error);
    }
  });

function createFilterIndexObjects(
  allLanguages,
  allConditions,
  allTypes,
  allTcg
) {
  allLanguages = allLanguages.filter(
    (item, i, ar) => ar.indexOf(item) === i && item != null
  );
  allConditions = allConditions.filter(
    (item, i, ar) => ar.indexOf(item) === i && item != null
  );
  allTypes = allTypes.filter(
    (item, i, ar) => ar.indexOf(item) === i && item != null
  );
  allTcg = allTcg.filter(
    (item, i, ar) => ar.indexOf(item) === i && item != null
  );

  return [
    { name: "language", value: allLanguages, objectID: "languageFilter" },
    { name: "condition", value: allConditions, objectID: "conditionFilter" },
    { name: "brand", value: allTcg, objectID: "brandFilter" },
    { name: "available", value: [true, false], objectID: "availableFilter" },
  ];
}

function getOptionId(options, title) {
  const option = options.find(
    (opt) => opt.title.toLowerCase() === title.toLowerCase()
  );
  return option ? option.id : null;
}

function getOptionValue(options, optionId) {
  const option = options.find((opt) => opt.option_id === optionId);
  return option ? option.value : null;
}

function processVariants(variants) {
  if (!variants) return 0;
  return variants.reduce((lowestPrice, variant) => {
    const variantLowestPrice = getLowestPrice(variant.prices);
    return variantLowestPrice < lowestPrice ? variantLowestPrice : lowestPrice;
  }, Infinity);
}

function getLowestPrice(prices) {
  if (!prices || prices.length === 0) return Infinity;
  return prices.reduce(
    (min, p) => (p.amount < min ? p.amount : min),
    prices[0].amount
  );
}

function getCardCode(inputString) {
  const regex = /\(([^)]+)\)/;
  const match = inputString.match(regex);
  return match ? match[1] : null;
}
