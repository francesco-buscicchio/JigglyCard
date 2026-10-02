import { computed, onMounted, ref } from "vue";
import { useCartStore, type CartStockIssue } from "~/stores/cart";
import { SHOP_GAME } from "~/data/const";

export type CartItem = {
  id: string;
  /** Scheda prodotto della riga. */
  url: string;
  image: string;
  selectedQuantity: number;
  availableQuantity: number;
  price: number;
  totalPrice: number;
  title: string;
  language: string;
  condition: string;
};

/**
 * Adattatore sopra lo store del carrello.
 *
 * Il carrello non vive più su Strapi ma nel localStorage; questa firma resta
 * quella di prima perché la pagina carrello, il riepilogo e la selezione della
 * spedizione la consumano già così.
 */
export function useCart() {
  const cart = useCartStore();
  const isLoading = ref(true);
  const stockIssues = ref<CartStockIssue[]>([]);

  const products = computed<CartItem[]>(() =>
    cart.lines.map((line) => ({
      id: line.variantId,
      // Le righe vecchie non hanno ancora il link: finché `revalidate()` non lo
      // completa si passa da "tutti i prodotti", la scheda vuole solo lo slug.
      url: line.productUrl ?? `/${SHOP_GAME}/all/${line.productSlug}`,
      image: line.imageUrl,
      selectedQuantity: line.quantity,
      availableQuantity: line.availableQuantity,
      price: line.priceCents / 100,
      totalPrice: (line.priceCents * line.quantity) / 100,
      title: line.name,
      language: line.language,
      condition: line.condition,
    })),
  );

  const totalCart = computed(() => (cart.itemsTotalCents / 100).toFixed(2));

  const couponData = computed(() => ({
    name: cart.couponCode,
    value: cart.couponDiscountCents / 100,
    error: cart.couponError,
  }));

  async function init() {
    cart.hydrate();
    try {
      // Prezzi e scorte possono essere cambiati da quando il carrello è stato
      // riempito: si riallineano all'apertura della pagina.
      stockIssues.value = await cart.revalidate();
    } finally {
      isLoading.value = false;
    }
  }

  function changeQuantity(newQty: number, item: CartItem) {
    cart.setQuantity(item.id, newQty);
  }

  function removeItem(item: CartItem) {
    cart.removeLine(item.id);
  }

  const applyCoupon = (code: string) => cart.applyCoupon(code);
  const removeCoupon = () => cart.removeCoupon();

  onMounted(init);

  return {
    products,
    totalCart,
    couponData,
    isLoading,
    stockIssues,
    changeQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
  };
}
