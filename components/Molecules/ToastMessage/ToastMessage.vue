<template>
  <transition name="toast">
    <div
      class="w-full fixed min-h-12 top-0 z-[1001] text-white px-5 py-3"
      :class="toastStyle.background"
      v-if="visible"
    >
      <div class="flex gap-3 items-center">
        <Icon :name="toastStyle.iconName" class="shrink-0 w-5 h-5"></Icon>
        <p>{{ text }}</p>
      </div>
    </div>
  </transition>
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
  triggerKey: Number,
});
const visible = ref(false);

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

let timeoutId: ReturnType<typeof setTimeout> | null = null;

watch(
  () => props.triggerKey,
  () => {
    visible.value = true;

    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      visible.value = false;
      timeoutId = null;
    }, 3000);
  }
);
</script>

<style>
.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.toast-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
