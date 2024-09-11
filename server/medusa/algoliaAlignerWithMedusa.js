import fetch from "node-fetch";
import algoliasearch from "algoliasearch";
import { config } from "dotenv";

config();
let url = "https://server.serverjigglycards.com/store/products";
let settings = { method: "Get" };
const applicationId = process.env.ALGOLIA_APPLICATION_ID;
const apiKey = process.env.ALGOLIA_API_KEY;
const indexName = "ecommerce";

fetch(url, settings)
  .then((res) => res.json())
  .then(async (json) => {
    try {
      const array = [];
      for (let item of json.products) {
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
        };
        array.push(obj);
      }

      const client = algoliasearch(applicationId, apiKey);
      const index = client.initIndex(indexName);
      await index.saveObjects(array).then();
    } catch (error) {
      console.log(error);
    }
  });

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
