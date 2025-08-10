export const PRODUCTS_COLLECTION = "ecommerce";
export const FILTERS_COLLECTION = "filters";

export const HIGHLIGHTS_TAG = "EVIDENZA";
export const WHATSNEW_TAG = "NOVITA";
export const DEALS_TAG = "OFFERTA";
export const HEROBANNER_TAG = "HEROBANNER";
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

export const HEADER_MENU = [
  {
    name: "Pokemon",
    to: "/pokemon/all",
    subMenu: [
      {
        label: "Booster box",
        to: "/pokemon/booster-box",
        image:
          "https://honorable-belief-ab1c5a7281.media.strapiapp.com/boosterbox_1085522f93.jpg",
      },
      {
        label: "Mazzi precostruiti",
        to: "/pokemon/mazzi",
        image:
          "https://honorable-belief-ab1c5a7281.media.strapiapp.com/precostructed_f003e10a67.jpg",
      },
      {
        label: "Tins",
        to: "/pokemon/tins",
        image:
          "https://honorable-belief-ab1c5a7281.media.strapiapp.com/tins_1c70a3d0aa.jpg",
      },
      {
        label: "Box set",
        to: "/pokemon/box-set",
        image:
          "https://honorable-belief-ab1c5a7281.media.strapiapp.com/box_set_cfea8afe3e.jpg",
      },
      {
        label: "Bundle",
        to: "/pokemon/bundle",
        image:
          "https://honorable-belief-ab1c5a7281.media.strapiapp.com/bundle_e72222d39a.jpg",
      },
      {
        label: "Carte singole",
        to: "/pokemon/singole",
        image:
          "https://honorable-belief-ab1c5a7281.media.strapiapp.com/overszed_282600fca5.jpg",
      },
    ],
  },
  {
    name: "One Piece",
    to: "/one-piece/all",
    subMenu: [],
  },
  { name: "Final Fantasy", to: "/final-fantasy/all", subMenu: [] },
  { name: "Dragon Ball", to: "/dragon-ball/all", subMenu: [] },
  { name: "Lorcana", to: "/lorcana/all", subMenu: [] },
];

export enum TcgSlug {
  "dragon-ball-super" = "Dragon Ball Super",
  "one-piece" = "One Piece",
  "pokémon" = "Pokémon",
}
