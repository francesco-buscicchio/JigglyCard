<template>
    <div class="flex flex-col items-start w-full">
        <div class="relative w-full mb-2">
            <!-- Slider per Minimo -->
            <input type="range" :min="min" :max="max" v-model="minPrice" @input="updateMinPrice" class="slider-range"
                @mousedown="startDragging('min')" @touchstart="startDragging('min')" />
            <!-- Slider per Massimo -->
            <input type="range" :min="min" :max="max" v-model="maxPrice" @input="updateMaxPrice" class="slider-range"
                @mousedown="startDragging('max')" @touchstart="startDragging('max')" />
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

const minPrice = ref(props.initialMinPrice);
const maxPrice = ref(props.initialMaxPrice);
const dragging = ref(null);

// Stile del track
const sliderStyle = computed(() => {
    const percentageMin = ((minPrice.value - props.min) / (props.max - props.min)) * 100;
    const percentageMax = ((maxPrice.value - props.min) / (props.max - props.min)) * 100;
    return {
        left: `${percentageMin}%`,
        width: `${percentageMax - percentageMin}%`,
        background: '#003849',
    };
});

// Funzione per iniziare il dragging
const startDragging = (type) => {
    dragging.value = type;
    window.addEventListener('mousemove', onSliderMove);
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchmove', onSliderMove);
    window.addEventListener('touchend', stopDragging);
};

// Funzione per fermare il dragging
const stopDragging = () => {
    dragging.value = null;
    window.removeEventListener('mousemove', onSliderMove);
    window.removeEventListener('mouseup', stopDragging);
    window.removeEventListener('touchmove', onSliderMove);
    window.removeEventListener('touchend', stopDragging);
};

// Funzione per gestire il movimento dello slider
const onSliderMove = (event) => {
    const sliderBounds = event.target.parentElement.getBoundingClientRect();
    const sliderWidth = sliderBounds.width;
    const offsetX = event.clientX - sliderBounds.left;
    const value = Math.round(((offsetX / sliderWidth) * (props.max - props.min)) + props.min);

    // Impedire sovrapposizione e bloccare i valori
    if (dragging.value === 'min' && value < maxPrice.value) {
        minPrice.value = Math.min(value, maxPrice.value - 1);
        emit('update:minPrice', minPrice.value);
    } else if (dragging.value === 'max' && value > minPrice.value) {
        maxPrice.value = Math.max(value, minPrice.value + 1);
        emit('update:maxPrice', maxPrice.value);
    }
};

// Gestione input del MinPrice: impedisce sovrapposizione con MaxPrice
const updateMinPrice = () => {
    if (minPrice.value >= maxPrice.value) {
        minPrice.value = maxPrice.value - 1;
    }
    emit('update:minPrice', minPrice.value);
};

// Gestione input del MaxPrice: impedisce sovrapposizione con MinPrice
const updateMaxPrice = () => {
    if (maxPrice.value <= minPrice.value) {
        maxPrice.value = minPrice.value + 1;
    }
    emit('update:maxPrice', maxPrice.value);
};
</script>

<style scoped>
.slider-range {
    position: absolute;
    width: 100%;
    pointer-events: auto;
    -webkit-appearance: none;
    background: #003849;
    height: 8px;
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
