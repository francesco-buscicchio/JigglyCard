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
        v-if="currentPage === totalPages && currentPage > 2"
        @click="changePage(currentPage - 2)"
        class="border-[0.5px] border-accent-950 bg-white w-10 h-10"
      >
        <span>{{ currentPage - 2 }}</span>
      </button>

      <button
        v-if="currentPage > 1"
        @click="changePage(currentPage - 1)"
        class="border-[0.5px] border-accent-950 bg-white w-10 h-10"
      >
        <span>{{ currentPage - 1 }}</span>
      </button>

      <button
        class="border-[0.5px] border-accent-950 bg-accent-50 w-10 h-10"
        :class="
          currentPage === totalPages
            ? totalPages === 1
              ? ''
              : 'border-l-0'
            : currentPage > 1
            ? 'border-l-0 border-r-0'
            : ' border-r-0'
        "
      >
        <span>{{ currentPage }}</span>
      </button>

      <button
        v-if="currentPage < totalPages"
        @click="changePage(currentPage + 1)"
        class="border-[0.5px] border-accent-950 bg-white w-10 h-10"
      >
        <span>{{ currentPage + 1 }}</span>
      </button>

      <button
        v-if="currentPage === 1 && totalPages > currentPage + 2"
        @click="changePage(currentPage + 2)"
        class="border-[0.5px] border-accent-950 bg-white w-10 h-10 border-l-0"
      >
        <span>{{ currentPage + 2 }}</span>
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

<script setup>
import { ref, computed } from "vue";
import { ITEMS_FOR_PAGE } from "~/data/const";

const emit = defineEmits(["currentPage"]);
const props = defineProps({
  totalItems: Number,
  currentPage: Number,
});

const totalPages = computed(() => Math.ceil(props.totalItems / ITEMS_FOR_PAGE));

function changePage(page) {
  if (page < 1 || page > totalPages.value) return;
  props.currentPage = page;
  emit("currentPage", page);
}
</script>

<style scoped></style>
