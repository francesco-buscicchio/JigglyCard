/**
 * Voci di navigazione, servite dal CMS a partire dal catalogo CardTrader.
 *
 * Il negozio vende un solo gioco (vedi `SHOP_GAME`), quindi il livello "gioco"
 * sparisce: le voci principali sono direttamente le sue categorie, senza
 * tendine. La forma resta quella di prima, così HeaderDesktop, MobileMenu e
 * ListingTitle continuano a funzionare.
 */
const useMenu = async (): Promise<MenuItemType[]> => {
  const { getMenu } = useShop();
  // `useI18n` va invocata prima di qualunque await, finché il contesto del
  // componente è ancora attivo.
  const { t, te } = useI18n();

  const menu = await getMenu().catch(() => ({ tree: [] }));

  const categories = (menu.tree ?? []).flatMap((game) =>
    sortCategories(game.categories).map((category) => ({
      name: translateCategory(category.slug, category.name, game.name, t, te),
      image: category.coverImage,
      to: `/${game.slug}/${category.slug}`,
      isSubMenuOpen: false,
      subMenu: [],
    })),
  );

  // Il Pokédex non è una categoria del CMS, ma sta nel menu come le altre.
  return [
    ...categories,
    { name: t("pokedex.menu"), to: "/pokedex", isSubMenuOpen: false, subMenu: [] },
  ];
};

/**
 * Ordine delle voci: prima ciò che si vende di più, in fondo gli accessori.
 * Le categorie arrivano dal CMS in ordine alfabetico di slug; quelle non
 * previste finiscono in coda nell'ordine originale.
 */
const CATEGORY_ORDER = [
  "singles",
  "booster",
  "box-set",
  "blister",
  "deck",
  "storage",
];

const sortCategories = <T extends { slug: string }>(categories: T[]) => {
  const rank = (slug: string) => {
    const index = CATEGORY_ORDER.findIndex((key) => slug.includes(key));
    return index === -1 ? CATEGORY_ORDER.length : index;
  };
  return [...categories].sort((a, b) => rank(a.slug) - rank(b.slug));
};

/**
 * Etichetta della categoria in lingua.
 *
 * CardTrader espone solo nomi inglesi, che per giunta ripetono il nome del
 * gioco ("Pokémon Singles") mentre nel menu il gioco è già l'etichetta padre.
 * Le categorie sono poche e stabili, quindi si traducono per slug; senza
 * traduzione si ricade sul nome originale privato del prefisso.
 */
export const translateCategory = (
  slug: string,
  name: string,
  gameName: string,
  t: (key: string) => string,
  te: (key: string) => boolean,
) => {
  const key = `category.${slug}`;
  if (te(key)) return t(key);
  return stripGamePrefix(name, gameName);
};

const stripGamePrefix = (label: string, gameName: string) => {
  const trimmed = label.trim();
  const prefix = gameName.trim().toLowerCase();
  if (!prefix || !trimmed.toLowerCase().startsWith(prefix)) return trimmed;

  return trimmed.slice(prefix.length).replace(/^[-–—:\s]+/, "").trim() || trimmed;
};

export type MenuItemType = {
  name: string;
  /** Anteprima della categoria. */
  image?: string;
  to: string;
  subMenu: {
    label: string;
    image?: string;
    to: string;
  }[];
  isSubMenuOpen?: boolean;
};

export default useMenu;
