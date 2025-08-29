<template>
    <section class="space-y-10">
        <article v-for="(item, idx) in items" :key="idx" class="space-y-6">
            <!-- Titolo  -->
            <h3 v-if="item.title" class="text-center text-xl md:text-2xl font-semibold">
                {{ item.title }}
            </h3>

            <!-- Row content -->
            <div :class="[
                'flex flex-col gap-6 md:gap-10',
                item.image
                    ? (idx % 2 === 1 ? 'md:flex-row-reverse md:items-center' : 'md:flex-row md:items-center')
                    : ''
            ]">
                <!-- Col img -->
                <div v-if="item.image" class="md:w-1/2">
                    <img :src="item.image" :alt="item.alt || (item.subtitle ? String(item.subtitle) : 'image')"
                        class="w-full rounded-2xl object-cover" />
                </div>

                <!-- Col text -->
                <div :class="[item.image ? 'md:w-1/2' : 'md:w-full']" class="space-y-4">
                    <template v-if="item.sections && item.sections.length">
                        <div v-for="(section, sIdx) in item.sections" :key="sIdx" class="space-y-2">
                            <h4 v-if="section.subtitle" class="text-lg md:text-xl font-semibold">
                                {{ section.subtitle }}
                            </h4>
                            <template v-for="(p, pIdx) in normalizeText(section.text)" :key="pIdx">
                                <p class="leading-relaxed">{{ p }}</p>
                            </template>
                        </div>
                    </template>

                    <template v-else>
                        <h4 v-if="item.subtitle || item.title" class="text-lg md:text-xl font-semibold">
                            {{ item.subtitle || item.title }}
                        </h4>
                        <template v-for="(p, pIdx) in normalizeText(item.text)" :key="pIdx">
                            <p class="leading-relaxed">{{ p }}</p>
                        </template>
                    </template>
                </div>
            </div>
        </article>
    </section>
</template>

<script setup lang="ts">
type Paragraphish = string | string[]

type Section = {
    subtitle?: string
    text: Paragraphish
}

type Item = {
    image?: string
    alt?: string
    subtitle?: string
    title?: string
    text?: Paragraphish
    sections?: Section[]
}

defineProps<{
    items: Item[]
}>()

const normalizeText = (val?: Paragraphish): string[] => {
    if (Array.isArray(val)) return val.filter(Boolean).map(String)
    if (!val) return []
    return String(val)
        .split(/\n{2,}/g)
        .map(s => s.trim())
        .filter(Boolean)
}
</script>
