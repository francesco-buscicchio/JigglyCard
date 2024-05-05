<template>
  <div class="flex flex-row gap-2">
    <div class="text-gray-400 cursor-pointer" @click="navigateToPage('/')">
      Home
    </div>
    <div class="text-gray-400">/</div>
    <div class="flex flex-row gap-2" v-for="(link, index) in data">
      <div
        :class="
          index === data.length - 1
            ? 'text-black'
            : 'text-gray-400 cursor-pointer'
        "
        @click="index !== data.length - 1 && navigateToPage(link.url)"
      >
        {{ link.name }}
      </div>
      <div class="text-gray-400" v-if="index !== data.length - 1">/</div>
    </div>
  </div>
</template>

<script setup lang="ts">
type BreadcrumbType = {
  name: string;
  url: string;
};
const props = defineProps<{ data: BreadcrumbType[] }>();

const navigateToPage = (url: string) => {
  console.log(url);
  navigateTo(url);
};
</script>
