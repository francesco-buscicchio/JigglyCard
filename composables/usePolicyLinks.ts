import { computed } from "vue";
import { useI18n } from "vue-i18n";

export const usePolicyLinks = () => {
  const { t } = useI18n();
  return computed(() => [
    { label: t("common.links.privacy"), link: "/privacy-policy" },
    { label: t("common.links.cookies"), link: "/cookies" },
    { label: t("common.links.terms"), link: "/terms-of-use" },
  ]);
};
