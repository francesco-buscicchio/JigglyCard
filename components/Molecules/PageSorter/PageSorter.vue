<template>
  <div ref="rootRef" class="sorter" :class="`sorter--${type}`" @keydown="onKeydown">
    <button
      ref="buttonRef"
      type="button"
      class="sorter__button"
      :class="{ 'is-open': open }"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-controls="listId"
      @click="toggle"
    >
      <span class="sorter__value">{{ currentLabel }}</span>
      <Icon name="heroicons:chevron-down-20-solid" size="18" class="sorter__chevron" />
    </button>

    <Transition name="sorter-pop">
      <ul
        v-if="open"
        :id="listId"
        class="sorter__list"
        role="listbox"
        :aria-activedescendant="`${listId}-${highlighted}`"
        tabindex="-1"
      >
        <li
          v-for="(item, index) in sortingItems"
          :id="`${listId}-${index}`"
          :key="item.value"
          role="option"
          class="sorter__option"
          :class="{
            'is-selected': isCurrent(item.value),
            'is-highlighted': index === highlighted,
          }"
          :aria-selected="isCurrent(item.value)"
          @mouseenter="highlighted = index"
          @click="choose(item.value)"
        >
          <span>{{ t(item.name) }}</span>
          <Icon
            v-if="isCurrent(item.value)"
            name="heroicons:check-20-solid"
            size="18"
            class="sorter__check"
          />
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
/**
 * Menu "Ordina per": tendina disegnata invece del <select> nativo, che sul
 * tema scuro apriva una lista grigia di sistema. Stessa API di prima
 * (`sortingItems`, `selected`, evento `handleSorting`), tastiera compresa:
 * frecce per muoversi, Invio per scegliere, Esc per chiudere.
 */
const { t } = useI18n();
const props = defineProps({
  sortingItems: {
    type: Array as () => Array<{ value: string | number; name: string }>,
    required: true,
  },
  selected: {
    type: [String, Number],
    default: "",
  },
  type: {
    type: String,
    default: "page-sorter",
    validator: (value: string) => ["page-sorter", "slim"].includes(value),
  },
});

const emit = defineEmits(["handleSorting"]);

const listId = useId();
const rootRef = ref<HTMLElement | null>(null);
const buttonRef = ref<HTMLButtonElement | null>(null);
const open = ref(false);
const highlighted = ref(0);
const selectedValue = ref(props.selected || props.sortingItems[0]?.value);

// Confronto per stringa: la quantità arriva come numero, le opzioni come
// stringhe ("1"), e il vecchio <select> le considerava uguali.
const sameValue = (a: unknown, b: unknown) => String(a ?? "") === String(b ?? "");
const isSelected = (value: string | number) => sameValue(value, selectedValue.value);

/** La voce scelta; se non c'è (opzioni arrivate dopo), la prima. */
const currentItem = computed(
  () =>
    props.sortingItems.find((entry) => isSelected(entry.value)) ??
    props.sortingItems[0],
);

const isCurrent = (value: string | number) => sameValue(value, currentItem.value?.value);

const currentLabel = computed(() => (currentItem.value ? t(currentItem.value.name) : ""));

const selectedIndex = () =>
  Math.max(0, props.sortingItems.findIndex((item) => isCurrent(item.value)));

const toggle = () => {
  open.value = !open.value;
  if (open.value) highlighted.value = selectedIndex();
};

const close = (focusButton = false) => {
  open.value = false;
  if (focusButton) buttonRef.value?.focus();
};

const choose = (value: string | number) => {
  close(true);
  if (sameValue(value, currentItem.value?.value)) return;
  selectedValue.value = value;
  emit("handleSorting", value);
};

const onKeydown = (event: KeyboardEvent) => {
  const last = props.sortingItems.length - 1;
  if (!open.value) {
    if (["ArrowDown", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      toggle();
    }
    return;
  }
  if (event.key === "Escape") {
    event.preventDefault();
    close(true);
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    highlighted.value = Math.min(last, highlighted.value + 1);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    highlighted.value = Math.max(0, highlighted.value - 1);
  } else if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    choose(props.sortingItems[highlighted.value].value);
  } else if (event.key === "Tab") {
    close();
  }
};

const onDocumentClick = (event: MouseEvent) => {
  if (open.value && !rootRef.value?.contains(event.target as Node)) close();
};

onMounted(() => document.addEventListener("click", onDocumentClick));
onBeforeUnmount(() => document.removeEventListener("click", onDocumentClick));

watch(
  () => props.selected,
  (newSelected) => {
    selectedValue.value = newSelected;
  }
);
</script>

<style scoped>
.sorter {
  position: relative;
}

.sorter__button {
  display: flex;
  width: 100%;
  min-width: 200px;
  max-width: 280px;
  align-items: center;
  gap: 10px;
  padding: 11px 14px 11px 16px;
  border-radius: 14px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.05);
  font-size: 14px;
  font-weight: 600;
  color: var(--im-ink);
  text-align: left;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.sorter--slim .sorter__button {
  padding-block: 6px;
}

.sorter__button:hover,
.sorter__button.is-open {
  border-color: rgba(247, 210, 216, 0.5);
  background: rgba(255, 255, 255, 0.08);
}

.sorter__button:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 2px;
}

.sorter__value {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: inherit;
}

.sorter__chevron {
  flex: none;
  color: var(--im-muted);
  transition: transform 0.25s ease;
}

.is-open .sorter__chevron {
  transform: rotate(180deg);
}

.sorter__list {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 40;
  width: max-content;
  min-width: 100%;
  max-width: min(340px, calc(100vw - 32px));
  padding: 6px;
  border-radius: 16px;
  border: 1px solid var(--im-line);
  background: rgba(17, 20, 52, 0.96);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 24px 50px -12px rgba(0, 0, 0, 0.7);
}

.sorter__list:focus {
  outline: none;
}

.sorter__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 14px;
  color: var(--im-muted);
  cursor: pointer;
}

.sorter__option span {
  cursor: inherit;
}

.sorter__option.is-highlighted {
  background: rgba(255, 255, 255, 0.07);
  color: var(--im-ink);
}

.sorter__option.is-selected {
  font-weight: 600;
  color: var(--im-ink);
}

.sorter__check {
  flex: none;
  color: var(--im-pink-strong);
}

.sorter-pop-enter-active,
.sorter-pop-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.sorter-pop-enter-from,
.sorter-pop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>
