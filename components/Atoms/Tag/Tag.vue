<template>
  <button
    :class="typeClass"
    class="rounded-lg px-4 py-2 min-w-25"
    @click="emitClick"
  >
    <p>{{ $t(`tag.${text}`) }}</p>
  </button>
</template>

<!-- TODO mettere traduzioni per le lingue -->
<script setup lang="ts">
import { TagType } from "~/enum/tag.enum";
import type { TagCode } from "~/types/tagCode.type";

const props = defineProps({
  type: {
    type: String as () => TagType,
    default: "active",
    validator: (value: TagType) =>
      [TagType.ACTIVE, TagType.INACTIVE, TagType.DISABLED].includes(value),
  },
  text: {
    type: String,
    default: "",
  },
  code: {
    type: String as () => TagCode,
    required: true,
  },
});

const emit = defineEmits(["tagClicked"]);

const typeClass = computed(() => {
  switch (props.type) {
    case TagType.ACTIVE:
      return "bg-accent-500 text-accent-50 font-bold active:bg-accent-950";
    case TagType.INACTIVE:
      return "bg-sky-100 text-primary-950 font-bold active:text-accent-950 active:border-accent-950";
    case TagType.DISABLED:
      return "bg-white text-neutrals-400 border-[1px] border-neutrals-500";
    default:
      return "";
  }
});

const emitClick = () => {
  emit("tagClicked", props.code);
};
</script>
