<template>
    <div>
      <p class="text-xs mt-2 l:mt-0 mb-2"><strong>{{ label }}</strong></p>
      <div class="flex flex-row gap-x-4 ">
        <div v-for="variant in variants" :key="variant.id">
          <button 
            :class="['h-10 px-2 border border-gray hover:border-mediumPink focus:border-mediumPink active:border-mediumPink rounded', { 'bg-mediumPink text-white': variant.id === selectedVariantId }]"
            @click="selectVariant(variant)"
          >
            <p>{{ variant.title }}</p>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits, ref } from 'vue';
  
  const props = defineProps({
    label: String,
    variants: Array,
  });
  
  const emits = defineEmits(['variantClicked']);
  
  const selectedVariantId = ref(null);
  
  function selectVariant(variant) {
    selectedVariantId.value = variant.id;
    emits('variantClicked', variant);
  }
  </script>
  
  