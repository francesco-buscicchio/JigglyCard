<template>
  <div
    class="w-full py-2 border-b-[1px] flex px-6 gap-x-10 cursor-pointer"
    @click="clickItem(tcg, type, objectID)"
  >
    <NuxtImg
      :src="thumbnailImage"
      class="min-w-10 max-w-10 lg:min-w-18 lg:min-h-25 object-cover"
      :alt="name"
    />
    <div>
      <p>{{ name }}</p>
      <p>{{ expansion }}</p>
      <p class="hidden lg:block">{{ price.toFixed(2) }} €</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { goTo } from "@/utils/navigationUtils";
const emit = defineEmits(["itemClick"]);
const props = defineProps({
  thumbnailImage: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  objectID: {
    type: String,
    required: true,
  },
  tcg: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  expansion: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: false,
    default: 0,
  },
});

const clickItem = (tcg: string, type: string, objectID: string) => {
  goTo(`/${tcg}/${type}/${objectID}`);
  emit("itemClick");
};
</script>
