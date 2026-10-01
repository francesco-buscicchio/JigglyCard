import { defineStore } from "pinia";

const STORAGE_KEY = "jigglycard_cart";

/**
 * Chiavi del vecchio carrello Strapi: il carrello viveva sul server con una
 * sessione di 30 minuti. Vanno ripulite dai browser che le hanno ancora.
 */
const LEGACY_KEYS = [
  "jiggly_cart_id",
  "jiggly_cart_session_id",
  "jiggly_cart_expired_date",
];

export type CartLine = {
  variantId: string;
  blueprintId: number;
  productSlug: string;
  name: string;
  imageUrl: string;
  language: string;
  condition: string;
  /** In centesimi, come il CMS: gli arrotondamenti in euro si accumulano. */
  priceCents: number;
  quantity: number;
  /** Ultima disponibilità nota, aggiornata da `revalidate()`. */
  availableQuantity: number;
};

export type CartStockIssue = {
  variantId: string;
  name: string;
  requested: number;
  available: number;
};

/**
 * Carrello interamente lato browser.
 *
 * Non prenota nulla: la merce viene impegnata solo al checkout, con un
 * decremento atomico sul CMS. Aggiungere al carrello non deve poter bloccare
 * il magazzino, altrimenti i carrelli abbandonati renderebbero invendibile
 * merce disponibile.
 */
export const useCartStore = defineStore("cart", {
  state: () => ({
    lines: [] as CartLine[],
    hydrated: false,
    couponCode: "" as string,
    couponDiscountCents: 0,
    couponFreeShipping: false,
    couponError: "" as string,
  }),

  getters: {
    itemCount: (state) =>
      state.lines.reduce((total, line) => total + line.quantity, 0),
    itemsTotalCents: (state) =>
      state.lines.reduce(
        (total, line) => total + line.priceCents * line.quantity,
        0,
      ),
    isEmpty: (state) => state.lines.length === 0,
  },

  actions: {
    hydrate() {
      if (!import.meta.client || this.hydrated) return;
      this.hydrated = true;

      for (const key of LEGACY_KEYS) localStorage.removeItem(key);

      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : null;
        if (Array.isArray(parsed?.lines)) this.lines = parsed.lines;
        this.couponCode = String(parsed?.couponCode ?? "");
      } catch {
        this.lines = [];
      }
    },

    persist() {
      if (!import.meta.client) return;
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ lines: this.lines, couponCode: this.couponCode }),
      );
    },

    addLine(line: Omit<CartLine, "quantity">, quantity = 1) {
      this.hydrate();
      const existing = this.lines.find(
        (entry) => entry.variantId === line.variantId,
      );

      if (existing) {
        existing.quantity = Math.min(
          existing.quantity + quantity,
          line.availableQuantity,
        );
        existing.priceCents = line.priceCents;
        existing.availableQuantity = line.availableQuantity;
      } else {
        this.lines.push({
          ...line,
          quantity: Math.min(quantity, line.availableQuantity),
        });
      }

      this.persist();
    },

    setQuantity(variantId: string, quantity: number) {
      const line = this.lines.find((entry) => entry.variantId === variantId);
      if (!line) return;

      if (quantity <= 0) {
        this.removeLine(variantId);
        return;
      }

      line.quantity = Math.min(quantity, line.availableQuantity);
      this.persist();
    },

    removeLine(variantId: string) {
      this.lines = this.lines.filter((entry) => entry.variantId !== variantId);
      this.persist();
    },

    clear() {
      this.lines = [];
      this.couponCode = "";
      this.couponDiscountCents = 0;
      this.couponFreeShipping = false;
      this.couponError = "";
      this.persist();
    },

    /**
     * Riallinea prezzi e disponibilità sul catalogo reale.
     *
     * Il carrello può restare aperto per giorni, e nel frattempo lo stesso
     * pezzo può essere venduto su CardTrader: senza questo controllo l'utente
     * scoprirebbe il problema solo al pagamento.
     */
    async revalidate(): Promise<CartStockIssue[]> {
      this.hydrate();
      if (!this.lines.length) return [];

      const { getProduct } = useShop();
      const issues: CartStockIssue[] = [];
      const slugs = Array.from(new Set(this.lines.map((line) => line.productSlug)));

      const products = await Promise.all(
        slugs.map((slug) => getProduct(slug).catch(() => null)),
      );

      const variants = new Map<string, { priceCents: number; quantity: number }>();
      for (const product of products) {
        for (const variant of product?.variants ?? []) {
          variants.set(variant.variantId, {
            priceCents: variant.priceCents,
            quantity: variant.quantity,
          });
        }
      }

      for (const line of [...this.lines]) {
        const live = variants.get(line.variantId);

        if (!live || live.quantity <= 0) {
          issues.push({
            variantId: line.variantId,
            name: line.name,
            requested: line.quantity,
            available: 0,
          });
          this.removeLine(line.variantId);
          continue;
        }

        line.priceCents = live.priceCents;
        line.availableQuantity = live.quantity;

        if (line.quantity > live.quantity) {
          issues.push({
            variantId: line.variantId,
            name: line.name,
            requested: line.quantity,
            available: live.quantity,
          });
          line.quantity = live.quantity;
        }
      }

      this.persist();
      return issues;
    },

    async applyCoupon(code: string) {
      const { validateCoupon } = useShop();
      this.couponError = "";

      const result = await validateCoupon(code, this.itemsTotalCents);
      if (!result.valid) {
        this.couponError = result.reason;
        this.removeCoupon();
        return false;
      }

      this.couponCode = result.code;
      this.couponDiscountCents = result.discountCents;
      this.couponFreeShipping = result.freeShipping;
      this.persist();
      return true;
    },

    removeCoupon() {
      this.couponCode = "";
      this.couponDiscountCents = 0;
      this.couponFreeShipping = false;
      this.persist();
    },
  },
});
