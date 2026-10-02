/**
 * Contratto dell'API storefront del CMS, così come arriva alle rotte proxy
 * `server/api/shop/*`. I prezzi viaggiano in centesimi fino al mapper, che li
 * converte in euro per i componenti (che li formattano con `toFixed(2)`).
 */

export type CmsVariant = {
  variantId: string;
  language: string;
  condition: string;
  foil: boolean;
  priceCents: number;
  quantity: number;
};

export type CmsProduct = {
  blueprintId: number;
  slug: string;
  name: string;
  /** Nomi italiani, presenti sui set usciti anche in Italia. */
  nameIt?: string;
  expansionIt?: string;
  description: string;
  game: string;
  gameSlug: string;
  category: string;
  categorySlug: string;
  expansion: string;
  expansionCode: string;
  expansionSlug: string;
  rarity: string;
  collectorNumber: string;
  images: string[];
  /** Variante ad alta risoluzione, per la scheda prodotto. */
  imagesLarge: string[];
  tags: string[];
  languages: string[];
  conditions: string[];
  minPriceCents: number;
  totalAvailableQty: number;
  available: boolean;
  variants: CmsVariant[];
};

export type CmsFacetEntry = {
  value: string;
  count: number;
  /** Nome leggibile, presente sulle faccette che filtrano per slug. */
  label?: string;
};

export type CmsExpansion = {
  slug: string;
  name: string;
  code: string;
  /** Id CardTrader: cresce nel tempo, quindi ordina i set per uscita. */
  expansionId: number | null;
  game: string;
  gameSlug: string;
  categorySlug: string;
  /** Immagine della carta più pregiata del set, usata come copertina. */
  coverImage: string;
  /** Fino a quattro carte del set, per la composizione in vetrina. */
  coverImages: string[];
  coverProduct: string;
  products: number;
  fromPriceCents: number;
};

export type CmsProductList = {
  items: CmsProduct[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  facets: {
    languages: CmsFacetEntry[];
    conditions: CmsFacetEntry[];
    rarities: CmsFacetEntry[];
    games: CmsFacetEntry[];
    categories: CmsFacetEntry[];
    expansions: CmsFacetEntry[];
    price: { min: number; max: number };
  };
};

export type CmsMenuCategory = {
  categoryId: number | null;
  name: string;
  slug: string;
  /** Anteprima della categoria mostrata nel menu a tendina. */
  coverImage: string;
  products: number;
  expansions: { slug: string; name: string; code: string; products: number }[];
};

export type CmsMenu = {
  tree: {
    gameId: number | null;
    name: string;
    slug: string;
    categories: CmsMenuCategory[];
  }[];
  updatedAt: string | null;
};

export type CmsShippingMethod = {
  id: string;
  name: string;
  priceCents: number;
  maxWeight: number | null;
  maxValueCents: number | null;
  international: boolean;
};

export type CmsCouponValidation =
  | { valid: false; reason: string }
  | { valid: true; code: string; discountCents: number; freeShipping: boolean };

export type CheckoutLineIssue = {
  variantId: string;
  /** Nome della carta, quando il CMS la conosce ancora. */
  name?: string;
  reason: "not_found" | "insufficient_stock";
  requested: number;
  available: number;
};

export type CheckoutReservation = {
  ok: true;
  reservationId: string;
  expiresAt: string;
  lines: {
    variantId: string;
    blueprintId: number;
    slug: string;
    name: string;
    imageUrl: string;
    language: string;
    condition: string;
    quantity: number;
    unitPriceCents: number;
  }[];
  shippingMethod: CmsShippingMethod | null;
  coupon: { code: string; discountCents: number; freeShipping: boolean } | null;
  couponError: string | null;
  totals: {
    itemsTotalCents: number;
    discountCents: number;
    shippingCents: number;
    totalCents: number;
  };
};

export type CheckoutReservationFailure = {
  ok: false;
  issues: CheckoutLineIssue[];
  /** Il coupon non vale più: il pagamento non parte. */
  couponError?: string | null;
  /** Il totale del CMS è diverso da quello mostrato: nuovi importi. */
  priceChanged?: boolean;
  totals?: CheckoutReservation["totals"];
  /** Il pagamento precedente era già andato a buon fine. */
  alreadyPaid?: boolean;
  paymentIntentId?: string;
};

export type CheckoutCustomerPayload = {
  customer: { name: string; surname: string; email: string; phone: string };
  address: {
    street: string;
    city: string;
    zip: string;
    province: string;
    country: string;
  };
  invoice: {
    kind: "private" | "company";
    companyName: string;
    taxCode: string;
    vatNumber: string;
    sdiCode: string;
    pec: string;
  } | null;
};

export type OrderConfirmation =
  | { status: "confirmed"; orderNumber: string; email: string; totalCents: number }
  | { status: "processing" }
  | { status: "failed"; paymentStatus: string };
