import { mapStorefrontProduct } from "~/mapper/storefront.mapper";
import { HIGHLIGHT_MAX_PRICE_CENTS, PACK_OPENING_LANGUAGE } from "~/data/const";
import { productToShowcaseCard } from "~/utils/showcaseCards";
import type { BoosterPack } from "~/types/boosterPack.type";
import type { ShowcaseCard } from "~/types/showcaseCard.type";
import type { CmsProduct } from "~/types/shop";

/** Carte in una busta virtuale. */
export const PACK_HAND_SIZE = 5;

/** Quante buste proporre al massimo nella scelta. */
const MAX_PACKS = 8;

/** Richieste in corso per set: la home e la busta virtuale chiedono la stessa. */
const pending = new Map<string, Promise<ShowcaseCard[]>>();

/**
 * Le buste giapponesi in vendita e, per ciascuna, le carte singole
 * giapponesi del suo set che sono a magazzino: da qui escono il racconto
 * della home e la busta virtuale.
 *
 * Lo stato è condiviso (`useState`): le due sezioni leggono la stessa busta e
 * le carte di un set si scaricano una volta sola.
 */
export function useBoosterPacks() {
  const { getProducts } = useShop();
  const { locale } = useI18n();

  const packs = useState<BoosterPack[]>("booster-packs", () => []);
  const status = useState<"idle" | "loading" | "ready" | "error">(
    "booster-packs-status",
    () => "idle",
  );
  const cardsBySet = useState<Record<string, ShowcaseCard[]>>(
    "booster-pack-cards",
    () => ({}),
  );
  const singlesCategory = useState("booster-pack-singles", () => "");

  const toCard = (product: CmsProduct): ShowcaseCard => ({
    ...productToShowcaseCard(mapStorefrontProduct(product, locale.value)),
    rarity: product.rarity,
  });

  /**
   * Buste disponibili, tenendo solo quelle il cui set ha abbastanza carte
   * singole per riempire una busta. Il conteggio per set arriva dalle
   * faccette del catalogo: una chiamata sola invece di una per busta.
   *
   * Prima la busta del set più recente: è quella che si apre nella home.
   * L'ordine di uscita lo dà il blueprint della busta, perché CardTrader lo crea
   * quando il set viene pubblicato e gli id crescono nel tempo.
   */
  const loadPacks = async (categories: { booster: string; singles: string }) => {
    if (status.value === "loading" || status.value === "ready") return;
    status.value = "loading";
    singlesCategory.value = categories.singles;

    try {
      const [boosters, singles] = await Promise.all([
        getProducts({
          category: categories.booster,
          language: [PACK_OPENING_LANGUAGE],
          available: true,
          hasImage: true,
          perPage: 48,
          // Fuori i prezzi di parcheggio (migliaia di euro): non sono in vendita.
          maxPriceCents: HIGHLIGHT_MAX_PRICE_CENTS,
        }),
        getProducts({
          category: categories.singles,
          language: [PACK_OPENING_LANGUAGE],
          available: true,
          hasImage: true,
          perPage: 1,
        }),
      ]);

      const inStock = new Map(
        singles.facets.expansions.map((entry) => [entry.value, entry.count]),
      );

      packs.value = [...boosters.items]
        .sort((a, b) => b.blueprintId - a.blueprintId)
        .map((product) => {
          const mapped = mapStorefrontProduct(product, locale.value);
          return {
            key: product.slug,
            name: mapped.productName,
            expansion: mapped.expansion,
            expansionSlug: product.expansionSlug,
            image: mapped.imageUrlLarge || mapped.imageUrl,
            price: mapped.price,
            url: `/${product.gameSlug}/${product.categorySlug}/${product.slug}`,
            cardsInStock: inStock.get(product.expansionSlug) ?? 0,
          };
        })
        .filter((pack) => pack.image && pack.cardsInStock >= PACK_HAND_SIZE)
        .slice(0, MAX_PACKS);

      status.value = "ready";
    } catch {
      packs.value = [];
      status.value = "error";
    }
  };

  /**
   * Carte del set di una busta, dalla più ambita. Se il set non basta a
   * riempire una busta, la busta esce dalla scelta.
   */
  const loadCards = (pack: BoosterPack): Promise<ShowcaseCard[]> => {
    const cached = cardsBySet.value[pack.expansionSlug];
    if (cached) return Promise.resolve(cached);

    const inFlight = pending.get(pack.expansionSlug);
    if (inFlight) return inFlight;

    const request = fetchCards(pack).finally(() =>
      pending.delete(pack.expansionSlug),
    );
    pending.set(pack.expansionSlug, request);
    return request;
  };

  const fetchCards = async (pack: BoosterPack) => {
    const result = await getProducts({
      category: singlesCategory.value || undefined,
      expansion: pack.expansionSlug,
      language: [PACK_OPENING_LANGUAGE],
      available: true,
      hasImage: true,
      perPage: 60,
      sort: "price_desc",
      maxPriceCents: HIGHLIGHT_MAX_PRICE_CENTS,
    }).catch(() => ({ items: [] as CmsProduct[] }));

    const cards = result.items.map(toCard).filter((card) => card.image);
    cardsBySet.value = { ...cardsBySet.value, [pack.expansionSlug]: cards };

    if (cards.length < PACK_HAND_SIZE) {
      packs.value = packs.value.filter((item) => item.key !== pack.key);
    }
    return cards;
  };

  return { packs, status, cardsBySet, loadPacks, loadCards };
}
