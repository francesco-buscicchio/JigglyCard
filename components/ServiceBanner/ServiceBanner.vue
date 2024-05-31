<template>
    <div class="gap-4">
      <div class="grid md:grid-cols-4 md:gap-4 py-8">
        <div
          v-for="(section, sectionIndex) in sections"
          :key="'section-' + sectionIndex"
          class="w-full md:w-auto mb-4 md:mb-0 section-bar"
          :style="{ fontSize: sectionFontSize }"
        >
          <!-- Sezioni service -->
          <div class="px-4 flex flex-col md:flex-row items-start md:items-start">
            <div v-if="section.imgUrl">
              <img :src="section.imgUrl" alt="" class="footer-img">
            </div>
            <div class="flex-1">
              <h2 class="text-lightPink ">{{ section.title }}</h2>
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
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
  
  const props = defineProps({
    sections: {
      type: Array as PropType<
        Array<{
          title: string;
          sections: Array<string | { value: string; link: string }>;
          imgUrl?: string;
        }>
      >,
      default: () => [],
    },
  });
  
  const sectionFontSize = '16px';
  </script>
  
  <style scoped>
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
      margin-top: 10px;
      margin-right: 20px;
      max-width: 100px;
      max-height: 100px;
    }
  
    .section-bar {
      border-right: 2px solid lightPink;
    }
  
    .section-bar:last-child {
      border-right: none;
    }
  }
  </style>
  