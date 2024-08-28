<template>
  <div class="gap-2 bg-accent-500 pb-8 text-accent-50 w-full">
    <div class="flex flex-col mb-4">
      <div
        v-for="(section, sectionIndex) in sections"
        :key="'section-' + sectionIndex"
      >
        <MoleculesAccordion>
          <template #header>
            <p>{{ section.title }}</p>
          </template>
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
        </MoleculesAccordion>
      </div>
    </div>

    <MoleculesPaymentMethods />

    <MoleculesSocialLinks :imgs="footer.imgs" />

    <div>
      <label class="px-6">
        <template v-for="(policy, index) in policyLinks" :key="index">
          <a :href="policy.link">{{ policy.label }}</a>
          <span v-if="index < policyLinks!.length - 1"> - </span>
        </template>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type SocialLinksType } from "~/components/Molecules/SocialLinks/SocialLinks.vue";

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
      imgs?: SocialLinksType | SocialLinksType[];
    }>,
    default: () => ({ text: "", imgs: [] }),
  },
  policyLinks: {
    type: Array as PropType<Array<{ label: string; link: string }>>,
  },
});
</script>
