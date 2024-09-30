<template>
    <div class="flex gap-3">
        <AtomsTag v-if="tags.length" v-for="(tag, index) in tags" 
        :key="index" :text="tag.text" :type="tag.type" />
    </div>
</template>

<script setup lang="ts">
import type { ListingTabProps } from './ListingTab.types';

const props = defineProps({
    tags: {
        type: Array as PropType<ListingTabProps[]>,
        default: () => [],
    }
})

</script>