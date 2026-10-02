<template>
    <div class="text-viewer">
        <!-- Il titolo compare solo se passato: prima restava un h5 vuoto. -->
        <h5 v-if="$slots.title" class="text-viewer__title">
            <slot name="title"></slot>
        </h5>
        <p class="text-viewer__body">
            <slot name="content"></slot>
        </p>
    </div>
</template>

<style scoped>
/* Solo tipografia: il contenitore (pannello di vetro nella scheda prodotto,
   riquadro d'aiuto nel carrello) lo decide chi usa il componente, così non
   si ritrova un pannello dentro l'altro. */
.text-viewer__title {
    margin-bottom: 8px;
    font-size: 17px;
    line-height: 1.3;
    font-weight: 700;
    color: var(--im-ink);
}

@media (min-width: 1024px) {
    .text-viewer__title {
        font-size: 20px;
        margin-bottom: 12px;
    }
}

.text-viewer__body {
    max-width: 78ch;
    font-size: 15px;
    line-height: 1.7;
    color: var(--im-muted);
    overflow-wrap: anywhere;
}

@media (min-width: 1024px) {
    .text-viewer__body {
        font-size: 17px;
    }
}
</style>
