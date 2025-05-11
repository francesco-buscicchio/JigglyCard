import { strapi } from "@strapi/client";
import axios from "axios";
import { config } from "dotenv";

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

createProductsOnStrapi();

async function createProductsOnStrapi() {
  //const { expansions, categories, products } = await getAllData();

  const categoryExists = await variantsIndex.find({
    locale: "en",
  });

  const document = await strapi.documents("api::variant.variant").findOne({
    documentId: "a1b2c3d4e5f6g7h8i9j0klm",
  });
  console.log(categoryExists);
  console.log(document);
  // for (let product of products) {
  //   const categoryID = product.category_id;
  //   // const categoryExists = await categoriesIndex.find({
  //   //   locale: "en",
  //   //   cardtraderID: categoryID,
  //   // });

  //   // if (categoryExists.length === 0) {
  //   //   const category = categories.find((cat) => cat.id === categoryID);
  //   //   const categoryData = {
  //   //     name: category.name,
  //   //     cardtraderID: category.id,
  //   //     createdAt: new Date(),
  //   //     updatedAt: new Date(),
  //   //   };
  //   //   await categoriesIndex.create(categoryData);
  //   // }

  //   // const result = await productsIndex.find({
  //   //   locale: "en",
  //   //   code: "160",
  //   // });
  //   // console.log(result);
  //   //const { expansions, categories, products } = await getAllData();

  //   // for(let product of products){
  //   //   const obj = {

  //   //   }
  //   // }
  // }
}

async function getAllData() {
  try {
    const expansions = await getExpansionsCardTrader();
    const categories = await getCategoriesCardTrader();
    const products = await getProductsCardTrader();

    return { expansions, categories, products };
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
