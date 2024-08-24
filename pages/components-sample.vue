<template>
  <div class="flex flex-col gap-y-6 p-10">
    <div>
      <h3 class="pb-4">Atoms Cta</h3>
      <div class="flex flex-row gap-x-4">
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
      <h1 class="text-xl pb-1">Checkbox</h1>
      <p class="pb-4">
        La checkbox è {{ isChecked ? "selezionata" : "deselezionata" }}.
      </p>
      <AtomsCheckbox id="example-checkbox" v-model="isChecked" />
    </div>

    <div>
      <h1 class="text-xl pb-4">Hero Banner</h1>
      <MoleculesHeroBanner
        :backgroundImage="Ossidiana"
        :navigateTo="'/listing/ossidiana-infuocata'"
        title="Ossidiana Infuocata"
        ariaLabel="Promotional banner for Ossidiana Infuocata expansion"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Ossidiana from "../assets/img/Ossidiana.jpg";

const radioButtonStatus = ref(true);
const isChecked = ref(false);

const updateState = (newState: boolean) => {
  radioButtonStatus.value = newState;
};
</script>
