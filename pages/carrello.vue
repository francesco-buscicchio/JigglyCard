<template>
  <div class="cart-page">
    <div class="im-container">
      <MoleculesBreadcrumb />

      <header class="cart-head">
        <h1 class="im-display cart-head__title">
          <span>{{ t("cart.title") }}</span>
          <span v-if="!isLoading && products.length" class="cart-head__count">
            {{ piecesCount }}
          </span>
        </h1>

        <!-- Le tre tappe dell'acquisto: qui si è alla prima. -->
        <ol class="steps">
          <li class="steps__item is-current" aria-current="step">
            <span class="steps__dot">01</span>
            <span class="steps__label">{{ t("cart.title") }}</span>
          </li>
          <li class="steps__item">
            <span class="steps__dot">02</span>
            <span class="steps__label">{{ t("checkout.shippingInfo") }}</span>
          </li>
          <li class="steps__item">
            <span class="steps__dot">03</span>
            <span class="steps__label">{{ t("payments.methodsTitle") }}</span>
          </li>
        </ol>
      </header>

      <!-- Stessa forma della pagina caricata, così il contenuto non salta. -->
      <div v-if="isLoading" class="cart-layout" aria-hidden="true">
        <div class="cart-lines__list">
          <div v-for="item in 2" :key="item" class="skeleton skeleton--line">
            <span class="skeleton__thumb"></span>
            <span class="skeleton__bars">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
        </div>
        <div class="skeleton skeleton--panel"></div>
      </div>

      <div v-else-if="products.length > 0">
        <div v-if="stockIssues.length" class="stock-alert" role="alert">
          <span class="stock-alert__icon">
            <Icon name="heroicons:exclamation-triangle-20-solid" size="20" />
          </span>
          <div class="min-w-0">
            <p class="stock-alert__title">
              {{ t("cart.stockChanged") }}
            </p>
            <ul class="stock-alert__list">
              <li v-for="issue in stockIssues" :key="issue.variantId">
                <span class="stock-alert__name">{{ issue.name }}</span> —
                {{ t("cart.stockRequested") }} {{ issue.requested }},
                {{ t("cart.stockAvailable") }} {{ issue.available }}
              </li>
            </ul>
          </div>
        </div>

        <div class="cart-layout">
          <ul class="cart-lines__list">
            <li
              v-for="(item, index) of products"
              :key="item.id"
              v-reveal="Math.min(index, 4) * 70"
            >
              <MoleculesCartCard
                :image="item.image"
                :selectedQuantity="item.selectedQuantity"
                :availableQuantity="item.availableQuantity"
                :price="item.price"
                :alt="item.title"
                :url="item.url"
                @removeVariantClicked="removeItem(item)"
                @quantityChanged="changeQuantity($event, item)"
              >
                <div class="line-info">
                  <p
                    v-if="extractProductCode(item.title)"
                    v-show="isDesktopView"
                    class="line-info__code"
                  >
                    {{ extractProductCode(item.title) }}
                  </p>
                  <h2 class="line-info__title">
                    <NuxtLink :to="item.url" class="line-info__link">
                      {{ formatProductName(item.title) }}
                    </NuxtLink>
                  </h2>
                  <ul
                    v-if="item.language || item.condition"
                    class="line-info__chips"
                  >
                    <li v-if="item.language" class="chip">
                      <Icon
                        name="heroicons:language-20-solid"
                        size="14"
                        class="chip__icon"
                      />
                      {{ tagLabel(item.language) }}
                    </li>
                    <li v-if="item.condition" class="chip chip--condition">
                      <Icon
                        name="heroicons:sparkles-20-solid"
                        size="14"
                        class="chip__icon"
                      />
                      {{ tagLabel(item.condition) }}
                    </li>
                  </ul>
                </div>
              </MoleculesCartCard>
            </li>
          </ul>

          <div class="cart-aside" v-if="products.length > 0">
            <OrganismsShippingMode
              :total-cart="totalCart"
              :products="products"
              :couponData="couponData"
              @couponApplied="applyCoupon($event)"
              @removeCoupon="removeCoupon($event)"
            />
          </div>
        </div>
      </div>

      <div v-else v-reveal class="cart-empty">
        <span class="cart-empty__icon">
          <Icon name="heroicons:shopping-bag-20-solid" size="30" />
        </span>
        <h2 class="cart-empty__text">
          {{ t("cart.empty") }}
        </h2>
      </div>
    </div>

    <div class="cart-suggested">
      <OrganismsProductCarouselWeb
        v-if="isDesktopView"
        :title="
          dealsProducts.length > 0
            ? t('product.messages.suggested')
            : t('cart.startExploring')
        "
        :products="dealsProducts"
        colorScheme="lightHome"
      />
      <OrganismsProductCarousel
        v-if="isMobileView"
        :title="
          dealsProducts.length > 0
            ? t('product.messages.suggested')
            : t('cart.startExploring')
        "
        :products="dealsProducts"
        colorScheme="lightHome"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { mapStorefrontProducts } from "~/mapper/storefront.mapper";
import { useCartStore } from "~/stores/cart";
import type { ProductType } from "~/types/productType.type";

const isDesktopView = isDesktop();
const isMobileView = isMobile();
const { t, te, locale } = useI18n();
const { getRecommended } = useShop();
const { recentlyViewed } = useRecentlyViewed();
const cartStore = useCartStore();

// Il carrello è diverso per ogni visitatore: niente da indicizzare.
useSeoMeta({ title: () => t("cart.title"), robots: "noindex, nofollow" });

const dealsProducts: Ref<ProductType[]> = ref([]);
const {
  products,
  totalCart,
  couponData,
  isLoading,
  stockIssues,
  changeQuantity,
  removeItem,
  applyCoupon,
  removeCoupon,
} = useCart();

// Solo per il contatore accanto al titolo: i pezzi, non le righe.
const piecesCount = computed(() =>
  products.value.reduce((sum, item) => sum + item.selectedQuantity, 0),
);

// Lingua e condizione arrivano come codici ("it", "Slightly Played"): si
// mostrano con le stesse etichette dei tag della scheda prodotto.
const tagLabel = (value: string) => {
  const key = `catalog.tags.${value}`;
  return te(key) ? t(key) : value;
};

// Suggeriti in base a cosa c'è nel carrello e a cosa è stato guardato.
onMounted(async () => {
  cartStore.hydrate();
  const suggested = await getRecommended({
    seedSlugs: [
      ...cartStore.lines.map((line) => line.productSlug),
      ...recentlyViewed(),
    ],
    excludeSlugs: cartStore.lines.map((line) => line.productSlug),
    limit: 5,
  });
  dealsProducts.value = mapStorefrontProducts(suggested.items, locale.value);
});
</script>

<style scoped>
.cart-page {
  padding-bottom: 24px;
}

/* --- Intestazione --------------------------------------------------- */

.cart-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px 32px;
  padding: 18px 0 28px;
}

.cart-head__title {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: clamp(34px, 6vw, 60px);
  line-height: 1;
}

/* Contatore dei pezzi: la stessa pillola rosa del badge del carrello. */
.cart-head__count {
  display: inline-grid;
  place-content: center;
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  border-radius: 999px;
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0;
  color: #2a0a14;
  background: linear-gradient(135deg, #fde4e8, var(--im-pink-strong));
  box-shadow: 0 8px 24px -8px rgba(236, 145, 160, 0.8);
}

/* --- Tappe dell'acquisto (uguali in checkout.vue) -------------------- */

.steps {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.steps__item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  color: var(--im-muted);
}

.steps__item + .steps__item::before {
  content: "";
  flex: none;
  width: 24px;
  height: 1px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.3));
}

.steps__dot {
  flex: none;
  display: inline-grid;
  place-content: center;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.04);
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 11px;
  font-weight: 600;
}

.steps__label {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 11px;
  line-height: 1.3;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.steps__item.is-current {
  color: var(--im-ink);
}

.steps__item.is-current .steps__dot {
  border-color: transparent;
  color: #2a0a14;
  background: linear-gradient(135deg, #fde4e8, var(--im-pink-strong));
  box-shadow:
    0 0 0 4px rgba(236, 145, 160, 0.14),
    0 0 18px rgba(236, 145, 160, 0.55);
}

/* Su mobile restano solo i numeri, più l'etichetta della tappa corrente. */
@media (max-width: 639px) {
  .steps__item:not(.is-current) .steps__label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
}

/* --- Impaginazione --------------------------------------------------- */

.cart-layout {
  display: grid;
  gap: 20px;
}

@media (min-width: 1024px) {
  .cart-layout {
    grid-template-columns: minmax(0, 1fr) 384px;
    gap: 32px;
    align-items: start;
  }

  /* Il riepilogo segue lo scorrimento delle righe, sotto l'header fisso. */
  .cart-aside {
    position: sticky;
    top: 112px;
  }
}

@media (min-width: 1280px) {
  .cart-layout {
    grid-template-columns: minmax(0, 1fr) 410px;
    gap: 40px;
  }
}

.cart-lines__list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
}

.cart-aside {
  min-width: 0;
}

/* --- Dati della riga (contenuto dello slot di CartCard) -------------- */

.line-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.line-info__code {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 11px;
  line-height: 1.3;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--im-pink);
}

.line-info__title {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  font-family: "Unbounded", "Roboto Flex", sans-serif;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
  overflow-wrap: anywhere;
  color: var(--im-ink);
}

@media (min-width: 768px) {
  .line-info__title {
    font-size: 17px;
  }
}

/* Link alla scheda prodotto: al passaggio si accende in rosa e sotto corre
   un filo sfumato (niente sottolineatura fissa). */
.line-info__link {
  border-radius: 4px;
  color: inherit;
  background-image: linear-gradient(90deg, var(--im-pink), var(--im-teal));
  background-position: 0 100%;
  background-repeat: no-repeat;
  background-size: 0% 1px;
  transition:
    color 0.2s ease,
    background-size 0.35s ease;
}

.line-info__link:hover {
  color: var(--im-pink);
  background-size: 100% 1px;
}

.line-info__link:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 3px;
}

.line-info__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.05);
  font-size: 12px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--im-ink);
}

.chip__icon {
  color: var(--im-pink);
}

.chip--condition {
  border-color: rgba(92, 200, 224, 0.3);
  background: rgba(92, 200, 224, 0.08);
}

.chip--condition .chip__icon {
  color: var(--im-teal);
}

/* --- Avviso scorte --------------------------------------------------- */

.stock-alert {
  display: flex;
  gap: 14px;
  margin-bottom: 20px;
  padding: 16px 18px;
  border-radius: 20px;
  border: 1px solid rgba(255, 210, 122, 0.35);
  background: linear-gradient(160deg, rgba(255, 210, 122, 0.12), rgba(255, 210, 122, 0.04));
}

.stock-alert__icon {
  flex: none;
  display: inline-grid;
  place-content: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  color: #2b1d00;
  background: linear-gradient(135deg, #ffe7b0, var(--im-gold));
}

.stock-alert__title {
  padding-bottom: 6px;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.45;
  color: var(--im-ink);
}

.stock-alert__list li {
  font-size: 14px;
  line-height: 1.5;
  color: var(--im-muted);
}

.stock-alert__name {
  font-weight: 600;
  color: var(--im-ink);
}

/* --- Caricamento ----------------------------------------------------- */

.skeleton {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid var(--im-line);
  background: rgba(255, 255, 255, 0.04);
}

.skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.07), transparent);
  animation: cart-shimmer 1.6s ease-in-out infinite;
}

.skeleton--line {
  display: flex;
  gap: 14px;
  padding: 14px;
}

.skeleton__thumb {
  flex: none;
  width: 72px;
  aspect-ratio: 63 / 88;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
}

.skeleton__bars {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  padding-top: 8px;
}

.skeleton__bars span {
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.07);
}

.skeleton__bars span:nth-child(1) {
  width: 35%;
}

.skeleton__bars span:nth-child(2) {
  width: 80%;
}

.skeleton__bars span:nth-child(3) {
  width: 50%;
}

.skeleton--panel {
  min-height: 260px;
  border-radius: 28px;
}

@media (min-width: 1024px) {
  .skeleton--panel {
    min-height: 460px;
  }
}

@keyframes cart-shimmer {
  to {
    transform: translateX(100%);
  }
}

/* --- Carrello vuoto -------------------------------------------------- */

.cart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 640px;
  margin: 8px auto 24px;
  padding: 48px 24px;
  text-align: center;
  border-radius: 28px;
  border: 1px solid var(--im-line);
  background:
    radial-gradient(80% 120% at 50% 0%, rgba(236, 145, 160, 0.16), transparent 60%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
}

.cart-empty__icon {
  display: inline-grid;
  place-content: center;
  width: 64px;
  height: 64px;
  border-radius: 20px;
  color: #2a0a14;
  background: linear-gradient(135deg, #fde4e8, var(--im-pink-strong));
  box-shadow: 0 14px 36px -10px rgba(236, 145, 160, 0.75);
}

.cart-empty__text {
  max-width: 460px;
  font-family: "Unbounded", "Roboto Flex", sans-serif;
  font-size: clamp(18px, 2.4vw, 24px);
  font-weight: 600;
  line-height: 1.35;
  color: var(--im-ink);
}

.cart-suggested {
  margin-top: 40px;
}

@media (prefers-reduced-motion: reduce) {
  .skeleton::after {
    animation: none;
    opacity: 0;
  }

  .line-info__link {
    transition: none;
  }
}
</style>
