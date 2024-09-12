<template>
  <div class="flex flex-col gap-y-6">
    <div class="px-4 pt-4">
      <MoleculesHeroBanner
        :backgroundImage="Ossidiana"
        :navigateTo="'/listing/ossidiana-infuocata'"
        title="Ossidiana Infuocata"
        ariaLabel="Promotional banner for Ossidiana Infuocata expansion"
      />
    </div>

    <OrganismsProductCarousel
      :title="$t('highlights')"
      :products="evidenza"
      colorScheme="lightHome"
    />

    <OrganismsProductCarousel
      :title="$t('whatsnew')"
      :products="novita"
      colorScheme="primaryHome"
    />

    <OrganismsProductCarousel
      :title="$t('deals')"
      :products="offerte"
      colorScheme="lightHome"
    />

    <div class="px-4 pb-4">
      <OrganismsServiceBanner :sections="sectionsDataService" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Ossidiana from "~/assets/img/Ossidiana.jpg";
import algoliasearch from "algoliasearch";

const { t } = useI18n();

const config = useRuntimeConfig();
const offerte: any = ref([]);
const novita: any = ref([]);
const evidenza: any = ref([]);
const client = algoliasearch(
  config.public.ALGOLIA_APPLICATION_ID,
  config.public.ALGOLIA_API_KEY
);

onMounted(async () => {
  const queries = [
    { indexName: "ecommerce", query: "EVIDENZA", params: { hitsPerPage: 10 } },
    { indexName: "ecommerce", query: "OFFERTA", params: { hitsPerPage: 10 } },
    { indexName: "ecommerce", query: "NOVITA", params: { hitsPerPage: 10 } },
  ];

  const { results } = await client.multipleQueries(queries);
  setProducts(results);
});

function setProducts(queryResults: any) {
  for (let queryResult of queryResults) {
    for (let hit of queryResult.hits) {
      const obj = {
        productName: hit.name,
        code: hit.code ? `(${hit.code})` : null,
        expansion: hit.expansion || "N.A.",
        price: hit.salePrice ? hit.salePrice.toFixed(2) : "0.00",
        imageUrl:
          hit.thumbnailImage ||
          (hit.images && hit.images.length > 0 ? hit.images[0] : null),
      };

      for (let tag of hit.tags) {
        if (tag === "EVIDENZA") evidenza.value.push(obj);
        else if (tag === "NOVITA") novita.value.push(obj);
        else if (tag === "OFFERTA") offerte.value.push(obj);
      }
    }
  }
}

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
