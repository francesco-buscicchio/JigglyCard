<template>
  <div class="max-w-[420px]">
    <h5 class="mb-2">Modalita di pagamento</h5>
    <div class="my-3">
      <AtomsRadioButton
        :value="{ id: 'credit-card' }"
        name="payment"
        v-model="selected"
      />
      <span class="ml-2 text-base">Credit Card</span>
      <div v-if="selected.id === 'credit-card'" class="pl-4 mt-2">
        form 1
        <p>Inserisci i dati della tua carta.</p>

        <AtomsButtonCTA
          @click="confirmAndPay"
          :type="isCheckoutValid ? 'primary' : 'disabled'"
          :class="['rounded']"
          :text="t('confirmAndPay')"
        >
        </AtomsButtonCTA>
      </div>
    </div>
    <div class="my-3">
      <AtomsRadioButton
        :value="{ id: 'paypal' }"
        name="payment"
        v-model="selected"
      />
      <span class="ml-2 text-base">Paypal</span>
      <div v-if="selected.id === 'paypal'" class="pl-4 mt-2">
        form PAYPAL
        <p>Inserisci i dati della tua carta.</p>
        <AtomsButtonCTA
          @click="confirmAndPay"
          :type="isCheckoutValid ? 'primary' : 'disabled'"
          :class="['rounded']"
          :text="t('confirmAndPay')"
        >
        </AtomsButtonCTA>
      </div>
    </div>
    <div class="my-3">
      <AtomsRadioButton
        :value="{ id: 'wire-transfer' }"
        name="payment"
        v-model="selected"
      />
      <span class="ml-2 text-base">Bonifico</span>
      <div v-if="selected.id === 'wire-transfer'" class="pl-4 mt-2">
        form BONIFICO
        <p>Inserisci i dati della tua carta.</p>
        <AtomsButtonCTA
          @click="confirmAndPay"
          :type="isCheckoutValid ? 'primary' : 'disabled'"
          :class="['rounded']"
          :text="t('confirmAndPay')"
        >
        </AtomsButtonCTA>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  isCheckoutValid: {
    type: Boolean,
    default: false,
    required: true,
  },
});
const { t } = useI18n();
const emits = defineEmits(["submitConfirmAndPay"]);

const confirmAndPay = () => {
  emits("submitConfirmAndPay");
};
const selected = ref({ id: "" });
</script>
