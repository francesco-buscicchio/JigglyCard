import { stripe } from "@formkit/icons";
import { createPayPalClient } from "./utils/paypal";

export default defineEventHandler(async (event) => {
  console.log("test");
  const runtimeConfig = useRuntimeConfig();
  const body = await readBody(event);

  switch (body.payment_method) {
    case "paypal":
      const paypal = await createPayPalClient();

      try {
        const order = await paypal.fetch("/v2/checkout/orders", {
          method: "POST",
          body: {
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: "00.01",
                },
              },
            ],
            payment_source: {
              paypal: {
                experience_context: {
                  brand_name: "Jigglycard",
                  shipping_preference: "NO_SHIPPING",
                  return_url: `http://localhost:3001/acquisto-completato`,
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

    default:
      setResponseStatus(event, 400);
      return { error: "Invalid payment platform" };
  }
});
