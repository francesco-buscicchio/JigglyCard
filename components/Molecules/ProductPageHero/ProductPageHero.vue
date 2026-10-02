<template>
  <div class="page-hero">
    <div class="page-hero__stage">
      <img :src="image" class="page-hero__image" :alt="title" />
    </div>
    <div class="page-hero__chips">
      <span v-if="code" class="page-hero__chip page-hero__chip--code">#{{ code }}</span>
      <span class="page-hero__chip">
        <Icon name="heroicons:rectangle-stack-20-solid" size="14" aria-hidden="true" />
        {{ formattedExpansion }}
      </span>
    </div>
    <!-- h1: su mobile è questo il titolo della pagina prodotto. -->
    <h1 class="page-hero__title">{{ title }}</h1>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  expansion: {
    type: String,
    required: true,
  },
  code: {
    type: String,
  },
});

const formattedExpansion = computed(() => {
  return props.expansion.charAt(0).toUpperCase() + props.expansion.slice(1);
});
</script>

<style scoped>
.page-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  width: 100%;
  text-align: center;
}

/* Alone d'ambiente dietro l'immagine, come sul desktop. */
.page-hero__stage {
  position: relative;
  isolation: isolate;
  margin: 8px 0 10px;
}

.page-hero__stage::before {
  content: "";
  position: absolute;
  inset: 6% -14% -6%;
  z-index: -1;
  border-radius: 50%;
  background:
    radial-gradient(closest-side at 35% 40%, rgba(236, 145, 160, 0.34), transparent),
    radial-gradient(closest-side at 70% 70%, rgba(92, 200, 224, 0.24), transparent);
  filter: blur(32px);
  pointer-events: none;
}

.page-hero__image {
  display: block;
  width: min(72vw, 320px);
  border-radius: 16px;
  box-shadow:
    0 26px 50px -22px rgba(0, 0, 0, 0.8),
    0 0 0 1px rgba(255, 255, 255, 0.08);
}

.page-hero__chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  max-width: 100%;
}

.page-hero__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.05);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--im-muted);
}

.page-hero__chip--code {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  color: var(--im-pink);
  border-color: rgba(247, 210, 216, 0.3);
  background: rgba(247, 210, 216, 0.08);
}

.page-hero__title {
  font-family: "Unbounded", "Roboto Flex", sans-serif;
  font-weight: 800;
  font-size: clamp(26px, 7.4vw, 34px);
  line-height: 1.08;
  letter-spacing: -0.02em;
  color: var(--im-ink);
  overflow-wrap: anywhere;
  text-wrap: balance;
}
</style>
