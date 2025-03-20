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

const isVisited = ref(checkVisited(props.to));

function checkVisited(url: string): boolean {
  if (import.meta.client) {
    const visitedLinks = JSON.parse(
      localStorage.getItem("visitedLinks") || "{}"
    );
    return !!visitedLinks[url];
  } else return false;
}

onMounted(() => {
  isVisited.value = checkVisited(props.to);
});

function handleClick() {
  if (import.meta.client) {
    const visitedLinks = JSON.parse(
      localStorage.getItem("visitedLinks") || "{}"
    );
    visitedLinks[props.to] = true;
    localStorage.setItem("visitedLinks", JSON.stringify(visitedLinks));
    isVisited.value = true;
  }
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
