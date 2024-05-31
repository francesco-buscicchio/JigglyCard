<template>
    <div v-if="isOpen">
      <BaseModal :isOpen="isOpen">
        <template #default>
          <button
            @click="handleButtonClick"
            class="text-lightPink border-none ml-116 font-bold"
          >
            X
          </button>
          <div class="flex flex-col items-center justify-center text-center">
            <img src="../../assets/img/logo.png" class="w-15 py-4">
            <h1 class="text-lg font-bold pb-2">Sconto del 10%</h1>
            <p>Inserisci la tua mail e ottieni uno sconto subito</p>
            <input 
              type="text" 
              v-model="email" 
              placeholder="Inserisci la tua email"
              class="mt-4 p-2 border border-gray-300 rounded text-center px-23 focus:border-darkPink focus:outline-none"
            >
            <button
              @click="showMail"
              class="bg-lightPink text-white border-[1px] px-30 py-2 mt-4 rounded min-w-40 hover:bg-darkPink"
            >
              Ottieni lo sconto
            </button>
          </div>
        </template>
        <template #footer>
          <div class="w-full flex flex-col items-center justify-center space-y-4">
            <button
              @click="handleButtonClick"
              class="border-none text-mediumPink border-[1px] rounded min-w-40"
            >
              No grazie
            </button>
            <p class="text-center mt-4 pb-4">
              Inserendo la mail verrai inserito nei nostri sistemi cosi da tenerti aggiornato sulle novita e sugli sconti
            </p>
          </div>
        </template>
      </BaseModal>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const isOpen = ref(true);
  const email = ref('');
  
  const showMail = () => {
    console.log(email.value);
  };
  
  const handleButtonClick = () => {
    isOpen.value = false;
  };
  </script>
  