<template>
  <div>
    <p class="px-6 lg:text-center">{{ t("payments.terms") }}</p>
    <div class="flex justify-center w-full">
      <div class="flex m-4 px-4 gap-5 flex-wrap justify-center">
        <div
          v-for="(payment, index) in paymentMethods"
          :key="index"
          class="flex justify-center items-center"
        >
          <a :href="payment.link" @click="iconSocialPressed(payment.link)">
            <img
              :src="payment.src"
              :alt="payment.alt"
              class="mt-2 w-18 h-10 object-contain"
            />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PaymentMethod } from "~/types/paymentMethod.type";
import paypalTest from "../../../assets/img/paypal.png";
import paypal from "../../../assets/img/PayPal-Monogram-FullColor-RGB.png";
import mastercard from "../../../assets/img/mc_vrt_pos.png";
import visa from "../../../assets/img/Visa_Brandmark_Blue_RGB_2021.png";
import klarna from "../../../assets/img/Klarna_Badge_With_Clear_Space.svg";
import satispay from "../../../assets/img/satispay-seeklogo.png";
import ameriExpr from "../../../assets/img/american-express-alternative.svg";
import applePay from "../../../assets/img/Apple_Pay_Mark_RGB_041619.svg";
import googlePay from "../../../assets/img/GPay_Acceptance_Mark_800.png";
// Alternative paypal resource: https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg

const { t } = useI18n();

const paymentMethods: PaymentMethod[] = [
  {
    src: paypal,
    alt: "Paypal",
    link: "#",
  },
  {
    src: mastercard,
    alt: "Mastercard",
    link: "#",
  },
  {
    src: visa,
    alt: "Visa",
    link: "#",
  },
  {
    src: ameriExpr,
    alt: "American Express",
    link: "#",
  },
  {
    src: klarna,
    alt: "Klarna",
    link: "#",
  },
  {
    src: satispay,
    alt: "Satispay",
    link: "#",
  },
  {
    src: applePay,
    alt: "Apple Pay",
    link: "#",
  },
  {
    src: googlePay,
    alt: "Google Pay",
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
