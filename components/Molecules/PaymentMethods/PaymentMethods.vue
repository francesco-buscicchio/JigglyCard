<template>
  <div class="payments">
    <p class="payments__label">{{ t("payments.terms") }}</p>
    <ul class="payments__list">
      <li
        v-for="(payment, index) in paymentMethods"
        :key="index"
        class="payment-chip"
      >
        <a
          :href="payment.link"
          class="payment-chip__link"
          @click="iconSocialPressed(payment.link)"
        >
          <img
            :src="payment.src"
            :alt="payment.alt"
            class="payment-chip__img"
          />
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { paymentMethods } from '~/data/paymentsMethods';

const { t } = useI18n();


const iconSocialPressed = (url: string) => {
  navigateTo(url, {
    external: true,
    open: {
      target: "_blank",
    },
  });
};
</script>

<style scoped>
.payments {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Etichetta in stile "kicker" della home. */
.payments__label {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 12px;
  line-height: 1.4;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--im-muted);
}

/* Griglia regolare di tessere tutte uguali, invece di loghi sparsi. */
.payments__list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  max-width: 360px;
}

/* I marchi di pagamento vanno su fondo chiaro (lo chiedono le loro linee
   guida, e sul blu notte il blu di Visa e PayPal sparirebbe). */
.payment-chip {
  display: flex;
}

.payment-chip__link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px;
  padding: 6px 10px;
  border-radius: 14px;
  background: #fff;
  box-shadow:
    0 10px 24px -16px rgba(0, 0, 0, 0.8),
    inset 0 0 0 1px rgba(7, 10, 31, 0.06);
  cursor: pointer;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.payment-chip__link:hover {
  transform: translateY(-2px);
  box-shadow:
    0 16px 30px -16px rgba(236, 145, 160, 0.7),
    inset 0 0 0 1px rgba(7, 10, 31, 0.06);
}

.payment-chip__link:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 3px;
}

.payment-chip__img {
  width: 100%;
  height: 100%;
  max-height: 30px;
  object-fit: contain;
  cursor: inherit;
}

@media (prefers-reduced-motion: reduce) {
  .payment-chip__link {
    transition: none;
  }

  .payment-chip__link:hover {
    transform: none;
  }
}
</style>
