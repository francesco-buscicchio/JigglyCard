<template>
  <transition name="fade">
    <div
      v-if="isOpen"
      class="absolute top-0 left-0 bottom-0 right-0 inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
    >
      <div class="bg-white p-4 rounded-lg max-w-lg w-full">
        <slot></slot>
        <footer class="mt-4">
          <slot name="footer"></slot>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean,
});

const isOpenRef = ref(props.isOpen);

watch(
  () => props.isOpen,
  (newValue, oldValue) => {
    console.log("Prop changed:", newValue);
    isOpenRef.value = newValue;
  }
);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>