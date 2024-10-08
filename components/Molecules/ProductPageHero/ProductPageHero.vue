<template>
  <div class="w-full items-center justify-center flex flex-col">
    <img :src="image" class="max-w-[70vw] shadow-xl" />
    <h3 class="pt-4">{{ title }}</h3>
    <p v-if="code" class="pt-4">{{ code }}</p>
    <p class="pt-4">{{ formattedExpansion }}</p>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  expansion: {
    type: String,
    required: true,
  },
  code: {
    type: String,
  },
});

const formattedExpansion = computed(() => {
  return props.expansion.charAt(0).toUpperCase() + props.expansion.slice(1);
});
</script>
