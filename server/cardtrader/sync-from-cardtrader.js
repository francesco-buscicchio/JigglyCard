import axios from "axios";
import fetch from "node-fetch";
import Medusa from "@medusajs/medusa-js";

import { config } from "dotenv";

config();
let authToken = process.env.CARDTRADER_JWT_TOKEN;

//GESTIONE CHIAMATE POST
const sendPostRequest = async (url, data, headers) => {
  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error(
      "Error making POST request:",
      error.response ? error.response.data : error.message
    );
    throw error; // Rilancia l'errore per un eventuale handling esterno
  }
};

//GESTIONE CHIAMATE GET
const getCardTraderData = async (endpoint) => {
  const baseURL = "https://api.cardtrader.com/api/v2";

  try {
    const response = await axios.get(`${baseURL}/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data from CardTrader API:", error);
    throw error;
  }
};

//GESTIONE ACQUISIZIONE DATI
const gatAllProducts = async () => {
  const products = await getCardTraderData("/products/export");
  return products;
};

const getAllGames = async () => {
  const resultGames = await getCardTraderData("games");
  return resultGames;
};

//INSERIMENTO DATI MEDUSA
const postProductToMedusa = async () => {
  const BACKEND_URL = "https://server.serverjigglycards.com";
  const currency_code = "EUR"; // Sostituisci con il tuo codice valuta effettivo
  const categoryId = "your_category_id"; // Sostituisci con il tuo ID categoria effettivo
  const typeValue = "your_type_value"; // Sostituisci con il valore del tipo di prodotto
  const tagValue = "your_tag_value"; // Sostituisci con il valore del tag del prodotto

  const response = await fetch(`${BACKEND_URL}/admin/products`, {
    credentials: "include", // Opzionale in Node.js, usato tipicamente in browser
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: {
      title: "Shirt",
      options: [
        {
          title: "Color",
        },
        {
          title: "Size",
        },
      ],
      variants: [
        {
          title: "White Small Shirt",
          prices: [
            {
              amount: 1000,
              currency_code,
            },
          ],
          options: [
            {
              value: "White",
            },
            {
              value: "Small",
            },
          ],
        },
      ],
    },
  });

  const data = await response.json();
};

const getBearerToken = async () => {
  const url = "https://server.serverjigglycards.com/admin/auth";
  const responseData = await sendPostRequest(url, {
    email: "buscicchio2022@gmail.com",
    password: "Shinichi23!",
  });

  console.log(responseData);
  return responseData;
};

const alignMedusa = async () => {
  //await getBearerToken();
  //   let products = await gatAllProducts();
  //   const games = await getAllGames();
  //   products = products.slice(0, 10);
  //   await postDataToMedusa();
  //   //console.log(products);
};

getBearerToken();
