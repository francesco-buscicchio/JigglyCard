<template>
  <div class="max-h-6 w-full">
    <Swiper
      :loop="true"
      :autoplay="true"
      class="max-h-6 cursor-grab"
      :modules="[Autoplay]"
    >
      <SwiperSlide v-for="news in props.news">
        <div
          class="w-full bg-black text-center py-2 text-xs text-white"
          :class="news.url ? 'underline' : ''"
          @click="handleClick(news)"
        >
          {{ news.label }}
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay } from "swiper/modules";

type NewsBannerProps = {
  label: string;
  url?: string;
};

const props = defineProps<{ news: NewsBannerProps[] }>();
const handleClick = (news: NewsBannerProps) => {
  if (news.url) navigateTo(news.url);
};
</script>

<style scoped></style>
