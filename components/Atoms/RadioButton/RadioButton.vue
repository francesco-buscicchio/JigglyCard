<template>
  <div>
    <input
      type="radio"
      :checked="isSelected"
      @click="handleSelection"
      class="cursor-pointer"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  initialState: Boolean,
});

const emits = defineEmits(["update:state"]);

const isSelected = ref(true);

const handleSelection = () => {
  isSelected.value = !isSelected.value;
  emits("update:state", isSelected.value);
};
</script>

<style>
input[type="radio"] {
  width: 16px;
  height: 16px;
  border: 1px solid #003849;
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
