<template>
  <div
    class="relative bg-cover bg-center h-[300px] md:h-[500px] cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
    @click="navigateToListing"
    role="img"
    :aria-label="ariaLabel"
  >
    <div
      class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <h1 class="text-white text-3xl md:text-5xl font-bold text-center">
        {{ title }}
      </h1>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { defineProps } from "vue";

// Definisci le props
const props = defineProps({
  backgroundImage: {
    type: String,
    required: true,
  },
  navigateTo: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: "Ossidiana Infuocata",
  },
  ariaLabel: {
    type: String,
    default: "Promotional banner for Ossidiana Infuocata expansion",
  },
});

// Usa il router per la navigazione
const router = useRouter();

const navigateToListing = () => {
  router.push(props.navigateTo);
};
</script>

<style scoped>
/* Aggiungi eventuali stili aggiuntivi qui, se necessario */
</style>
