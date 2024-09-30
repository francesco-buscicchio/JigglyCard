<template>
    <button :class="tagClass" @click="emitClick">
        <p>{{ text }}</p>


    </button>
</template>

<script setup lang="ts">
import { TagType } from './tag.types';

const props = defineProps({
    type: {
        type: String,
        default: "active",
        validator: (value: TagType) => [TagType.ACTIVE, TagType.INACTIVE, TagType.DISABLED].includes(value),
    },
    text: {
        type: String,
        default: "",
    },
});

const emit = defineEmits(["tagClicked"]);

const tagClass = computed(() => {
    return {
        "bg-accent-500 text-accent-50 font-bold py-3 px-4 rounded-lg active:bg-accent-950 w-full":
            props.type === TagType.ACTIVE,
        "bg-white text-accent-500 border-[2px] border-accent-500 font-bold py-3 px-4 rounded-lg active:text-accent-950 active:border-accent-950 w-full":
            props.type === TagType.INACTIVE,
        "bg-neutrals-200 text-neutrals-500 py-3 px-4 rounded-lg rounded-lg w-full":
            props.type === TagType.DISABLED,
    }
})

const emitClick = () => {
    emit("tagClicked");
};
</script>