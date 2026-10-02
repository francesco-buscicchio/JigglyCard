<template>
  <article class="line">
    <!--
      Una sola impaginazione per mobile e desktop: la card cambia forma con la
      propria larghezza (container query), non con quella dello schermo. Prima
      c'erano due copie della card alternate con v-show, e su mobile il
      "Elimina dal carrello" non era collegato a niente.
    -->
    <div class="line__grid">
      <!--
        La miniatura porta alla scheda prodotto come il titolo (che sta nello
        slot), ma fuori dal giro del tab: per tastiera e lettori di schermo
        basta un link per riga. Quantità e cestino restano fuori dai link.
      -->
      <NuxtLink
        v-if="url"
        :to="url"
        class="line__thumb line__thumb--link"
        tabindex="-1"
        aria-hidden="true"
      >
        <img
          :src="image ?? defaultCardImage"
          alt=""
          class="line__img"
          loading="lazy"
        />
      </NuxtLink>
      <div v-else class="line__thumb">
        <!-- Decorativa: il nome del prodotto è subito accanto. -->
        <img
          :src="image ?? defaultCardImage"
          alt=""
          class="line__img"
          loading="lazy"
        />
      </div>

      <div class="line__info">
        <slot />
      </div>

      <div class="line__qty">
        <OrganismsQuantitySelect
          :price="price"
          :quantity="availableQuantity"
          :selectedQuantity="quantity"
          @quantityChanged="quantityChange"
        />
      </div>

      <button
        type="button"
        class="line__remove"
        :aria-label="`${t('catalog.controls.remove')} ${alt}`"
        :title="t('catalog.controls.remove')"
        @click="removeVariant"
      >
        <Icon name="heroicons:trash-20-solid" size="18" />
      </button>
    </div>
  </article>
</template>

<script lang="ts" setup>
import defaultCardImage from "@/assets/img/default-card-image.png";
const emit = defineEmits(["removeVariantClicked", "quantityChanged"]);
const { t } = useI18n();

const quantity = computed(() => {
  return props.selectedQuantity;
});

function quantityChange(newQuantity: Number) {
  emit("quantityChanged", newQuantity);
}

const props = defineProps({
  alt: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  selectedQuantity: {
    type: Number,
    default: 1,
  },
  availableQuantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  // Pagina del prodotto: se c'è, la miniatura diventa un link.
  url: {
    type: String,
    default: "",
  },
});

const removeVariant = () => {
  emit("removeVariantClicked");
};
</script>

<style scoped>
.line {
  container-type: inline-size;
  position: relative;
  padding: 14px;
  border-radius: 24px;
  border: 1px solid var(--im-line);
  background:
    radial-gradient(120% 140% at 0% 0%, rgba(236, 145, 160, 0.08), transparent 55%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.025));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

@media (min-width: 768px) {
  .line {
    padding: 18px 20px;
  }
}

/* La card è un contesto di impilamento a sé (vetro e container query): con
   il menu quantità aperto deve stare sopra le card successive, altrimenti
   queste coprono la tendina. `:has` copre Safari, dove il clic non dà il
   focus al bottone. */
.line:focus-within,
.line:has(.sorter__list) {
  z-index: 3;
}

.line:hover,
.line:focus-within {
  border-color: rgba(247, 210, 216, 0.28);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 18px 40px -24px rgba(236, 145, 160, 0.55);
}

/* Mobile: miniatura e dati in alto, quantità e prezzo su tutta la riga. */
.line__grid {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) auto;
  grid-template-areas:
    "thumb info remove"
    "qty qty qty";
  gap: 14px 14px;
  align-items: start;
}

.line__thumb {
  grid-area: thumb;
  position: relative;
  aspect-ratio: 63 / 88;
  overflow: hidden;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  box-shadow: 0 12px 26px -14px rgba(0, 0, 0, 0.8);
}

/* Riflesso olografico appena accennato, come le carte della home. */
.line__thumb::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    125deg,
    transparent 30%,
    rgba(255, 255, 255, 0.16) 45%,
    rgba(92, 200, 224, 0.12) 52%,
    transparent 66%
  );
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
  pointer-events: none;
}

.line__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.line__thumb--link {
  display: block;
  cursor: pointer;
  transition: box-shadow 0.25s ease;
}

.line__thumb--link:hover {
  box-shadow:
    0 0 0 1px rgba(247, 210, 216, 0.55),
    0 14px 30px -12px rgba(236, 145, 160, 0.7);
}

.line__thumb--link:hover .line__img {
  transform: scale(1.05);
}

.line__thumb--link:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 3px;
}

.line__info {
  grid-area: info;
  min-width: 0;
  align-self: center;
}

.line__qty {
  grid-area: qty;
  padding-top: 12px;
  border-top: 1px solid transparent;
  border-image: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.14) 20%,
      rgba(255, 255, 255, 0.14) 80%,
      transparent
    )
    1;
}

.line__remove {
  grid-area: remove;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.04);
  color: var(--im-muted);
  cursor: pointer;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.line__remove:hover {
  color: var(--im-pink);
  border-color: rgba(247, 210, 216, 0.45);
  background: rgba(224, 81, 104, 0.14);
}

.line__remove:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 2px;
}

/* Card larga (carrello su desktop o tablet): tutto su una riga, con prezzo
   sopra e quantità sotto, allineati a destra. */
@container (min-width: 560px) {
  .line__grid {
    grid-template-columns: 88px minmax(0, 1fr) auto auto;
    grid-template-areas: "thumb info qty remove";
    gap: 20px;
    align-items: center;
  }

  .line__qty {
    padding-top: 0;
    border-top: 0;
  }

  .line__qty :deep(.qty) {
    flex-direction: column-reverse;
    align-items: flex-end;
    gap: 12px;
  }

  .line__qty :deep(.qty__price) {
    font-size: 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .line,
  .line__remove,
  .line__img,
  .line__thumb--link {
    transition: none;
  }

  .line__thumb--link:hover .line__img {
    transform: none;
  }
}
</style>
