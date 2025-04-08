<template>
  <div class="mx-5 border-t-[2px] border-neutral-200 py-4">
    <h5>Modalità di spedizione</h5>

    <div class="my-4">
      <AtomsRadioButton
        :value="{ id: 'standard-1' }"
        name="Standard-1"
        v-model="selectedOption"
      />
      <span class="ml-2 text-base">Standard 1</span>
      <p class="text-xs py-3">
        *puoi scegliere un’altra modalità in fase di checkout
      </p>
    </div>

    <div class="flex justify-between border-t-[2px] border-neutral-200 py-4">
      <p class="inter">Totale</p>
      <p class="total inter">{{ totalCart }} €</p>
    </div>
    <!-- Codice promo -->
    <div>
      <p>Hai un codice promo?</p>
      <div class="lg:flex w-full">
<div >

    <AtomsInputText :placeholder="placeholder" />
</div>
          <div class="lg:max-w-22">

              <AtomsButtonCTA type="secondary" text="Applica Codice" />
          </div>
      </div>
    </div>

    <div >
      <AtomsButtonCTA type="primary" text="Procedi all'acquisto" />
      <AtomsButtonCTA type="text" text="Torna ai prodotti" />
    </div>

    <div>
      <p class="font-medium">Hai bisogno di assistenza?</p>
      <p class="text-base">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cumque eius
        iure suscipit vel, commodi fugiat earum libero consectetur! Enim autem
        illum dolore voluptate cum quidem, debitis odio commodi iusto magni.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  totalCart: {
    type: String,
    required: true,
  },
});
const isDesktopView = isDesktop();
const placeholder = computed(() => {
  return isDesktopView.value ? "Codice promo" : "XXXX";
});
// TODO: rendere di default l'opzione standard
const selectedOption = ref({ id: "standard-1" });
</script>
<style scoped>
.total {
  font-weight: 600;
  font-size: 28px;
}
.inter {
  font-family: "Inter", sans-serif;
}
</style>
