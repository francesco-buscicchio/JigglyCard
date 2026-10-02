import type { ProductType } from "~/types/productType.type";
import type { ShowcaseCard } from "~/types/showcaseCard.type";
// WebP a 600px: il PNG originale pesava quasi 700 KB per una carta in vetrina.
import blastoise from "~/assets/blastoise_ex_mew_009.webp";
import kingdra from "~/assets/img/ASR_TG03.jpg";
import trainerGallery08 from "~/assets/img/ASR_TG08.jpg";
import trainerGallery15 from "~/assets/img/ASR_TG15.png";
import trainerGallery17 from "~/assets/img/ASR_TG17.jpg";
import trainerGallery29 from "~/assets/img/AST_TG29.jpg";

export const productToShowcaseCard = (product: ProductType): ShowcaseCard => ({
  key: product.id,
  name: product.productName,
  image: product.imageUrl,
  imageLarge: product.imageUrlLarge || product.imageUrl,
  expansion: product.expansion,
  price: product.price,
  url: `/${product.tcgSlug}/${product.categorySlug}/${product.id}`,
  available: product.available,
});

/**
 * Rarità dalla più ambita alla più comune, riconosciute per parola chiave: i
 * nomi CardTrader variano fra set inglesi e giapponesi ("Special Illustration
 * Rare", "Special Art Rare", "Super Rare"…). L'ordine dei controlli conta:
 * "special illustration" va prima di "illustration", "uncommon" di "common".
 */
const RARITY_ORDER = [
  "special illustration",
  "special art",
  "hyper",
  "secret",
  "gold",
  "illustration",
  "character",
  "art rare",
  "ultra",
  "super rare",
  "full art",
  "double rare",
  "ace spec",
  "amazing",
  "radiant",
  "shiny",
  "holo",
  "rare",
  "uncommon",
  "common",
];

/** 0 = la più ambita; le rarità sconosciute stanno appena sopra le comuni. */
export const rarityRank = (rarity = "") => {
  const value = rarity.toLowerCase();
  const index = RARITY_ORDER.findIndex((key) => value.includes(key));
  return index === -1 ? RARITY_ORDER.length - 2.5 : index;
};

/** Ordina dalla carta più "hit" alla più comune: rarità, poi prezzo. */
export const byPullValue = (a: ShowcaseCard, b: ShowcaseCard) =>
  rarityRank(a.rarity) - rarityRank(b.rarity) ||
  Number(b.price ?? 0) - Number(a.price ?? 0);

/**
 * Una busta: le carte più comuni davanti e la migliore in fondo, come nelle
 * buste vere. La hit esce a caso fra le tre più ambite, le altre a caso fra
 * il resto, così due aperture dello stesso set non sono mai uguali.
 */
export const drawPackHand = (cards: ShowcaseCard[], size: number) => {
  const shuffle = <T>(list: T[]) => {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };
  const ranked = [...cards].sort(byPullValue);
  const hit = shuffle(ranked.slice(0, Math.min(3, ranked.length)))[0];
  const rest = shuffle(ranked.filter((card) => card.key !== hit.key))
    .slice(0, size - 1)
    .sort((a, b) => byPullValue(b, a));
  return [...rest, hit];
};

/**
 * Carte d'esempio, già nel repository: tengono in piedi le animazioni quando
 * il catalogo non risponde. Non hanno link né prezzo, perché non sono
 * prodotti in vendita.
 */
export const FALLBACK_SHOWCASE_CARDS: ShowcaseCard[] = [
  { key: "fallback-blastoise", name: "Blastoise ex", image: blastoise, imageLarge: blastoise },
  { key: "fallback-kingdra", name: "Kingdra", image: kingdra, imageLarge: kingdra },
  { key: "fallback-tg08", name: "Trainer Gallery", image: trainerGallery08, imageLarge: trainerGallery08 },
  { key: "fallback-tg15", name: "Trainer Gallery", image: trainerGallery15, imageLarge: trainerGallery15 },
  { key: "fallback-tg17", name: "Trainer Gallery", image: trainerGallery17, imageLarge: trainerGallery17 },
  { key: "fallback-tg29", name: "Trainer Gallery", image: trainerGallery29, imageLarge: trainerGallery29 },
];

/**
 * Completa una lista corta con le carte d'esempio, senza doppioni. `exclude`
 * tiene fuori le carte già mostrate altrove nella stessa scena.
 */
export const withFallbackCards = (
  cards: ShowcaseCard[],
  count: number,
  exclude: string[] = [],
) => {
  const withImage = cards.filter(
    (card) => card.image && !exclude.includes(card.key),
  );
  if (withImage.length >= count) return withImage.slice(0, count);
  const filler = FALLBACK_SHOWCASE_CARDS.filter(
    (card) =>
      !exclude.includes(card.key) &&
      !withImage.some((existing) => existing.key === card.key),
  );
  return [...withImage, ...filler].slice(0, count);
};
