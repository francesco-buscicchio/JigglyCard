<template>
  <span class="ftag">
    <span class="ftag__label">{{ text }}</span>
    <button
      type="button"
      class="ftag__remove"
      @click="emitClick"
      :aria-label="`${t('catalog.controls.remove')} ${text}`"
    >
      <Icon name="heroicons:x-mark-16-solid" size="14" />
    </button>
  </span>
</template>

<script setup lang="ts">
const emit = defineEmits(["removeFilter"]);
const { t } = useI18n();
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

<style scoped>
.ftag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 6px 5px 12px;
  border-radius: 999px;
  border: 1px solid rgba(247, 210, 216, 0.35);
  background: rgba(247, 210, 216, 0.1);
  font-size: 13px;
  font-weight: 600;
  color: var(--im-ink);
}

.ftag__remove {
  display: inline-flex;
  padding: 2px;
  border-radius: 999px;
  color: var(--im-muted);
  transition: all 0.2s ease;
}

.ftag__remove:hover {
  color: #2a0a14;
  background: var(--im-pink);
}
</style>
