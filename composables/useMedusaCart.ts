const generateUniqueId = () => {
  const timestamp = new Date().getTime();
  const randomFactor = Math.random().toString(36).substring(2, 15);
  return `cart_${timestamp}_${randomFactor}`;
};

export const useMedusaCart = (client: any) => {
  let cartId = "";

  const initOrUpdateCart = async () => {
    if (cartId === "") {
      const { cart } = await client.carts.create();
      cartId = cart.id;
    } else {
      await client.carts.retrieve(cartId);
    }
  };

  const addItem = async (variantId: string, quantity: number) => {
    console.log(client.carts);
    if (cartId) {
      const result = await client.carts.lineItems.create(cartId, {
        variant_id: variantId,
        quantity: quantity,
      });
      console.log(result);
    }
    return;
  };

  const removeItem = async (variantId: string, quantityToRemove: number) => {
    if (cartId) {
      const { cart } = await client.carts.retrieve(cartId);
      const lineItem = cart.items.find((item) => item.variant_id === variantId);

      if (lineItem) {
        const newQuantity = lineItem.quantity - quantityToRemove;
        if (newQuantity > 0) {
          return await client.carts.lineItems.update(cartId, lineItem.id, {
            quantity: newQuantity,
          });
        } else {
          return await client.carts.lineItems.delete(cartId, lineItem.id);
        }
      }

      return;
    }
  };

  const logCartContents = async () => {
    if (cartId) {
      const { cart } = await client.carts.retrieve(cartId);
      console.log("Cart ID:", cartId);
      console.log("Items in Cart:");
      cart.items.forEach((item, index) => {
        console.log(`Item ${index + 1}:`);
        console.log("Variant ID:", item.variant_id);
        console.log("Quantity:", item.quantity);
        console.log("---------------------------------------------------");
      });
    } else {
      console.log("No cart found or cart is empty.");
    }
  };

  return {
    initOrUpdateCart,
    addItem,
    removeItem,
    logCartContents,
  };
};
