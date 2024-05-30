<template>
  <div v-if="isOpen">
    <BaseModal :isOpen="isOpen">
      <template #default>
        <h2 class="text-lg font-bold">Per noi la tua privacy è importante</h2>
        <p>
          Noi e i nostri partner utilizziamo cookies per migliorare la tua
          esperienza, misurare le prestazioni e adattare il marketing. Altre
          informazioni le trovi nella nostra
          <NuxtLink to="/informativa-privacy"
            >informativa sulla privacy</NuxtLink
          >.
        </p>
      </template>
      <template #footer>
        <div class="w-full flex items-center justify-center">
          <button
            @click="handleButtonClick"
            class="border-red-500 text-black border-[1px] p-2 rounded min-w-40"
          >
            Rifiuta
          </button>
          <button
            @click="handleButtonClick"
            class="border-red-500 text-black border-[1px] p-2 rounded min-w-40 ml-4"
          >
            Accetta
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>
      
  <script setup lang="ts">
const isOpen = ref(true);

const handleButtonClick = () => {
  isOpen.value = false;
};
</script>