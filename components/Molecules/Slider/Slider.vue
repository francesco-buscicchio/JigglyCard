<template>
    <div class="flex flex-col items-start w-full">
        <div class="relative w-full mb-2">
            <!-- Slider per il puntino 1 -->
            <input type="range" :min="min" :max="max" v-model="price1" @input="updatePrices" class="slider-range"
                @mousedown="startDragging('price1')" @touchstart="startDragging('price1')" />
            <!-- Slider per il puntino 2 -->
            <input type="range" :min="min" :max="max" v-model="price2" @input="updatePrices" class="slider-range"
                @mousedown="startDragging('price2')" @touchstart="startDragging('price2')" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue';

const props = defineProps({
    min: {
        type: Number,
        default: 0
    },
    max: {
        type: Number,
        default: 5000
    },
    initialMinPrice: {
        type: Number,
        default: 0
    },
    initialMaxPrice: {
        type: Number,
        default: 5000
    }
});

const emit = defineEmits(['update:minPrice', 'update:maxPrice']);

const price1 = ref(props.initialMinPrice);
const price2 = ref(props.initialMaxPrice);
const dragging = ref(null);

const minPrice = computed(() => Math.min(price1.value, price2.value));
const maxPrice = computed(() => Math.max(price1.value, price2.value));

const updatePrices = () => {
    emit('update:minPrice', minPrice.value);
    emit('update:maxPrice', maxPrice.value);
};

const startDragging = (type) => {
    dragging.value = type;
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchend', stopDragging);
};

const stopDragging = () => {
    dragging.value = null;
    window.removeEventListener('mouseup', stopDragging);
    window.removeEventListener('touchend', stopDragging);
};
</script>

<style scoped>
.slider-range {
    position: absolute;
    width: 100%;
    pointer-events: auto;
    -webkit-appearance: none;
    background: #003849;
    height: 4px;
}

.slider-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: #003849;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    z-index: 2;
}

.slider-range::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #003849;
    border-radius: 50%;
    cursor: pointer;
}

.slider-track {
    position: absolute;
    height: 8px;
    background: #003849;
    border-radius: 4px;
    z-index: 1;
}
</style>
