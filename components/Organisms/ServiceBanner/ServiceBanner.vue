<template>
  <div class="gap-4">
    <div class="grid md:grid-cols-4 md:gap-4 lg:py-8 ">
      <div v-for="(section, sectionIndex) in sections" :key="'section-' + sectionIndex" :class="{
        'w-full md:w-auto md:mb-0 py-4 px-2 section-bar border-b-[1px] border-accent-950 md:border-none bg-accent-50': sectionIndex !== sections.length - 1,
        'w-full md:w-auto md:mb-0 py-4 px-2 section-bar md:border-none bg-accent-50': sectionIndex === sections.length - 1
      }" :style="{ fontSize: sectionFontSize }">
        <div class="flex flex-row items-center justify-between md:items-start">
          <div v-if="section.imgUrl" class="w-full flex justify-center">
            <Icon :name="section.imgUrl" size="35" />
          </div>
          <div class="flex-1 max-w-[75%] min-w-[75%] px-3">
            <p class="pb-2">{{ section.title }}</p>
            <div v-if="Array.isArray(section.sections)" class="pb-2">
              <div v-for="(item, index) in section.sections" :key="index">
                <label v-if="typeof item === 'object'" class="line-clamp-3">
                  <a :href="item.link">{{ item.value }}</a>
                </label>
                <label v-else class="line-clamp-3">{{ item }}</label>
              </div>
            </div>
            <div v-else>
              <label>{{ section.sections }}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

const sections = [
  {
    title: t("serviceHomepage.FastShipping"),
    sections: [{ value: t("serviceHomepage.FastShippingDescription") }],
    imgUrl: "jig:truck",
  },
  {
    title: t("serviceHomepage.Prices"),
    sections: [t("serviceHomepage.PricesDescription")],
    imgUrl: "jig:prices",
  },
  {
    title: t("serviceHomepage.Security"),
    sections: [t("serviceHomepage.SecurityDescription")],
    imgUrl: "jig:security",
  },
  {
    title: t("serviceHomepage.Support"),
    sections: [t("serviceHomepage.SupportDescription")],
    imgUrl: "jig:support",
  },
];

const sectionFontSize = "16px";
</script>
