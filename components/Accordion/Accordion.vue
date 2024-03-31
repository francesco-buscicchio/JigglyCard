<template>
  <div class="border rounded-lg overflow-hidden">
    <button
      @click="toggle"
      class="flex justify-between items-center w-full p-5"
    >
      <slot name="header"></slot>
      <span
        :class="{ 'transform rotate-180': isOpen }"
        class="transition-transform duration-300"
      >
        <Icon name="gridicons:chevron-down"></Icon>
      </span>
    </button>
    <div
      ref="content"
      class="overflow-hidden transition-all duration-300"
      :style="{ maxHeight: isOpen ? `${contentHeight}px` : '0' }"
    >
      <div class="px-5">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false);
const contentHeight = ref(0);
const content = ref(null);

const updateContentHeight = () => {
  contentHeight.value = isOpen.value ? content.value.scrollHeight : 0;
};

const toggle = () => {
  isOpen.value = !isOpen.value;
};

watch(isOpen, () => {
  updateContentHeight();
});

onMounted(() => {
  if (isOpen.value) updateContentHeight();
});
</script>
