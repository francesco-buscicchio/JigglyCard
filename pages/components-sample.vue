<template>
  <div class="flex flex-col gap-y-6 p-6">
    <div>
      <h3 class="pb-4">Atoms Cta</h3>
      <div class="flex flex-col gap-y-4">
        <AtomsButtonCTA type="primary" text="Primary Button"></AtomsButtonCTA>
        <AtomsButtonCTA
          type="secondary"
          text="Secondary Button"
        ></AtomsButtonCTA>
        <AtomsButtonCTA type="disabled" text="Disabled Button">
          <Icon name="jig:heart"></Icon>
        </AtomsButtonCTA>
      </div>
    </div>

    <div>
      <h3 class="pb-4">Molecules ContainerInput</h3>
      <div class="w-full flex flex-col gap-y-4">
        <MoleculesContainerInput status="default">
          <template #default>
            <span class="icon">🔍</span>
          </template>
        </MoleculesContainerInput>

        <MoleculesContainerInput status="success">
          <template #default>
            <span class="icon">✔️</span>
          </template>
        </MoleculesContainerInput>

        <MoleculesContainerInput status="error">
          <template #default>
            <span class="icon">❌</span>
          </template>
        </MoleculesContainerInput>

        <MoleculesContainerInput status="disabled">
          <template #default>
            <span class="icon">🚫</span>
          </template>
        </MoleculesContainerInput>

        <MoleculesContainerInput status="warning">
          <template #default>
            <span class="icon">⚠️</span>
          </template>
        </MoleculesContainerInput>
      </div>
    </div>

    <div>
      <h3 class="pb-1">Radio Buttons</h3>
      <h6 class="pb-4">Status: {{ radioButtonStatus ? "on" : "off" }}</h6>
      <div>
        <AtomsRadioButton
          :initialState="radioButtonStatus"
          @update:state="updateState"
        ></AtomsRadioButton>
      </div>
    </div>

    <div>
      <h1 class="text-xl pb-4">Links</h1>
      <div class="flex flex-col gap-y-2">
        <AtomsLink to="/link-1">Link 1</AtomsLink>
        <AtomsLink to="/link-2">Link 2</AtomsLink>
        <AtomsLink to="/link-3">Link 3</AtomsLink>
      </div>
    </div>

    <div>
      <h3 class="pb-1">Checkbox</h3>
      <p class="pb-4">
        La checkbox è {{ isChecked ? "selezionata" : "deselezionata" }}.
      </p>
      <AtomsCheckbox id="example-checkbox" v-model="isChecked" />
    </div>

    <div>
      <h3 class="pb-4">Hero Banner</h3>
      <MoleculesHeroBanner
        :backgroundImage="Ossidiana"
        :navigateTo="'/listing/ossidiana-infuocata'"
        title="Ossidiana Infuocata"
        ariaLabel="Promotional banner for Ossidiana Infuocata expansion"
      />
    </div>

    <div>
      <h3 class="pb-4">Accordion</h3>
      <div class="bg-[#FE9DA4]">
        <MoleculesAccordion class="min-w-full bg-transparent">
          <template #header>
            <p class="font-bold">About</p>
          </template>
          <div>
            <h5 class="pb-4">Accordion</h5>
            <p class="pb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
              hendrerit, urna id eleifend sagittis, quam augue eleifend mauris,
              vel scelerisque diam enim sed diam. Cras tellus dui, interdum eget
              libero eget, bibendum aliquet enim. Etiam ut nisi sit amet dolor
              elementum feugiat. Fusce sit amet gravida tortor. Cras viverra
              maximus rhoncus. Pellentesque eu justo id ipsum finibus hendrerit.
              Class aptent taciti sociosqu ad litora torquent per conubia
              nostra, per inceptos himenaeos.
            </p>
          </div>
        </MoleculesAccordion>
      </div>
    </div>

    <div class="w-full">
      <h3 class="pb-4">Product Card</h3>
      <MoleculesProductCard
        productName="Calyrex Cavaliere Glaciale VMAX"
        code="ASR TG15"
        expansion="Regno Glaciale"
        :price="'1.0'"
        :imageUrl="ASR_TG15"
      />
    </div>

    <div class="w-full">
      <h3 class="pb-4">Product Carousel</h3>
      <OrganismsProductCarousel :products="productList" title="Correlati" />
    </div>

    <div class="w-full">
      <h3 class="pb-4">Service Banner</h3>
      <OrganismsServiceBanner :sections="sectionsDataService" />
    </div>

    <div class="w-full">
      <h3 class="pb-4">Tag</h3>
      <div class="flex gap-5">
        <AtomsTag type="active" text="Inglese"></AtomsTag>
        <AtomsTag type="inactive" text="Italiano"></AtomsTag>
        <AtomsTag type="disabled" text="Giapponese"></AtomsTag>
      </div>
    </div>

    <div class="w-full">
      <h3 class="pb-4">Tag List</h3>
      <MoleculesListingTab :tags="mockedTags" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Ossidiana from "../assets/img/Ossidiana.jpg";
import ASR_TG15 from "~/assets/img/ASR_TG15.png";
import ASR_TG29 from "~/assets/img/AST_TG29.jpg";
import ASR_TG03 from "~/assets/img/ASR_TG03.jpg";
import ASR_TG08 from "~/assets/img/ASR_TG08.jpg";
import { TagType } from "~/components/Atoms/Tag/tag.types";
import type { ListingTagProps } from "~/components/Molecules/ListingTag/ListingTag.types";
const { t } = useI18n();

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

const mockedTags: ListingTagProps[] = [
  { type: TagType.ACTIVE, text: "Active" },
  { type: TagType.INACTIVE, text: "Inactive" },
  { type: TagType.DISABLED, text: "Disabled" },
];

const radioButtonStatus = ref(true);
const isChecked = ref(false);

const productList = ref([
  {
    productName: "Calyrex Cavaliere Glaciale VMAX",
    code: "ASR TG15",
    expansion: "Lucentezza Siderale",
    price: "9.94",
    imageUrl: ASR_TG15,
  },
  {
    productName: "Calyrex Cavaliere Glaciale VMAX",
    code: "ASR TG29",
    expansion: "Lucentezza Siderale",
    price: "3.00",
    imageUrl: ASR_TG29,
  },
  {
    productName: "Kingdra",
    code: "ASR TG03",
    expansion: "Lucentezza Siderale",
    price: "2.99",
    imageUrl: ASR_TG03,
  },
  {
    productName: "Kleavor",
    code: "ASR TG08",
    expansion: "Lucentezza Siderale",
    price: "1.49",
    imageUrl: ASR_TG08,
  },
]);

const updateState = (newState: boolean) => {
  radioButtonStatus.value = newState;
};
</script>
