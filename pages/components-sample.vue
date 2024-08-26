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
      <h1 class="text-xl pb-4">Product Card</h1>
      <MoleculesProductCard
        productName="Calyrex Cavaliere Glaciale VMAX"
        code="ASR TG15"
        expansion="Regno Glaciale"
        :price="1.0"
        :imageUrl="CalyrexImage"
      />
    </div>

    <div class="w-full">
      <h1 class="text-xl pb-4">Carousel Card</h1>
      <MoleculesCardCarousel
        :items="productList"
        @update:index="
          (e) => {
            console.log(e);
          }
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import CalyrexImage from "~/assets/img/ASR_TG15.png";

const radioButtonStatus = ref(true);
const isChecked = ref(false);

const productList = ref([
  "Prodotto 1 con descrizione e dettagli",
  "Prodotto 2 con descrizione e dettagli",
  "Prodotto 3 con descrizione e dettagli",
  "Prodotto 4 con descrizione e dettagli",
  "Prodotto 5 con descrizione e dettagli",
]);

const updateState = (newState: boolean) => {
  radioButtonStatus.value = newState;
};
</script>
