<template>
  <div class="px-4 py-18 md:py-25 md:px-0">
    <!-- mobile -->
    <div class="gap-4 px-4" v-show="isMobileView">
      <div class="grid lg:py-8">
        <div
          v-for="(section, sectionIndex) in sections"
          :key="'section-' + sectionIndex"
          :class="{
            'w-full py-4 px-2 section-bar border-b-[1px] border-accent-950 bg-accent-50':
              sectionIndex !== sections.length - 1,
            'w-full py-4 px-2 section-bar bg-accent-50 md:border':
              sectionIndex === sections.length - 1,
          }"
        >
          <div class="flex flex-row items-center justify-between">
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
    <!-- desktop -->
    <div v-show="!isMobileView" class="gap-4 bg-accent-50 px-4">
      <div class="grid grid-cols-4 gap-4 lg:py-8">
        <div
          v-for="(section, sectionIndex) in sections"
          :key="'section-' + sectionIndex"
          :class="{
            'w-auto mb-0 py-4 px-2 section-bar border-b-[1px] border-accent-950 border rounded-lg bg-accent-50':
              sectionIndex !== sections.length - 1,
            'w-auto mb-0 py-4 px-2 section-bar bg-accent-50 border border-accent-950 rounded-lg':
              sectionIndex === sections.length - 1,
          }"
        >
          <div class="flex flex-col justify-between items-start">
            <p class="pb-2 w-full text-center">{{ section.title }}</p>

            <div class="w-full flex px-3 gap-4">
              <div
                v-if="section.imgUrl"
                class="flex justify-center items-center"
              >
                <Icon :name="section.imgUrl" size="40" />
              </div>
              <div v-if="Array.isArray(section.sections)">
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
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const isMobileView = isMobile();
const sections = [
  {
    title: t("serviceHomepage.FastShipping"),
    sections: [
      { value: t("serviceHomepage.FastShippingDescription"), link: "" },
    ],
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
</script>
