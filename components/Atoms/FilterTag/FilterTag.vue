<template>
  <div class="relative">
    <div class="bg-accent-50 rounded-xl p-4 pr-12">
      <p>{{ text }}</p>
    </div>
    <button
      class="absolute inset-y-0 right-0 flex items-center pr-4"
      @click="emitClick"
      aria-label="Remove filter"
      role="button"
    >
      <Icon name="jig:close-filter" size="10" />
    </button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["removeFilter"]);
const props = defineProps({
  text: {
    type: String,
    default: "",
  },
});

const emitClick = () => {
  emit("removeFilter", props.text);
};
</script>
