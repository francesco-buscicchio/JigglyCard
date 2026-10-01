<template>
  <NuxtLink
    :to="to"
    class="group flex w-40 shrink-0 flex-col items-center gap-2"
    @click="$emit('click', $event)"
  >
    <!-- Il riquadro esiste solo se c'è davvero un'anteprima: senza immagine
         lasciava un vuoto alto quanto mezza pagina. Proporzioni della carta
         (63:88) invece di 9:16, che allungava troppo. -->
    <div
      v-if="imgUrl"
      class="flex aspect-[63/88] w-full items-center justify-center overflow-hidden rounded-lg bg-neutrals-100 p-2"
    >
      <img
        :src="imgUrl"
        alt=""
        loading="lazy"
        class="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-105"
      />
    </div>

    <p
      class="text-center text-accent-950 group-hover:underline"
      :class="imgUrl ? '' : 'whitespace-nowrap'"
    >
      {{ label }}
    </p>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  to: string;
  imgUrl?: string;
}>();
</script>
