<template>
    <div class="flex gap-3 flex-wrap my-8">
        <AtomsTag v-if="tags.length" v-for="(tag, index) in tags" 
        :text="tag.text"  :type="getTagType(index)" 
        @tagClicked="handleTagClick"  />
    </div>
</template>

<script setup lang="ts">
import { TagType } from '~/components/Atoms/Tag/tag.types';
import type { ListingTagProps } from './ListingTag.types';
const activeTagIndex = ref(-1);
const emit = defineEmits(["handleTagClick"]);

const props = defineProps({
    tags: {
        type: Array as PropType<ListingTagProps[]>,
        default: () => [],
    }
})

watch(() => props.tags, (newTags) => {
    const activeIndex = newTags.findIndex(tag => tag.type === TagType.ACTIVE);
    activeTagIndex.value = activeIndex >= 0 ? activeIndex : 0;
});


const getTagType = (index: number) => {
    if (props.tags[index].type === TagType.DISABLED) {
        return TagType.DISABLED; 
    }
    return index === activeTagIndex.value ? TagType.ACTIVE : TagType.INACTIVE; 
};

const handleTagClick = (text: string ) => {
    emit("handleTagClick",text)
};
const initializeActiveTag = () => {
    const firstActiveIndex = props.tags.findIndex(tag => tag.type === TagType.ACTIVE);
    
    if (firstActiveIndex !== -1) {
        activeTagIndex.value = firstActiveIndex; 
    } else {
        const firstNonDisabledIndex = props.tags.findIndex(tag => tag.type !== TagType.DISABLED);
        activeTagIndex.value = firstNonDisabledIndex !== -1 ? firstNonDisabledIndex : 0;
    }
};

onMounted(() => {
    initializeActiveTag();
});



</script>