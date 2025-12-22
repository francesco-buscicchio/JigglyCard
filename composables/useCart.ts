import { ref, computed, onMounted } from "vue";
import { CartService, type CartItem } from "~/service/CartService";
import { VariantStrapiService as VariantService } from "~/service/Strapi/VariantService";
import { ProductStrapiService as ProductService } from "~/service/Strapi/ProductService";
import { CouponStrapiService } from "~/service/Strapi/CouponService";
import type { Variant } from "~/types/variant.type";

export interface CartConfig {
  strapiBaseUrl: string;
  fullAccessToken: string;
}

/**
 * Gestisce la logica del carrello: fetch, quantità, coupon.
 * Istanzia i servizi solo nel mounted per evitare errori SSR e localStorage undefined.
 * @param config - Parametri di configurazione (base URL Strapi e token).
 */
export function useCart(config: CartConfig) {
  const products = ref<CartItem[]>([]);
  const couponData = ref({ name: "", value: 0, error: "" });
  const totalCart = computed(() => {
    return products.value
      .reduce((acc, item) => acc + item.totalPrice, 0)
      .toFixed(2);
  });
  const isLoading = ref(true);

  let cartService: CartService;
  let variantService: VariantService;
  let productService: ProductService;
  let couponService: CouponStrapiService;

  async function init() {
    // Inizializza i servizi qui, dentro onMounted
    cartService = CartService.getInstance(
      config.strapiBaseUrl,
      config.fullAccessToken
    );
    variantService = new VariantService(
      config.strapiBaseUrl,
      config.fullAccessToken
    );
    productService = new ProductService(
      config.strapiBaseUrl,
      config.fullAccessToken
    );
    couponService = new CouponStrapiService(
      config.strapiBaseUrl,
      config.fullAccessToken
    );

    const cartData = await cartService.getCart();
    if (!cartData) {
      isLoading.value = false;
      return;
    }

    const variantPromises = cartData.data.variants.map((v: Variant) =>
      variantService.getVariantById(v.documentId)
    );
    const variantsData = await Promise.all(variantPromises);

    const productPromises = variantsData.map((vd) =>
      productService.getProductById(vd.data.product.documentId)
    );
    const productsData = await Promise.all(productPromises);

    products.value = variantsData.map((vd, i) => {
      const variant = vd.data;
      const prod = productsData[i].data;
      const cartQty = cartData.data.quantity.find(
        (q: any) => q.variant === variant.documentId
      );
      const selectedQty = cartQty ? cartQty.quantity : 0;
      const price = variant.price / 100;
      return {
        id: variant.documentId,
        image: prod.thumbnail.url,
        selectedQuantity: selectedQty,
        availableQuantity: variant.quantity,
        price,
        totalPrice: selectedQty * price,
        title: prod.name,
        language: variant.language.name,
        condition: variant.condition.name,
        coupon: "",
      };
    });

    if (cartData.data.coupon) {
      const [coupon] = await couponService.getCouponByCode(
        cartData.data.coupon.code
      );
      couponData.value.name = coupon.code;
      couponData.value.value = Number(
        (coupon.coupon_type.discount * 0.01 * Number(totalCart.value)).toFixed(
          2
        )
      );
    }

    isLoading.value = false;
  }

  async function getCartData() {
    return await cartService.getCart();
  }

  async function changeQuantity(newQty: number, item: CartItem) {
    const cartData = await cartService.getCart();
    if (!cartData) return;
    const quantityData = [...cartData.data.quantity];
    cartService.updateQuantityData(quantityData, item.id, newQty);
  }

  async function removeItem(item: CartItem) {
    const cartData = await cartService.getCart();
    if (!cartData) return;
    await cartService.removeItem(cartData.data, item);
    products.value = products.value.filter((p) => p.id !== item.id);
  }

  async function applyCoupon(code: string) {
    couponData.value.error = "";
    const result = await couponService.getCouponByCode(code);
    if (result.length === 0) {
      couponData.value.error = "Codice coupon non valido";
      return;
    }
    const coupon = result[0];
    const expiry = new Date(coupon.expired_date);
    expiry.setHours(23, 59, 59, 999);
    if (expiry < new Date()) {
      couponData.value.error = "Codice coupon scaduto";
      return;
    }
    const cartData = await cartService.getCart();
    await cartService.addCouponCode(
      cartData.data.documentId,
      coupon.documentId
    );
    couponData.value.name = coupon.code;
    couponData.value.value = Number(
      (coupon.coupon_type.discount * 0.01 * Number(totalCart.value)).toFixed(2)
    );
  }

  async function removeCoupon() {
    const cartData = await cartService.getCart();
    if (!cartData) return;
    await cartService.removeCouponCode(cartData.data.documentId);
    couponData.value.name = "";
    couponData.value.value = 0;
  }

  onMounted(init);

  return {
    products,
    totalCart,
    couponData,
    isLoading,
    changeQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    getCartData,
  };
}
