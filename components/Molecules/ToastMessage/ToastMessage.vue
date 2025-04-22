<template>
  <div
    class="w-full fixed min-h-12 top-0 z-[1001] text-white px-5 py-3"
    :class="toastStyle.background"
  >
    <div class="flex gap-3 items-center">
      <Icon :name="toastStyle.iconName" class="shrink-0 w-5 h-5"></Icon>
      <p>{{ text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    default: "success",
    required: true,
    validator: (value: string) =>
      ["success", "warning", "error", "info"].includes(value),
  },
  text: {
    type: String,
    default: "",
  },
});

const toastMap: Record<
  "success" | "warning" | "error" | "info",
  { iconName: string; background: string }
> = {
  success: { iconName: "jig:check-circle", background: "bg-lime-500" },
  warning: {
    iconName: "garden:alert-warning-stroke-12",
    background: "bg-yellow-400",
  },
  error: { iconName: "garden:x-circle-stroke-12", background: "bg-red-600" },
  info: { iconName: "gridicons:info-outline", background: "bg-blue-500" },
};

const toastStyle = computed(() => {
  return (
    toastMap[props.type as "success" | "warning" | "error" | "info"] ||
    toastMap.info
  );
});
</script>
