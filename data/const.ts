export const PRODUCTS_COLLECTION = "ecommerce";
export const FILTERS_COLLECTION = "filters";

/** Sezione "In evidenza": selezione curata, marcata con questo tag nel CMS. */
export const HIGHLIGHTS_TAG = "EVIDENZA";

/**
 * Fascia di prezzo della vetrina automatica, usata quando nessun prodotto è
 * marcato in evidenza.
 *
 * Il minimo tiene fuori le carte comuni da pochi centesimi; il massimo esclude
 * i prezzi di parcheggio (migliaia di euro) con cui su CardTrader si tiene un
 * pezzo fuori mercato senza rimuoverlo.
 */
/** Quanti set recenti alimentano la vetrina "In evidenza". */
export const HIGHLIGHT_RECENT_SETS = 40;

export const HIGHLIGHT_MIN_PRICE_CENTS = 500;
export const HIGHLIGHT_MAX_PRICE_CENTS = 50000;

/**
 * Sezione "Offerte": rarità mostrata in vetrina, dalla più economica.
 * Le altre sezioni non usano tag — "Novità" ordina per data di ingresso a
 * magazzino e la vetrina in cima mostra i set di uscita più recente.
 */
export const DEALS_RARITY = "Illustration Rare";
export const SUGGESTED = "SUGGESTED";

export const ITEMS_FOR_PAGE_MOBILE = 9;
export const ITEMS_FOR_PAGE_DESKTOP = 12;

export const FOOTER_MENU_ITEMS = [
  { link: "about", route: "/about" },
  { link: "shipping", route: "/spedizioni" },
  { link: "support", route: "/assistenza" },
];

export const PATH = {
  HOME: "/",
  CART: "/carrello",
  CHECKOUT: "/checkout",
};

export const email = "jigglycard@gmail.com";
export const phoneNumber = "+39 351 5223779";

export const availableLanguages = [
  { code: "IT", name: "italian" },
  { code: "EN", name: "english" },
  { code: "JP", name: "japanese" },
];

export const availableConditions = [
  { code: "NM", name: "near_mint" },
  { code: "EX", name: "excellent" },
  { code: "GD", name: "good" },
  { code: "PL", name: "played" },
  { code: "PO", name: "poor" },
];
export const preferredLanguageOrder = ["IT", "EN", "JP"];

export const VIEWPORTS = {
  SM: 640, // small: >= 640px
  MD: 768, // medium: >= 768px
  LG: 1024, // large: >= 1024px
  XL: 1280, // extra-large: >= 1280px
  XXL: 1536, // 2x extra-large: >= 1536px
};


export enum TcgSlug {
  "dragon-ball-super" = "Dragon Ball Super",
  "one-piece" = "One Piece",
  "pokémon" = "Pokémon",
  "pokemon" = "Pokémon",
}

/**
 * Chiave in sessionStorage con i dati dell'ordine in attesa di conferma.
 *
 * Il pagamento Stripe porta l'utente fuori dal sito e lo riporta sulla pagina
 * di acquisto completato: il payload dell'ordine deve sopravvivere a quel
 * viaggio per poter essere inviato al CMS solo a pagamento riuscito.
 */
export const PENDING_ORDER_STORAGE_KEY = "jigglycard_pending_order";
