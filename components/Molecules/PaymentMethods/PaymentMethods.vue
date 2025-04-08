<template>
  <div>
    <p class="px-6 lg:text-center">{{ $t("payments.terms") }}</p>
    <div class="flex justify-center w-full">
      <div class="flex m-4 px-4 gap-5">
        <div
          v-for="(payment, index) in paymentMethods"
          :key="index"
          class="flex justify-center items-center"
        >
          <a :href="payment.link" @click="iconSocialPressed(payment.link)">
            <img
              :src="payment.src"
              :alt="payment.alt"
              class="mt-2 w-18 h-10 object-cover"
            />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PaymentMethod } from "~/types/paymentMethod.type";
import paypal from "../../../assets/img/paypal.png";

const paymentMethods: PaymentMethod[] = [
  {
    src: paypal,
    alt: "paypal",
    link: "#",
  },
];

const iconSocialPressed = (url: string) => {
  navigateTo(url, {
    external: true,
    open: {
      target: "_blank",
    },
  });
};
</script>
