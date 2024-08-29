<template>
  <div class="p-4 flex flex-col gap-y-6">
    <MoleculesHeroBanner
      :backgroundImage="Ossidiana"
      :navigateTo="'/listing/ossidiana-infuocata'"
      title="Ossidiana Infuocata"
      ariaLabel="Promotional banner for Ossidiana Infuocata expansion"
    />

    <OrganismsProductCarousel
      :title="$t('highlights')"
      :products="productSamples"
    />

    <OrganismsProductCarousel
      :title="$t('whatsnew')"
      :products="productSamples"
    />

    <OrganismsProductCarousel :title="$t('deals')" :products="productSamples" />

    <OrganismsServiceBanner :sections="sectionsDataService" />
  </div>
</template>

<script setup lang="ts">
import Ossidiana from "~/assets/img/Ossidiana.jpg";
import ASR_TG15 from "~/assets/img/ASR_TG15.png";
import ASR_TG29 from "~/assets/img/AST_TG29.jpg";
import ASR_TG03 from "~/assets/img/ASR_TG03.jpg";
import ASR_TG08 from "~/assets/img/ASR_TG08.jpg";

const { t } = useI18n();

const productSamples = [
  {
    productName: "Calyrex Cavaliere Glaciale VMAX",
    code: "(ASR TG15)",
    expansion: "Lucentezza Siderale",
    price: "9.94",
    imageUrl: ASR_TG15,
  },
  {
    productName: "Calyrex Cavaliere Glaciale VMAX",
    code: "(ASR TG29)",
    expansion: "Lucentezza Siderale",
    price: "2.99",
    imageUrl: ASR_TG29,
  },
  {
    productName: "Kingdra",
    code: "(ASR TG03)",
    expansion: "Lucentezza Siderale",
    price: "2.99",
    imageUrl: ASR_TG03,
  },
  {
    productName: "Kleavor",
    code: "(ASR TG08)",
    expansion: "Lucentezza Siderale",
    price: "1.00",
    imageUrl: ASR_TG08,
  },
];

useHead({
  title: "Jigglycard",
  meta: [
    {
      name: "Jigglycard",
      content:
        "Entra nel magico mondo Pokemon, carte singole, prodotti sealed, permuta collezioni...",
    },
  ],
});

const sectionsDataService = [
  {
    title: t("serviceHomepage.FastShipping"),
    sections: [{ value: t("serviceHomepage.FastShippingDescription") }],
    imgUrl: "jig:truck",
  },
  {
    title: t("serviceHomepage.Support"),
    sections: [t("serviceHomepage.SupportDescription")],
    imgUrl: "jig:support",
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
];
</script>
