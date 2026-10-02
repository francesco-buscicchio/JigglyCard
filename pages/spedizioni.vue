<template>
  <div class="shipping im-container">
    <MoleculesBreadcrumb />

    <header class="shipping__intro">
      <p class="im-eyebrow">{{ t("shippingPage.kicker") }}</p>
      <h1 class="im-display shipping__title">
        {{ t("shippingPage.title") }}
        <span class="im-gradient-text">{{ t("shippingPage.titleHighlight") }}</span>
      </h1>
      <p class="im-lead shipping__lead">
        {{ t("home.service.fastShipping.description") }}
      </p>
    </header>

    <section v-reveal class="shipping__panel im-glass">
      <h2 class="shipping__heading">
        <Icon name="heroicons:truck-20-solid" size="22" />
        {{ t("shippingPage.methodsTitle") }}
      </h2>
      <p class="shipping__text">{{ t("shippingPage.methodsLead") }}</p>

      <ul v-if="methods.length" class="shipping__methods">
        <li v-for="method in methods" :key="method.id" class="shipping__method">
          <span class="shipping__method-badge">
            {{ method.international ? t("shippingPage.international") : t("shippingPage.domestic") }}
          </span>
          <span class="shipping__method-name">{{ method.name }}</span>
          <span class="im-display shipping__method-price">
            {{ formatEuro(method.priceCents) }}
          </span>
          <span v-if="method.maxValueCents" class="shipping__method-note">
            {{ t("shippingPage.maxValue", { value: formatEuro(method.maxValueCents) }) }}
          </span>
        </li>
      </ul>
      <div v-else-if="loading" class="shipping__methods">
        <div v-for="n in 3" :key="n" class="shipping__method shipping__method--skeleton"></div>
      </div>
    </section>

    <div class="shipping__grid">
      <section v-reveal class="shipping__panel im-glass">
        <h2 class="shipping__heading">
          <Icon name="heroicons:shield-check-20-solid" size="22" />
          {{ t("shippingPage.packagingTitle") }}
        </h2>
        <p class="shipping__text">{{ t("cart.help.content") }}</p>
      </section>

      <section v-reveal="80" class="shipping__panel im-glass">
        <h2 class="shipping__heading">
          <Icon name="heroicons:arrow-uturn-left-20-solid" size="22" />
          {{ t("shippingPage.returnsTitle") }}
        </h2>
        <p class="shipping__text">{{ t("shippingPage.returnsText") }}</p>
        <NuxtLink to="/assistenza" class="im-btn im-btn--ghost shipping__cta">
          {{ t("shippingPage.cta") }}
          <Icon name="heroicons:arrow-right-20-solid" size="18" />
        </NuxtLink>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CmsShippingMethod } from "~/types/shop";

/**
 * Spedizioni, resi e rimborsi: la pagina a cui porta il footer. I metodi e i
 * prezzi arrivano dal CMS, gli stessi proposti al checkout, così la pagina non
 * va aggiornata a mano quando cambiano.
 */
const { t, locale } = useI18n();
const { getShippingMethods } = useShop();

const methods = ref<CmsShippingMethod[]>([]);
const loading = ref(true);

const formatEuro = (cents: number) =>
  (cents / 100).toLocaleString(locale.value.startsWith("it") ? "it-IT" : "en-US", {
    style: "currency",
    currency: "EUR",
  });

onMounted(async () => {
  try {
    const result = await getShippingMethods();
    methods.value = [...result.items].sort((a, b) => a.priceCents - b.priceCents);
  } catch {
    methods.value = [];
  } finally {
    loading.value = false;
  }
});

useHead({
  title: `${t("layout.footer.links.shipping")} · Jigglycard`,
  meta: [{ name: "description", content: t("home.service.fastShipping.description") }],
});
</script>

<style scoped>
.shipping {
  padding-bottom: 100px;
}

.shipping__intro {
  max-width: 760px;
  padding: 8px 0 32px;
}

.shipping__title {
  margin-top: 12px;
  font-size: clamp(32px, 5vw, 56px);
}

.shipping__lead {
  margin-top: 14px;
}

.shipping__panel {
  padding: 28px;
  border-radius: 28px;
}

.shipping__grid {
  display: grid;
  gap: 20px;
  margin-top: 20px;
}

@media (min-width: 900px) {
  .shipping__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.shipping__heading {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 22px;
}

.shipping__heading :deep(svg),
.shipping__heading .iconify {
  color: var(--im-pink-strong);
}

.shipping__text {
  max-width: 70ch;
  margin-top: 10px;
  font-size: 16px;
  line-height: 1.65;
  color: var(--im-muted);
}

.shipping__methods {
  display: grid;
  gap: 14px;
  margin-top: 20px;
}

@media (min-width: 640px) {
  .shipping__methods {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
}

.shipping__method {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 140px;
  padding: 18px 20px;
  border-radius: 20px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.04);
  transition:
    border-color 0.2s ease,
    transform 0.2s ease;
}

.shipping__method:hover {
  border-color: rgba(247, 210, 216, 0.45);
  transform: translateY(-2px);
}

.shipping__method--skeleton {
  animation: shipping-pulse 1.4s ease-in-out infinite;
}

.shipping__method-badge {
  align-self: flex-start;
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(92, 200, 224, 0.4);
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--im-teal);
}

.shipping__method-name {
  font-size: 16px;
  font-weight: 600;
}

.shipping__method-price {
  margin-top: auto;
  font-size: 28px;
}

.shipping__method-note {
  font-size: 12px;
  color: var(--im-muted);
}

.shipping__cta {
  margin-top: 20px;
}

@keyframes shipping-pulse {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .shipping__method--skeleton {
    animation: none;
  }
}
</style>
