<template>
    <div class="gap-4">
      <div class="flex flex-wrap bg-lightPink">
        <div
          v-for="(section, sectionIndex) in sections"
          :key="'section-' + sectionIndex"
          class=" flex-grow w-full md:w-auto mb-4 md:mb-0 text-white" 
          :style="{ fontSize: sectionFontSize }"
        >
          <div class="p-8 w-full"> 
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
      <div class="bg-mediumPink text-white flex flex-col items-center md:flex-row md:justify-between px-8 py-2">
        <h3 class="whitespace-normal break-words" >{{ footer.text }}</h3>
        <Img
            v-if="footer.img"
            :src="footer.img"
            alt="Logo"
            class="w-16 md:ml-6"
        />      
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
      type: Object as PropType<{ text: string; img?: string }>,
      default: () => ({ text: '', img: '' })
    }
  });
  
  const sectionFontSize = '16px';
  </script>
  
  <style scoped>
  .section-title {
    border-bottom: 2px solid white; 
  }
  </style>
  