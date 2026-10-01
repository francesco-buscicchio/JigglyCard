/**
 * Albero di navigazione, servito dal CMS a partire dal catalogo CardTrader.
 *
 * La firma resta invariata rispetto alla versione Algolia, così HeaderDesktop,
 * MobileMenu e ListingTitle non vanno toccati.
 */
const useMenu = async (): Promise<MenuItemType[]> => {
  const { getMenu } = useShop();
  // `useI18n` va invocata prima di qualunque await, finché il contesto del
  // componente è ancora attivo.
  const { t, te } = useI18n();

  const menu = await getMenu().catch(() => ({ tree: [] }));

  return (menu.tree ?? []).map((game) => ({
    name: game.name,
    to: `/${game.slug}/all`,
    isSubMenuOpen: false,
    subMenu: game.categories.map((category) => ({
      label: translateCategory(category.slug, category.name, game.name, t, te),
      image: category.coverImage,
      to: `/${game.slug}/${category.slug}`,
    })),
  }));
};

/**
 * Etichetta della categoria in lingua.
 *
 * CardTrader espone solo nomi inglesi, che per giunta ripetono il nome del
 * gioco ("Pokémon Singles") mentre nel menu il gioco è già l'etichetta padre.
 * Le categorie sono poche e stabili, quindi si traducono per slug; senza
 * traduzione si ricade sul nome originale privato del prefisso.
 */
const translateCategory = (
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
  to: string;
  subMenu: {
    label: string;
    image?: string;
    to: string;
  }[];
  isSubMenuOpen?: boolean;
};

export default useMenu;
