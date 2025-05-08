<template>
    <div>
        <p class="mb-4 lg:mb-2">{{ title }}:</p>
        <div class="flex gap-3 flex-wrap">
            <div v-if="tags.length" v-for="(tag, index) in tags">
                <AtomsTag :text="tag.text" :type="getTagType(index)" :code="tag.code" @tagClicked="handleTagClick" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { TagType } from "~/enum/tag.enum";
import type { ListingTag } from "~/types/listingTag.type";
import type { TagCode } from "~/types/tagCode.type";

const activeTagIndex = ref(-1);
const emit = defineEmits(["handleTagClick"]);

const props = defineProps({
  tags: {
    type: Array as PropType<ListingTag[]>,
    default: () => [],
  },
  title: {
    type: String,
  },
});

watch(
  () => props.tags,
  (newTags) => {
    const activeIndex = newTags.findIndex((tag) => tag.type === TagType.ACTIVE);
    activeTagIndex.value = activeIndex >= 0 ? activeIndex : 0;
  }
);

const getTagType = (index: number) => {
  if (props.tags[index].type === TagType.DISABLED) {
    return TagType.DISABLED;
  }
  return index === activeTagIndex.value ? TagType.ACTIVE : TagType.INACTIVE;
};

const handleTagClick = (code: TagCode) => {
  emit("handleTagClick", code);
};
const initializeActiveTag = () => {
  const firstActiveIndex = props.tags.findIndex(
    (tag) => tag.type === TagType.ACTIVE
  );

  if (firstActiveIndex !== -1) {
    activeTagIndex.value = firstActiveIndex;
  } else {
    const firstNonDisabledIndex = props.tags.findIndex(
      (tag) => tag.type !== TagType.DISABLED
    );
    activeTagIndex.value =
      firstNonDisabledIndex !== -1 ? firstNonDisabledIndex : 0;
  }
};

onMounted(() => {
  initializeActiveTag();
});
</script>
