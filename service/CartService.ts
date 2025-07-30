import { ToastMessageType, type ToastMessage } from "~/types/toastMessage.type";
import { CartStrapiService, type Cart } from "./Strapi/CartService";
import type { Variant } from "./Strapi/VariantService";
import { variants } from "#tailwind-config";

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

  private setToken(result: any, sessionID: string) {
    localStorage.setItem("jiggly_cart_id", result.data.documentId);
    localStorage.setItem("jiggly_cart_expired_date", result.data.expired_date);
    localStorage.setItem("jiggly_cart_session_id", sessionID);
    this.jiggly_cart_id = result.data.documentId;
    this.jiggly_cart_expired_date = result.data.expired_date;
    this.jiggly_cart_session_id = sessionID;
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
        return {
          text: "Prodotto Aggiunto Al Carrello con Successo",
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
          const indexQuantity = quantity.findIndex((val: any) => {
            return val.variant === documentId;
          });
          //SE PRESENTE AGGIORNA LE QUANTITA
          if (indexQuantity !== -1) {
            quantity[indexQuantity].quantity += quantitySelected;
            if (quantity[indexQuantity].quantity > availableQuantity) {
              return {
                text: "La quantità aggiunta al carrello è maggiore della quantità disponibile",
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
          return {
            text: "Prodotto Aggiunto Al Carrello con Successo",
            type: ToastMessageType.SUCCESS,
          };
        }
        return {
          text: "Per qualche problema tecnico il prodotto non e' stato aggiunto al carrello",
          type: ToastMessageType.ERROR,
        };
      }
    } catch (_) {
      return {
        text: "Per qualche problema tecnico il prodotto non e' stato aggiunto al carrello",
        type: ToastMessageType.ERROR,
      };
    }
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
    console.log(newCartData);
    return await this.cartService.updateCart(this.jiggly_cart_id, newCartData);
  }

  public async removeItem(cartData: Cart, item: any) {
    const newVariants = cartData.variants.filter((val: any) => {
      return val.documentId !== item.id;
    });
    const newQuantity = cartData.quantity.filter((val: any) => {
      return val.variant !== item.id;
    });

    const newCartData = {
      variants: newVariants.map((val: any) => {
        return val.documentId;
      }),
      quantity: JSON.stringify(newQuantity),
    };

    const result = await this.cartService.updateCart(
      this.jiggly_cart_id,
      newCartData
    );
  }
}

export { CartService };
