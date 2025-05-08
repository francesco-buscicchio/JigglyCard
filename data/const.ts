export const PRODUCTS_COLLECTION = "ecommerce";
export const FILTERS_COLLECTION = "filters";

export const HIGHLIGHTS_TAG = "EVIDENZA";
export const WHATSNEW_TAG = "NOVITA";
export const DEALS_TAG = "OFFERTA";
export const HEROBANNER_TAG = "HEROBANNER";
export const SUGGESTED = "SUGGESTED";
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
export const ITEMS_FOR_PAGE_MOBILE = 9;
export const ITEMS_FOR_PAGE_DESKTOP = 12;
// TODO: controllare se le route sono corrette
export const FOOTER_MENU_ITEMS = [
  { link: "about", route: "/about" },
  { link: "shipping", route: "/spedizioni" },
  { link: "support", route: "/assistenza" },
];

export const PATH = {
  HOME: "/",
  CART: "/carrello",
};

export const VIEWPORTS = {
  SM: 640, // small: >= 640px
  MD: 768, // medium: >= 768px
  LG: 1024, // large: >= 1024px
  XL: 1280, // extra-large: >= 1280px
  XXL: 1536, // 2x extra-large: >= 1536px
};
