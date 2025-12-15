import { ToastMessageType, type ToastMessage } from "~/types/toastMessage.type";
import { CartStrapiService, type Cart } from "./Strapi/CartService";
import type { Variant } from "./Strapi/VariantService";

export type CartItem = {
  id: string;
  image: string;
  selectedQuantity: number;
  availableQuantity: number;
  price: number;
  totalPrice: number;
  title: string;
  language: string;
  condition: string;
  coupon: any;
};
type QuantityItem = { variant: string; quantity: number };
class CartService {
  private static instance: CartService;
  private strapiBaseUrl = "";
  private accessToken = "";
  private defaultExpiredDate = "06/09/2000";
  private jiggly_cart_session_id = "";
  private jiggly_cart_expired_date = new Date(this.defaultExpiredDate);
  public jiggly_cart_id = "";
  private cartService: CartStrapiService;

  private constructor(strapiBaseUrl: string, accessToken: string) {
    this.strapiBaseUrl = strapiBaseUrl;
    this.accessToken = accessToken;
    this.validateToken();
    this.cartService = new CartStrapiService(
      this.strapiBaseUrl,
      this.accessToken
    );
  }

  public static getInstance(
    strapiBaseUrl: string,
    accessToken: string
  ): CartService {
    if (!CartService.instance) {
      CartService.instance = new CartService(strapiBaseUrl, accessToken);
    }
    return CartService.instance;
  }

  private validateToken() {
    if (localStorage.getItem("jiggly_cart_session_id")) {
      this.jiggly_cart_session_id =
        localStorage.getItem("jiggly_cart_session_id") ?? "";
      this.jiggly_cart_expired_date = new Date(
        localStorage.getItem("jiggly_cart_expired_date") ?? ""
      );
      this.jiggly_cart_id = localStorage.getItem("jiggly_cart_id") ?? "";

      if (
        this.jiggly_cart_session_id &&
        this.jiggly_cart_expired_date &&
        this.jiggly_cart_id
      ) {
        if (this.jiggly_cart_expired_date <= new Date()) {
          this.resetTokenStorage();
        }
      }
    }
  }

  private resetTokenStorage() {
    localStorage.removeItem("jiggly_cart_session_id");
    localStorage.removeItem("jiggly_cart_expired_date");
    localStorage.removeItem("jiggly_cart_id");
    this.jiggly_cart_id = "";
    this.jiggly_cart_session_id = "";
    this.jiggly_cart_expired_date = new Date(this.defaultExpiredDate);
  }

  private setToken(result: { data: Cart }, sessionID: string) {
    localStorage.setItem("jiggly_cart_id", result.data.documentId);
    localStorage.setItem(
      "jiggly_cart_expired_date",
      result.data.expired_date as string
    );
    localStorage.setItem("jiggly_cart_session_id", sessionID);
  }

  private notifyCartUpdated() {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("cart:update"));
    }
  }

  public async getCart() {
    return this.cartService.getCartById(this.jiggly_cart_id);
  }

  public async addToCart(
    documentId: string,
    quantitySelected: Number,
    availableQuantity: Number
  ): Promise<ToastMessage> {
    try {
      let sessionID = this.jiggly_cart_session_id;
      if (sessionID === "") sessionID = this.cartService.generateSessionId();

      //CREA CARRELLO E PUSHA ELEMENTO SE NON ESISTE
      if (!this.jiggly_cart_id) {
        const quantityData = [
          { variant: documentId, quantity: quantitySelected },
        ];
        const result = await this.cartService.createCart({
          session_id: sessionID,
          variants: [documentId],
          quantity: JSON.stringify(quantityData),
        });
        this.setToken(result, sessionID);
        this.notifyCartUpdated();
        return {
          text: "toast.cart.success",
          type: ToastMessageType.SUCCESS,
        };
      } else {
        const cart = await this.cartService.getCartById(this.jiggly_cart_id);
        //OTTIENE DATI CARRELLO
        if (cart) {
          const quantity = cart.data.quantity;
          const cartData = {
            variants: cart.data.variants,
            quantity: cart.data.quantity,
          };
          cartData.variants = cartData.variants.map((val: Variant) => {
            return val.documentId;
          });

          //CERCA SE ELEMENTO GIA PRESENTE NEL CARRELLO
          const indexQuantity = quantity.findIndex((val: QuantityItem) => {
            return val.variant === documentId;
          });
          //SE PRESENTE AGGIORNA LE QUANTITA
          if (indexQuantity !== -1) {
            quantity[indexQuantity].quantity += quantitySelected;
            if (quantity[indexQuantity].quantity > availableQuantity) {
              return {
                text: "toast.cart.overflow",
                type: ToastMessageType.ERROR,
              };
            }
          }
          //SE ASSENTE LO PUSHA NELL'ARRAY
          else {
            quantity.push({
              variant: documentId,
              quantity: quantitySelected,
            });
            cartData.variants.push(documentId);
          }
          cartData.quantity = JSON.stringify(quantity);
          await this.cartService.updateCart(this.jiggly_cart_id, cartData);
          this.notifyCartUpdated();
          return {
            text: "toast.cart.success",
            type: ToastMessageType.SUCCESS,
          };
        }
        return {
          text: "toast.cart.success",
          type: ToastMessageType.ERROR,
        };
      }
    } catch (_) {
      return {
        text: "toast.cart.success",
        type: ToastMessageType.ERROR,
      };
    }
  }

  public async addCouponCode(documentId: string, couponCode: string) {
    this.cartService.updateCart(documentId, {
      coupon: couponCode,
    });
  }

  public async removeCouponCode(documentId: string) {
    this.cartService.updateCart(documentId, {
      coupon: null,
    });
  }

  public async updateQuantityData(
    quantityData: QuantityItem[],
    idVariant: string,
    newQuantity: number
  ) {
    const index = quantityData.findIndex((val: QuantityItem) => {
      return val.variant === idVariant;
    });
    if (index !== -1) {
      quantityData[index].quantity = newQuantity;
    }
    const newCartData = {
      quantity: JSON.stringify(quantityData),
    };
    const updated = await this.cartService.updateCart(
      this.jiggly_cart_id,
      newCartData
    );
    this.notifyCartUpdated();
    return updated;
  }

  public async removeItem(cartData: Cart, item: CartItem) {
    const newVariants = cartData.variants.filter((val: string | Variant) => {
      if (typeof val === "string") {
        return val !== item.id;
      } else {
        return val.documentId !== item.id;
      }
    });

    let quantityArray: QuantityItem[] = [];
    if (typeof cartData.quantity === "string") {
      quantityArray = JSON.parse(cartData.quantity);
    } else {
      quantityArray = cartData.quantity;
    }

    const newQuantity = quantityArray.filter((val: QuantityItem) => {
      return val.variant !== item.id;
    });

    const newCartData = {
      variants: newVariants.map((val: string | Variant) => {
        return typeof val === "string" ? val : val.documentId;
      }),
      quantity: JSON.stringify(newQuantity),
    };

    await this.cartService.updateCart(this.jiggly_cart_id, newCartData);
    this.notifyCartUpdated();
  }
}

export { CartService };
