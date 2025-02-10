<template>
  <div class="w-full py-2 border-b-[1px] flex px-6 gap-x-10">
    <NuxtImg :src="thumbnailImage" class="min-w-10 max-w-10 object-cover" :alt="name"/>
    <div>
      <p>{{ name }}</p>
      <p>{{ expansion }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  expansion: {
    type: String,
    required: true,
  },
});
</script>
