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

export const FOOTER_MENU_ITEMS = [
  { link: "about", route: "/chi-siamo" },
  { link: "shipping", route: "/spedizioni" },
  { link: "support", route: "/assistenza" },
];

/**
 * Il negozio vende solo Pokémon. Il CMS sincronizza da CardTrader anche gli
 * altri giochi: il filtro sta nelle rotte `server/api/shop/*`, così menu,
 * ricerca, vetrine e schede prodotto restano coerenti senza toccare il CMS.
 */
export const SHOP_GAME = "pokemon";

/**
 * Lingua delle buste aperte virtualmente in home: il negozio tratta le buste
 * giapponesi, e le carte che "escono" sono le singole giapponesi dello stesso
 * set. È il valore di lingua delle varianti CardTrader.
 */
export const PACK_OPENING_LANGUAGE = "jp";

export const PATH = {
  HOME: "/",
  CART: "/carrello",
  CHECKOUT: "/checkout",
};

/**
 * Dati del venditore: un'unica fonte per footer, condizioni di vendita,
 * informative ed email d'ordine (identificazione obbligatoria per il commercio
 * elettronico, D.Lgs. 70/2003 art. 7 e Codice del Consumo art. 49).
 */
export const SELLER = {
  name: "Jigglycard di Francesco Buscicchio",
  street: "Via Principe Amedeo 94",
  zip: "74123",
  city: "Taranto",
  province: "TA",
  country: "Italia",
  vatNumber: "IT03416880734",
  taxCode: "BSCFNC00P06L049C",
  email: "jigglycard@gmail.com",
  phone: "+39 351 522 3779",
  website: "https://www.jigglycard.com",
} as const;

export const SELLER_ADDRESS = `${SELLER.street}, ${SELLER.zip} ${SELLER.city} (${SELLER.province})`;

export const email = SELLER.email;
export const phoneNumber = SELLER.phone;

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
