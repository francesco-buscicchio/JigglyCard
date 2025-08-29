<template>
    <div class="text-center">
        <h2 class="text-accent-500 text-center p-8">{{ t("teamJiggly") }}</h2>
    </div>

    <div class="mx-8">
        <OrganismsImagesAndText :items="items" class="my-10" />
    </div>

    <div class="md:flex my-8 ">
        <div class="md:w-[50%] text-center mb-8">
            <p class="mb-4">{{ t("doYouNeedAssistance") }}</p>
            <AtomsButtonCTA type="primary" :text="t('contactUs')" class="!inline-flex !w-auto !px-3 !py-2" />
        </div>

        <div class="md:w-[50%] text-center">
            <p class="mb-4">{{ t("collectionValued") }}</p>
            <AtomsButtonCTA type="primary" :text="t('reserveYourSlot')" class="!inline-flex !w-auto !px-3 !py-2" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const { t } = useI18n()

import testimg from '~/assets/img/404-image.avif'

const items = computed(() => [
    {
        image: testimg,
        alt: 'Team Jigglycard al desk con TCG e laptop',
        sections: [
            { subtitle: t('about.ourStory.title'), text: t('about.ourStory.body') },
            { subtitle: t('about.whatWeDo.title'), text: t('about.whatWeDo.body') },
            { subtitle: t('about.whyUs.title'), text: t('about.whyUs.body') }
        ]
    },
    {
        image: testimg,
        alt: 'Catalogo TCG e community Jigglycard',
        sections: [
            { subtitle: t('about.numbers.title'), text: t('about.numbers.body') },
            { subtitle: t('about.community.title'), text: t('about.community.body') },
            { subtitle: t('about.goals.title'), text: t('about.goals.body') },
            { subtitle: t('about.where.title'), text: t('about.where.body') }
        ]
    }
])
</script>
