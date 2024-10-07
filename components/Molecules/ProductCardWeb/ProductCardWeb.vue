<template>
    <div>

        <div class="flex relative flex-col">
            <img :src="imageUrl" :alt="productName" class="max-h-75 max-w-50 object-cover" />


            <div class="w-50 h-73 px-3 pt-32 mt-8 absolute layer">
                <div class="relative group flex flex-col gap-y-2 items-center cursor-default pt-2">
                    <h5 class="overflow-hidden whitespace-nowrap text-ellipsis w-full text-center">{{ productName }}</h5>
                    <p class="text-lg">{{ code }}</p>
                    <p class="text-lg">{{ expansion }}</p>
                    <label class="text-xs">{{ $t("startingFrom") }} <p class="ml-5 font-bold inline text-2xl"> {{ price }} €</p></label>
                    <div
                        class="absolute hidden group-hover:block bg-accent-500 text-white text-[10px] rounded p-1 bottom-full transform max-w-xs whitespace-no-wrap">
                        {{ productName }}
                    </div>
                </div>
            </div>


            <div class="mt-12">
                <AtomsButtonCTA :type="buttonCtaType" :text="$t('showDetails')"
                    v-on:button-clicked="navigateTo(`/${tcg}/${category}/${id}`)" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
// TODO: separare le props in un file separato
const props = defineProps({
    colorScheme: {
        type: String,
    },
    id: {
        type: String,
    },
    tcg: {
        type: String,
    },
    category: {
        type: String,
    },
    productName: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    expansion: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
});

const containerClass = computed(() => {
    switch (props.colorScheme) {
        case "primaryHome":
            return "bg-accent-500 text-white border-white border-[1px] mx-4 min-h-80 max-h-80 flex flex-col justify-between p-4 rounded-lg";
        case "lightHome":
            return "bg-white text-neutrals-950 border-[1px] mx-4 border-accent-950 min-h-80 max-h-80 flex flex-col justify-between p-4  rounded-lg";
        case "noBorder":
            return "bg-white text-neutrals-950 mx-4 min-h-80 max-h-80 flex flex-col justify-between p-4";
        default:
            return "rounded-lg shadow-md overflow-hidden w-full min-h-80 max-h-80 flex flex-col justify-between p-4";
    }
});

const buttonCtaType = computed(() => {
    switch (props.colorScheme) {
        case "primaryHome":
            return "secondary";
        case "lightHome":
            return "primary";
        default:
            return "primary";
    }
});
</script>

<style scoped>
.layer {
    background-image: -webkit-linear-gradient(0deg, #ffffff 10%, rgba(0, 0, 0, 0) 50%);
    background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 10%, #fff 50%);
}
</style>