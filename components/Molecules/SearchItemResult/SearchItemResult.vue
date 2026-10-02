<template>
  <NuxtLink
    :to="`/${tcg}/${type}/${objectID}`"
    class="result"
    @click="$emit('itemClick')"
  >
    <span class="result__thumb">
      <!-- Il nome è già nel testo accanto: l'immagine è decorativa. -->
      <img
        :src="thumbnailImage || defaultCardImage"
        alt=""
        loading="lazy"
        decoding="async"
      />
    </span>
    <span class="result__text">
      <span class="result__name">{{ name }}</span>
      <span class="result__set">{{ expansion }}</span>
    </span>
    <span v-if="formattedPrice" class="result__price">{{ formattedPrice }}</span>
    <Icon
      v-else
      name="heroicons:chevron-right-20-solid"
      size="18"
      class="result__arrow"
      aria-hidden="true"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
import defaultCardImage from "@/assets/img/default-card-image.png";
const emit = defineEmits(["itemClick"]);
const props = defineProps({
  thumbnailImage: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  objectID: {
    type: String,
    required: true,
  },
  tcg: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  expansion: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: false,
    default: 0,
  },
});

// L'header mobile non passa il prezzo (e potrebbe arrivare null): niente
// `.toFixed` su un valore che non è un numero. Con il default a 0 il prezzo
// si mostra solo se c'è davvero, a qualunque larghezza: l'header mobile
// ormai arriva fino a 1279px e lì comparirebbe "0.00 €".
const formattedPrice = computed(() =>
  typeof props.price === "number" &&
  Number.isFinite(props.price) &&
  props.price > 0
    ? `${props.price.toFixed(2)} €`
    : null,
);
</script>

<style scoped>
/* Riga del risultato: miniatura della carta, nome e set, prezzo a destra. */
.result {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  min-width: 0;
  padding: 10px 12px 10px 10px;
  border-radius: 18px;
  border: 1px solid transparent;
  background: rgba(255, 255, 255, 0.03);
  color: var(--im-ink);
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.result:hover {
  border-color: rgba(247, 210, 216, 0.35);
  background: rgba(247, 210, 216, 0.08);
  transform: translateY(-1px);
}

.result:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 2px;
}

.result,
.result * {
  cursor: pointer;
}

.result__thumb {
  flex: none;
  width: 44px;
  aspect-ratio: 63 / 88;
  overflow: hidden;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 8px 18px -10px rgba(0, 0, 0, 0.8);
}

@media (min-width: 1024px) {
  .result__thumb {
    width: 52px;
  }
}

.result__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.result__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.result__name {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--im-ink);
}

.result__set {
  overflow: hidden;
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--im-muted);
}

/* Il prezzo arriva solo dalla tendina desktop; al suo posto, altrove, c'è
   la freccia. */
.result__price {
  display: inline-flex;
  flex: none;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid rgba(247, 210, 216, 0.3);
  background: rgba(247, 210, 216, 0.08);
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  color: var(--im-pink);
}

.result__arrow {
  flex: none;
  color: var(--im-muted);
  transition:
    transform 0.2s ease,
    color 0.2s ease;
}

.result:hover .result__arrow {
  color: var(--im-pink);
  transform: translateX(2px);
}

@media (prefers-reduced-motion: reduce) {
  .result,
  .result__arrow {
    transition: none;
  }

  .result:hover,
  .result:hover .result__arrow {
    transform: none;
  }
}
</style>
