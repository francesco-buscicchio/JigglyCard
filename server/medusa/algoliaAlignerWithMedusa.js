import fetch from "node-fetch";

import { algoliasearch } from "algoliasearch";
import { config } from "dotenv";

config();
let url = "https://server.serverjigglycards.com/store/products";
let settings = { method: "Get" };

const client = algoliasearch(
  process.env.ALGOLIA_APPLICATION_ID,
  process.env.ALGOLIA_API_KEY
);
const indexName = "ecommerce";

fetch(url, settings)
  .then((res) => res.json())
  .then(async (json) => {
    try {
      const array = [];
      for (let item of json.products) {
        const languageOptionId = getOptionId(item.options, "Lingua");
        const conditionOptionId = getOptionId(item.options, "Condizioni");

        const variantsDetails = item.variants.map(variant => {
          return {
            language: getOptionValue(variant.options, languageOptionId),
            condition: getOptionValue(variant.options, conditionOptionId),
            price: getLowestPrice(variant.prices) / 100
          };
        });

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
          variantsDetails: variantsDetails
        };
        array.push(obj);
      }
      client
        .saveObjects({
          indexName: "ecommerce",
          objects: array,
        })
        .then((val) => {
          console.log(val);
        });
    } catch (error) {
      console.log(error);
    }
  });

function getOptionId(options, title) {
  const option = options.find(opt => opt.title.toLowerCase() === title.toLowerCase());
  return option ? option.id : null;
}

function getOptionValue(options, optionId) {
  const option = options.find(opt => opt.option_id === optionId);
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
