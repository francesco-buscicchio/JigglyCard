import { onMounted, onBeforeUnmount, ref } from "vue";
import { CartService } from "~/service/CartService";

const CART_UPDATE_EVENT = "cart:update";

export function useCartCount() {
  const cartCount = ref(0);
  const runtimeConfig = useRuntimeConfig();
  let cartService: CartService | null = null;

  const getCartService = () => {
    if (!cartService) {
      cartService = CartService.getInstance(
        runtimeConfig.public.STRAPI_BASE_URL,
        runtimeConfig.public.FULL_ACCESS_TOKEN
      );
    }
    return cartService;
  };

  const sumQuantities = (quantityData: any): number => {
    if (!quantityData) return 0;
    let parsed = quantityData;
    if (typeof quantityData === "string") {
      try {
        parsed = JSON.parse(quantityData);
      } catch (_) {
        parsed = [];
      }
    }
    if (!Array.isArray(parsed)) return 0;
    return parsed.reduce(
      (total, item) => total + Number(item?.quantity ?? 0),
      0
    );
  };

  const fetchCartCount = async () => {
    if (!process.client) return;
    const service = getCartService();
    const cart = await service.getCart();
    cartCount.value = cart?.data ? sumQuantities(cart.data.quantity) : 0;
  };

  const handleCartUpdate = () => {
    fetchCartCount();
  };

  onMounted(() => {
    if (!process.client) return;
    fetchCartCount();
    window.addEventListener(CART_UPDATE_EVENT, handleCartUpdate);
  });

  onBeforeUnmount(() => {
    if (!process.client) return;
    window.removeEventListener(CART_UPDATE_EVENT, handleCartUpdate);
  });

  return {
    cartCount,
    refreshCartCount: fetchCartCount,
  };
}
