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
    <div class="bg-mediumPink text-white flex flex-col items-center md:flex-row md:justify-between py-2">
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
      <div class="footer-imgs md:px-8">
        <template v-if="Array.isArray(footer.imgs)">
          <div class="footer-img py-2 md:py-0" v-for="(img, index) in footer.imgs" :key="index">
            <Img :src="img" alt="Logo" class="w-16 md:ml-6" />
          </div>
        </template>
        <template v-else>
          <div class="footer-img">
            <Img v-if="footer.imgs" :src="footer.imgs" alt="Logo" class="w-16 md:ml-6" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  sections: {
    type: Array as PropType<Array<{ title: string; sections: Array<string | { value: string; link: string }> }>>,
    default: () => []
  },
  footer: {
    type: Object as PropType<{ text: string | string[]; imgs?: string | string[] }>,
    default: () => ({ text: '', imgs: [] })
  }
});

const sectionFontSize = '16px';
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
    align-items: center;
  }

  .footer-img {
    margin-left: 10px;
  }
}
</style>
