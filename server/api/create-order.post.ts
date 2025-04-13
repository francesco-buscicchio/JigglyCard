import { createPayPalClient } from "./utils/paypal";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const body = await readBody(event);

  if (body.payment_method === "paypal") {
    const paypal = await createPayPalClient();

    try {
      const order = await paypal.fetch("/v2/checkout/orders", {
        method: "POST",
        body: {
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "EUR",
                value: body.price,
              },
            },
          ],
          payment_source: {
            paypal: {
              experience_context: {
                brand_name: "Jigglycard",
                shipping_preference: "NO_SHIPPING",
                return_url:
                  runtimeConfig.env !== "production"
                    ? "http://www.jigglycard.com/acquisto-completato"
                    : `http://localhost:3001/acquisto-completato`,
              },
            },
          },
        },
      });

      return { url: order.links[1].href };
    } catch (error: any) {
      console.error("Error caught:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response body:", error.response.data);
      }
    }
    setResponseStatus(event, 400);
    return { error: "Invalid payment platform" };
  }
});
