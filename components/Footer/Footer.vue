<template>
  <div class="gap-4">
    <div class="grid md:grid-cols-4 md:gap-4 bg-lightPink">
      <div
        v-for="(section, sectionIndex) in sections"
        :key="'section-' + sectionIndex"
        class="w-full md:w-auto mb-4 md:mb-0 text-white"
        :style="{ fontSize: sectionFontSize }"
      >
        <!-- Sezioni del footer -->
        <div class="px-8 py-4 md:p-8">
          <h1 class="section-title">{{ section.title }}</h1>
          <div v-if="Array.isArray(section.sections)">
            <div v-for="(item, index) in section.sections" :key="index">
              <p v-if="typeof item === 'object'">
                <a :href="item.link">{{ item.value }}</a>
              </p>
              <p v-else>{{ item }}</p>
            </div>
          </div>
          <div v-else>
            <p>{{ section.sections }}</p>
          </div>
        </div>
      </div>
    </div>
    <div
      class="bg-mediumPink text-white flex flex-col items-center md:flex-row md:justify-between py-2"
    >
      <!-- Testo del footer -->
      <div class="md:flex py-2 md:py-0">
        <template v-if="Array.isArray(footer.text)">
          <div v-for="(text, index) in footer.text" :key="index" class="px-8">
            <h3 class="whitespace-normal break-words">{{ text }}</h3>
          </div>
        </template>
        <template v-else>
          <h3 class="whitespace-normal break-words px-8">{{ footer.text }}</h3>
        </template>
      </div>
      <!-- Immagini del footer -->
      <div class="flex flex-row items-center md:px-8">
        <template v-if="Array.isArray(footer.imgs)">
          <div
            class="footer-img py-2 px-2 md:py-0 cursor-pointer"
            v-for="(img, index) in footer.imgs"
            :key="index"
            @click="iconSocialPressed(img.url)"
          >
            <img :src="img.img" alt="Logo" class="max-h-6" />
          </div>
        </template>
        <template v-else>
          <div
            class="footer-img max-h-6 cursor-pointer"
            @click="iconSocialPressed(footer.imgs?.url ?? '')"
          >
            <img v-if="footer.imgs" :src="footer.imgs.img" alt="Logo" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type SocialLinksType = {
  img: string;
  url: string;
};

const iconSocialPressed = (url: string) => {
  navigateTo(url, {
    external: true,
    open: {
      target: "_blank",
    },
  });
};

const props = defineProps({
  sections: {
    type: Array as PropType<
      Array<{
        title: string;
        sections: Array<string | { value: string; link: string }>;
      }>
    >,
    default: () => [],
  },
  footer: {
    type: Object as PropType<{
      text: string | string[];
      imgs?: SocialLinksType | SocialLinksType[];
    }>,
    default: () => ({ text: "", imgs: [] }),
  },
});

const sectionFontSize = "16px";
</script>

<style scoped>
.section-title {
  border-bottom: 2px solid white;
}

/* Stili per il layout desktop */
@media (min-width: 768px) {
  .bg-mediumPink {
    display: flex;
    justify-content: space-between;
  }

  .footer-text {
    align-items: flex-start;
  }

  .footer-imgs {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .footer-img {
    margin-left: 10px;
  }
}
</style>
