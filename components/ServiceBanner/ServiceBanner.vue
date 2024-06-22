<template>
  <div class="gap-4">
    <div class="grid md:grid-cols-4 md:gap-4 lg:py-8 bg-ultralitePink">
      <div
        v-for="(section, sectionIndex) in sections"
        :key="'section-' + sectionIndex"
        class="w-full md:w-auto mt-2 md:mb-0 pb-2 lg:pb-0 section-bar border-b-[1px] border-lightPink lg:border-none"
        :style="{ fontSize: sectionFontSize }"
      >
        <div class="px-4 flex flex-row items-start md:items-start">
          <div v-if="section.imgUrl">
            <Icon
              :name="section.imgUrl"
              class="mt-3 mr-5 w-8 h-8"
              :color="colors.darkPink"
            />
          </div>
          <div class="flex-1">
            <h2 class="text-black font-bold">{{ section.title }}</h2>
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
import { colors } from "~/config/tailwind/colors";

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

const sectionFontSize = "16px";
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

  .section-bar {
    border-right: 2px solid lightPink;
  }

  .section-bar:last-child {
    border-right: none;
  }
}
</style>
  