<template>
  <section class="fsection" :class="{ 'is-open': open }">
    <button
      type="button"
      class="fsection__head"
      :aria-expanded="open"
      :aria-controls="bodyId"
      @click="open = !open"
    >
      <span class="fsection__title">{{ title }}</span>
      <span v-if="selected" class="fsection__badge">{{ selected }}</span>
      <Icon
        name="heroicons:chevron-down-20-solid"
        size="18"
        class="fsection__chevron"
      />
    </button>
    <div :id="bodyId" class="fsection__body" :hidden="!open">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
/** Gruppo di filtri richiudibile, con il numero di voci attive sul titolo. */
const props = withDefaults(
  defineProps<{
    title: string;
    selected?: number;
    initiallyOpen?: boolean;
  }>(),
  { selected: 0, initiallyOpen: false },
);

const open = ref(props.initiallyOpen || props.selected > 0);
const bodyId = useId();
</script>

<style scoped>
.fsection {
  border-top: 1px solid var(--im-line);
}

.fsection__head {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  text-align: left;
}

.fsection__head:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: -2px;
}

.fsection__title {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: var(--im-ink);
}

.fsection__badge {
  min-width: 22px;
  padding: 1px 7px;
  border-radius: 999px;
  background: var(--im-pink-strong);
  color: #2a0a14;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
}

.fsection__chevron {
  color: var(--im-muted);
  transition: transform 0.25s ease;
}

.is-open .fsection__chevron {
  transform: rotate(180deg);
}

.fsection__body {
  padding: 0 20px 18px;
}
</style>
