<template>
  <NuxtLink
    :to="to"
    class="atoms-link"
    :class="{ 'visited-link': isVisited }"
    @click="handleClick"
  >
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = defineProps({
  to: {
    type: String,
    required: true,
  },
});

const isVisited = ref(false);

onMounted(() => {
  if (localStorage.getItem(props.to)) {
    isVisited.value = true;
  }
});

function handleClick() {
  localStorage.setItem(props.to, "visited");
  isVisited.value = true;
}
</script>

<style scoped>
.atoms-link {
  @apply text-neutrals-950 no-underline;

  font-family: "Roboto Serif", serif;
  font-size: 20px;
  line-height: 24px;
  font-weight: 500;
}

.atoms-link:hover {
  @apply text-accent-500;
  @apply underline;
}
.atoms-link:active {
  @apply bg-accent-500;
}
.visited-link {
  @apply text-[#0EA5E9];
}
</style>
