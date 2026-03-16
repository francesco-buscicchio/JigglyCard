<template>
  <nav class="flex items-center justify-center gap-x-6">
    <button
      :disabled="currentPage <= 1"
      @click="changePage(currentPage - 1)"
      class="bg-white w-10 h-10 pt-2"
    >
      <Icon name="jig:previous-page" />
    </button>
    <div>
      <button
        v-for="page in pageButtons"
        :key="page"
        @click="changePage(page)"
        class="border-[0.5px] border-accent-950 w-10 h-10"
        :class="{
          'bg-accent-50': page === currentPage,
          'bg-white': page !== currentPage,
          'border-l-0': haveNotBorderLeft(page),
          'border-r-0': haveNotBorderRight(page),
        }"
      >
        <span>{{ page }}</span>
      </button>
    </div>

    <button
      :disabled="currentPage >= totalPages"
      @click="changePage(currentPage + 1)"
      class="bg-white w-10 h-10 pt-2"
    >
      <Icon name="jig:next-page" />
    </button>
  </nav>
</template>

<script setup lang="ts">
import { ITEMS_FOR_PAGE_MOBILE, ITEMS_FOR_PAGE_DESKTOP } from "~/data/const";
const isDesktopView = isDesktop();
const emit = defineEmits(["currentPage"]);
const props = defineProps({
  totalItems: {
    type: Number,
    required: true,
    validator: (value: number) => value >= 0,
  },
  currentPage: {
    type: Number,
    required: true,
    validator: (value: number) => Number.isInteger(value) && value >= 1,
  },
});

const itemsForPage = computed(() => {
  return isDesktopView ? ITEMS_FOR_PAGE_DESKTOP : ITEMS_FOR_PAGE_MOBILE;
});

const totalPages = computed(() =>
  Math.ceil(props.totalItems / itemsForPage.value)
);

const haveNotBorderLeft = (page: number): boolean => {
  const buttons = pageButtons.value;
  return buttons.length > 1 && buttons[buttons.length - 1] === page;
};

const haveNotBorderRight = (page: number): boolean => {
  const buttons = pageButtons.value;
  return buttons.length > 1 && buttons[0] === page;
};

function changePage(page: number) {
  if (page < 1 || page > totalPages.value) return;
  emit("currentPage", page);
}

const pageButtons = computed(() => {
  const pages: number[] = [];
  const total = totalPages.value;
  const current = props.currentPage;

  if (current === total && current > 2) pages.push(current - 2);
  if (current > 1) pages.push(current - 1);
  pages.push(current);
  if (current < total) pages.push(current + 1);
  if (current === 1 && total > current + 2) pages.push(current + 2);

  return pages;
});
</script>
