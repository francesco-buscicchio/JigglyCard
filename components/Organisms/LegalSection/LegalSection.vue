<template>
  <section :id="id" v-reveal class="legal__card">
    <h2 class="legal__heading">
      <span class="legal__num">{{ num }}</span>
      {{ title }}
    </h2>
    <div class="legal__prose">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
/** Sezione numerata di una pagina legale; gli stili sono in OrganismsLegalPage. */
defineProps<{ num: string; title: string; id?: string }>();
</script>
