<template>
  <input
    type="radio"
    :value="value"
    :name="name"
    :disabled="disabled"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  value: { type: Object, required: true },
  name: { type: String, required: true },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue"]);

const handleChange = () => {
  emit("update:modelValue", props.value);
};
</script>

<style>
input[type="radio"] {
  width: 16px;
  height: 16px;
  border: 1px solid #003849;
  cursor: pointer;
  position: relative;
}

input[type="radio"]:checked:before {
  background: #006482;
}

input[type="radio"]:active:before {
  background: #003849;
}

input[type="radio"]:hover {
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

input[type="radio"]:before {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
</style>
