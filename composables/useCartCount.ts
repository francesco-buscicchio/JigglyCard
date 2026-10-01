import { computed, onMounted } from "vue";
import { useCartStore } from "~/stores/cart";

/**
 * Contatore del carrello per il badge in header.
 *
 * Con il carrello nello store non serve più né interrogare il server né
 * l'evento `cart:update`: la reattività di Pinia basta.
 */
export function useCartCount() {
  const cart = useCartStore();

  onMounted(() => cart.hydrate());

  return {
    cartCount: computed(() => cart.itemCount),
    refreshCartCount: () => cart.hydrate(),
  };
}
