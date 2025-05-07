<template>
  <div class="gap-2 bg-main-400 pb-8 w-full">
    <div class="mb-4">
      <MoleculesFooterLinks :links="FOOTER_MENU_ITEMS" />
    </div>

    <MoleculesPaymentMethods v-if="!hidePayments" />

    <div v-if="showInformationSite" class="w-full text-center">
      <p>{{ config.public.MAIL_ADMIN }}</p>
    </div>

    <MoleculesSocialLinks :imgs="footer.imgs" />

    <div class="w-full text-center">
      <label class="px-6" for="policy">
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
import { FOOTER_MENU_ITEMS } from "~/data/const";

const config = useRuntimeConfig();
const props = defineProps({
  footer: {
    type: Object as PropType<{
      imgs?: SocialLinksType | SocialLinksType[];
    }>,
    default: () => ({ text: "", imgs: [] }),
  },
  policyLinks: {
    type: Array as PropType<Array<{ label: string; link: string }>>,
  },
  hidePayments: {
    type: Boolean,
    default: false,
  },
  showInformationSite: {
    type: Boolean,
    default: false,
  },
});
</script>
