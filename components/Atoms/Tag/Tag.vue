<template>
    <button :class="typeClass" class="rounded-lg px-4 py-2 min-w-25" @click="emitClick">
        <p>{{ $t(`tag.${text}`) }}</p>
    </button>
</template>
<!-- TODO mettere traduzioni per le lingue -->
<script setup lang="ts">
import type { TagCode } from '~/components/Molecules/ListingTag/ListingTag.types';
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
    code: {
        type: String as () => TagCode,
        required: true
    }
});

const emit = defineEmits(["tagClicked"]);

const typeClass = computed(() => {
    return {
        "bg-accent-500 text-accent-50 font-bold active:bg-accent-950":
            props.type === TagType.ACTIVE,
        "bg-sky-100 text-primary-950 font-bold active:text-accent-950 active:border-accent-950":
            props.type === TagType.INACTIVE,
        "bg-white text-neutrals-400 border-[1px] border-neutrals-500":
            props.type === TagType.DISABLED,
    }
})

const emitClick = () => {
    emit("tagClicked", props.code);
};
</script>