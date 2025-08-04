// server/api/create-payment-intent.ts
import Stripe from "stripe";
const config = useRuntimeConfig();
const stripe = new Stripe(`${config.STRIPE_SECRET_KEY}`!, {
  apiVersion: "2025-05-28.basil",
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const amount = body.amount;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error)?.message || "Unknown error",
    };
  }
});
