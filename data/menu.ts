export type MenuItemType = {
  name: String;
  subMenu: { name: string; url: string }[] | null;
  isSubMenuOpen?: Boolean;
  url?: string;
};

const menuItems = ref<MenuItemType[]>([
  {
    name: "Pokémon",
    subMenu: [
      { name: "Booster Box", url: "/pokemon/booster-box" },
      { name: "Box Set", url: "/pokemon/box-set" },
      { name: "Bundle", url: "/pokemon/bundle" },
      { name: "Carte Singole", url: "/pokemon/singole" },
      { name: "Mazzi Precostruiti", url: "/pokemon/mazzi-precostruiti" },
      { name: "Tins", url: "/pokemon/tins" },
      { name: "Tutti i Prodotti", url: "/pokemon/all" },
    ],
    isSubMenuOpen: false,
  },
  {
    name: "One Piece",
    subMenu: [
      { name: "Booster Box", url: "/one-piece/booster-box" },
      { name: "Box Set", url: "/one-piece/box-set" },
      { name: "Bundle", url: "/one-piece/bundle" },
      { name: "Carte Singole", url: "/one-piece/singole" },
      { name: "Mazzi Precostruiti", url: "/one-piece/mazzi-precostruiti" },
      { name: "Tins", url: "/one-piece/tins" },
      { name: "Tutti i Prodotti", url: "/one-piece/all" },
    ],
    isSubMenuOpen: false,
  },
  {
    name: "Final Fantasy",
    subMenu: [
      { name: "Booster Box", url: "/final-fantasy/booster-box" },
      { name: "Box Set", url: "/final-fantasy/box-set" },
      { name: "Bundle", url: "/final-fantasy/bundle" },
      { name: "Carte Singole", url: "/final-fantasy/singole" },
      { name: "Mazzi Precostruiti", url: "/final-fantasy/mazzi-precostruiti" },
      { name: "Tins", url: "/final-fantasy/tins" },
      { name: "Tutti i Prodotti", url: "/final-fantasy/all" },
    ],
    isSubMenuOpen: false,
  },
  {
    name: "Dragon Ball",
    subMenu: [
      { name: "Booster Box", url: "/dragon-ball/booster-box" },
      { name: "Box Set", url: "/dragon-ball/box-set" },
      { name: "Bundle", url: "/dragon-ball/bundle" },
      { name: "Carte Singole", url: "/dragon-ball/singole" },
      { name: "Mazzi Precostruiti", url: "/dragon-ball/mazzi-precostruiti" },
      { name: "Tins", url: "/dragon-ball/tins" },
      { name: "Tutti i Prodotti", url: "/dragon-ball/all" },
    ],
    isSubMenuOpen: false,
  },
  {
    name: "Lorcana",

    subMenu: [
      { name: "Booster Box", url: "/lorcana/booster-box" },
      { name: "Box Set", url: "/lorcana/box-set" },
      { name: "Bundle", url: "/lorcana/bundle" },
      { name: "Carte Singole", url: "/lorcana/singole" },
      { name: "Mazzi Precostruiti", url: "/lorcana/mazzi-precostruiti" },
      { name: "Tins", url: "/lorcana/tins" },
      { name: "Tutti i Prodotti", url: "/lorcana/all" },
    ],
    isSubMenuOpen: false,
  },
  { name: "Servizi", subMenu: null, url: "/servizi" },
  { name: "Contatti", subMenu: null, url: "/contatti" },
]);

export default menuItems;
