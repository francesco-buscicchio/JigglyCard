<template>
  <div class="flex flex-col items-center py-2 pb-4">
    <div class="flex flex-row items-center">
      <template v-if="Array.isArray(footerData.imgs)">
        <div
          class="py-2 mx-3 cursor-pointer"
          v-for="(img, index) in footerData.imgs"
          :key="index"
          @click="iconSocialPressed(img.url)"
        >
          <img :src="img.img" alt="Logo" class="max-h-6" />
        </div>
      </template>
      <template v-else>
        <div
          class="max-h-6 cursor-pointer"
          @click="iconSocialPressed(footerData.imgs?.url ?? '')"
        >
          <img v-if="footerData.imgs" :src="footerData.imgs.img" alt="Logo" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SocialLinks } from "~/types/socialLink.type";
import { footerData } from "~/data/footer";

const iconSocialPressed = (url: string) => {
  navigateTo(url, {
    external: true,
    open: {
      target: "_blank",
    },
  });
};
</script>
