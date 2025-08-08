<template>
  <div
    class="flex flex-col items-center gap-2 cursor-pointer w-[10vw] shrink-0"
    @click="$emit('click')"
  >
    <p class="text-accent-950 text-center whitespace-nowrap">
      {{ label }}
    </p>
    <div class="w-full aspect-[9/16] rounded overflow-hidden">
      <img
        v-if="imgUrl"
        :src="imgUrl"
        alt=""
        class="w-full h-full object-cover"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  imgUrl?: string;
}>();
</script>
