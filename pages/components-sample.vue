<template>
  <div class="flex flex-col gap-y-6 pt-4 px-10">
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
  </div>
</template>

<script setup lang="ts"></script>
