export const useCart = () => {
  const client = useMedusaClient();
  const cartId = useCookie(generateUniqueId(), { maxAge: 60 * 60 }); //DURATA MASSIMA CARRELLO 1 ORA

  const initOrUpdateCart = async () => {
    if (!cartId.value) {
      const { cart } = await client.carts.create();
      cartId.value = cart.id;
    } else {
      await client.carts.retrieve(cartId.value);
    }
  };

  const addItem = async (
    productId: string,
    variantId: string,
    quantity: number
  ) => {
    if (cartId.value) {
      await client.carts.lineItems.create(cartId.value, {
        variant_id: variantId,
        quantity: quantity,
      });
    }
  };

  const removeItem = async (lineItemId: string) => {
    if (cartId.value) {
      await client.carts.lineItems.delete(cartId.value, lineItemId);
    }
  };

  return {
    initOrUpdateCart,
    addItem,
    removeItem,
  };
};

const generateUniqueId = () => {
  const timestamp = new Date().getTime();
  const randomFactor = Math.random().toString(36).substring(2, 15);
  return `cart_${timestamp}_${randomFactor}`;
};
