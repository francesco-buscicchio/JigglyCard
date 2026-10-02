import type {
  CheckoutCustomerPayload,
  CheckoutReservation,
  CheckoutReservationFailure,
  CmsCouponValidation,
  CmsExpansion,
  CmsMenu,
  CmsProduct,
  CmsProductList,
  CmsShippingMethod,
  OrderConfirmation,
} from "~/types/shop";

export type ShopCatalogFilters = {
  search?: string;
  game?: string;
  category?: string;
  expansion?: string;
  tag?: string;
  language?: string[];
  condition?: string[];
  rarity?: string[];
  available?: boolean;
  hasImage?: boolean;
  hasHdImage?: boolean;
  singlesOnly?: boolean;
  minPriceCents?: number;
  maxPriceCents?: number;
  sort?: string;
  page?: number;
  perPage?: number;
};

const toQuery = (filters: ShopCatalogFilters) => {
  const query: Record<string, string | number> = {};

  if (filters.search) query.search = filters.search;
  if (filters.game) query.game = filters.game;
  if (filters.category) query.category = filters.category;
  if (filters.expansion) query.expansion = filters.expansion;
  if (filters.tag) query.tag = filters.tag;
  if (filters.language?.length) query.language = filters.language.join(",");
  if (filters.condition?.length) query.condition = filters.condition.join(",");
  if (filters.rarity?.length) query.rarity = filters.rarity.join(",");
  if (filters.available !== undefined) query.available = String(filters.available);
  if (filters.hasImage) query.hasImage = "true";
  if (filters.hasHdImage) query.hasHdImage = "true";
  if (filters.singlesOnly) query.singlesOnly = "true";
  if (filters.minPriceCents !== undefined) {
    query.minPriceCents = filters.minPriceCents;
  }
  if (filters.maxPriceCents !== undefined) {
    query.maxPriceCents = filters.maxPriceCents;
  }
  if (filters.sort) query.sort = filters.sort;
  if (filters.page) query.page = filters.page;
  if (filters.perPage) query.perPage = filters.perPage;

  return query;
};

/**
 * Unico punto di accesso ai dati del negozio.
 *
 * Tutto passa dalle rotte `server/api/shop/*`, che a loro volta parlano con il
 * CMS usando il secret storefront: il browser non conosce né l'indirizzo del
 * CMS né la sua chiave.
 */
export function useShop() {
  const getProducts = (filters: ShopCatalogFilters = {}) =>
    $fetch<CmsProductList>("/api/shop/products", { query: toQuery(filters) });

  const getProduct = (slug: string) =>
    $fetch<CmsProduct>(`/api/shop/products/${encodeURIComponent(slug)}`);

  const getMenu = () => $fetch<CmsMenu>("/api/shop/menu");

  const getExpansions = (options: { limit?: number; minProducts?: number } = {}) =>
    $fetch<{ items: CmsExpansion[] }>("/api/shop/expansions", {
      query: options,
    });

  /**
   * Consigliati a partire dal carrello e dalle schede viste di recente.
   * Gli slug restano nel browser: qui viaggiano solo per questa richiesta.
   */
  const getRecommended = (payload: {
    seedSlugs: string[];
    excludeSlugs?: string[];
    limit?: number;
  }) =>
    $fetch<{ items: CmsProduct[] }>("/api/shop/recommended", {
      method: "POST",
      body: payload,
    });

  const getHome = () =>
    $fetch<{
      highlights: CmsProduct[];
      whatsNew: CmsProduct[];
      deals: CmsProduct[];
    }>("/api/shop/home");

  const getShippingMethods = () =>
    $fetch<{ items: CmsShippingMethod[] }>("/api/shop/shipping-methods");

  const validateCoupon = (code: string, cartTotalCents: number) =>
    $fetch<CmsCouponValidation>("/api/shop/coupons/validate", {
      method: "POST",
      body: { code, cartTotalCents },
    });

  /**
   * Prenota la merce e crea il PaymentIntent, al clic su "Paga". Un 409 non è
   * un errore da nascondere: merce appena venduta, coupon scaduto o prezzo
   * cambiato, cose che l'utente deve vedere prima di pagare. Lo si restituisce
   * come risposta invece di sollevarlo.
   */
  const createCheckoutIntent = async (
    payload: CheckoutCustomerPayload & {
      lines: { variantId: string; quantity: number }[];
      shippingMethodId: string;
      couponCode?: string | null;
      expectedTotalCents: number;
      previousPaymentIntentId?: string;
    },
  ) => {
    type Success = { ok: true; clientSecret: string; paymentIntentId: string } & Omit<
      CheckoutReservation,
      "ok"
    >;
    try {
      return await $fetch<Success | CheckoutReservationFailure>(
        "/api/shop/checkout/intent",
        { method: "POST", body: payload },
      );
    } catch (error: any) {
      const status = error?.statusCode ?? error?.response?.status;
      if (status === 409 && error?.data) return error.data as CheckoutReservationFailure;
      throw error;
    }
  };

  /** Verifica il pagamento su Stripe e chiude l'ordine: basta il PaymentIntent. */
  const confirmOrder = (paymentIntentId: string) =>
    $fetch<OrderConfirmation>("/api/shop/orders/confirm", {
      method: "POST",
      body: { paymentIntentId },
    });

  return {
    getProducts,
    getProduct,
    getMenu,
    getExpansions,
    getRecommended,
    getHome,
    getShippingMethods,
    validateCoupon,
    createCheckoutIntent,
    confirmOrder,
  };
}
