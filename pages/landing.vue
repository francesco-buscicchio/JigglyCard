<template>
  <div class="landing">
    <!-- Hero section with welcome message -->
    <header class="im-container landing__hero">
      <div class="landing__ball landing__enter" aria-hidden="true">
        <span class="landing__halo"></span>
        <img :src="logo" alt="" />
      </div>
      <p class="im-eyebrow landing__enter" style="--d: 0.1s">
        <span class="landing__pulse" aria-hidden="true"></span>
        Carte Pokémon
      </p>
      <h1 class="im-display landing__title landing__enter" style="--d: 0.18s">
        Benvenuto su
        <span class="im-gradient-text">Jigglycard</span>
      </h1>
      <p class="im-lead landing__lead landing__enter" style="--d: 0.26s">
        Scopri il mondo delle carte Pokémon con noi. Compra, vendi e scambia
        le tue collezioni preferite!
      </p>
    </header>

    <!-- Action cards grid -->
    <div class="im-container">
      <div class="landing__grid">
        <!-- Cardmarket Card -->
        <a
          href="https://www.cardmarket.com/it/Pokemon/Users/Jigglycard"
          target="_blank"
          rel="noopener"
          class="landing__card landing__enter"
          style="--tone: 92, 200, 224; --d: 0.34s"
        >
          <span class="landing__icon" aria-hidden="true">
            <Icon name="heroicons:shopping-bag-20-solid" size="24" />
          </span>
          <h2 class="landing__card-title">Cardmarket</h2>
          <p class="landing__card-text">
            Scopri la nostra collezione su Cardmarket
          </p>
          <span class="landing__cta">
            Visita Cardmarket
            <Icon name="heroicons:arrow-up-right-20-solid" size="18" />
          </span>
        </a>

        <!-- Cardtrader Card -->
        <a
          href="https://www.cardtrader.com/it/users/jigglycard"
          target="_blank"
          rel="noopener"
          class="landing__card landing__enter"
          style="--tone: 167, 139, 250; --d: 0.42s"
        >
          <span class="landing__icon" aria-hidden="true">
            <Icon name="heroicons:currency-euro-20-solid" size="24" />
          </span>
          <h2 class="landing__card-title">Cardtrader</h2>
          <p class="landing__card-text">
            Esplora i nostri prodotti su Cardtrader
          </p>
          <span class="landing__cta">
            Visita Cardtrader
            <Icon name="heroicons:arrow-up-right-20-solid" size="18" />
          </span>
        </a>

        <!-- Sell Collection Card -->
        <NuxtLink
          to="/regolamento-vendita-collezione"
          class="landing__card landing__enter"
          style="--tone: 236, 145, 160; --d: 0.5s"
        >
          <span class="landing__icon" aria-hidden="true">
            <Icon name="heroicons:document-text-20-solid" size="24" />
          </span>
          <h2 class="landing__card-title">Regolamento vendita collezione</h2>
          <p class="landing__card-text">
            Leggi le condizioni per vendere le tue carte Pokémon
          </p>
          <span class="landing__cta">
            Leggi regolamento
            <Icon name="heroicons:arrow-right-20-solid" size="18" />
          </span>
        </NuxtLink>

        <!-- Appointment Card -->
        <NuxtLink
          to="/valuta-la-tua-collezione"
          class="landing__card landing__enter"
          style="--tone: 255, 210, 122; --d: 0.58s"
        >
          <span class="landing__icon" aria-hidden="true">
            <Icon name="heroicons:calendar-days-20-solid" size="24" />
          </span>
          <h2 class="landing__card-title">Valuta la tua collezione</h2>
          <p class="landing__card-text">
            Prenota un appuntamento con i nostri esperti
          </p>
          <span class="landing__cta">
            Prenota appuntamento
            <Icon name="heroicons:arrow-right-20-solid" size="18" />
          </span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import logo from "~/assets/logo/logo_new.png";

useHead({
  title: "Jigglycard",
  meta: [
    {
      name: "Jigglycard",
      content:
        "Entra nel magico mondo Pokemon, carte singole, prodotti sealed, permuta collezioni...",
    },
  ],
});
</script>

<style scoped>
.landing {
  min-height: 100vh;
  padding-bottom: 96px;
}

/* ---------- Testata ---------- */
.landing__hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 48px;
  padding-bottom: 40px;
  text-align: center;
}

@media (min-width: 1024px) {
  .landing__hero {
    padding-top: 72px;
    padding-bottom: 56px;
  }
}

.landing__ball {
  position: relative;
  width: 104px;
  height: 104px;
  margin-bottom: 22px;
}

.landing__ball img {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 18px 30px rgba(0, 0, 0, 0.45));
  animation: landing-float 4s ease-in-out infinite;
}

.landing__halo {
  position: absolute;
  inset: -40%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(236, 145, 160, 0.35), transparent 65%);
  filter: blur(6px);
}

.landing__pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--im-pink-strong);
  box-shadow: 0 0 0 4px rgba(236, 145, 160, 0.18);
}

.landing__title {
  margin-top: 14px;
  font-size: clamp(34px, 6.4vw, 76px);
  line-height: 1.02;
  overflow-wrap: break-word;
}

.landing__title span {
  font-family: inherit;
}

.landing__lead {
  max-width: 56ch;
  margin-top: 18px;
}

/* ---------- Schede ---------- */
.landing__grid {
  display: grid;
  gap: 16px;
}

@media (min-width: 768px) {
  .landing__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }
}

/* Scheda di vetro con un alone nel colore della destinazione (`--tone`),
   al posto delle vecchie testate a tinta piena. */
.landing__card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: hidden;
  padding: 26px 22px;
  border-radius: 28px;
  border: 1px solid var(--im-line);
  background:
    radial-gradient(70% 90% at 100% 0%, rgba(var(--tone), 0.2), transparent 65%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
  color: var(--im-ink);
  transition:
    transform 0.3s cubic-bezier(0.2, 0.7, 0.2, 1),
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

@media (min-width: 1024px) {
  .landing__card {
    padding: 34px 32px;
  }
}

.landing__card,
.landing__card * {
  cursor: pointer;
}

.landing__card:hover {
  transform: translateY(-4px);
  border-color: rgba(var(--tone), 0.55);
  box-shadow: 0 30px 60px -30px rgba(var(--tone), 0.55);
}

.landing__card:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 3px;
}

.landing__icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  margin-bottom: 8px;
  border-radius: 16px;
  color: #12102e;
  background: linear-gradient(135deg, #ffffff, rgb(var(--tone)));
  box-shadow: 0 14px 30px -12px rgba(var(--tone), 0.8);
}

.landing__card-title {
  font-size: 22px;
  line-height: 1.2;
  color: var(--im-ink);
}

.landing__card-text {
  flex: 1;
  color: var(--im-muted);
}

.landing__cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  margin-top: 10px;
  padding: 10px 18px;
  border-radius: 999px;
  border: 1px solid rgba(var(--tone), 0.45);
  background: rgba(var(--tone), 0.1);
  font-size: 15px;
  font-weight: 700;
  color: rgb(var(--tone));
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.landing__card:hover .landing__cta {
  background: rgb(var(--tone));
  color: #12102e;
}

/* Entrata in cascata della testata e delle schede. Solo `backwards`: con
   `both` il fotogramma finale resterebbe applicato e bloccherebbe il
   sollevamento delle schede al passaggio del mouse. */
.landing__enter {
  animation: landing-up 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) backwards;
  animation-delay: var(--d, 0s);
}

@keyframes landing-up {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes landing-float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-8px) rotate(-5deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .landing__enter,
  .landing__ball img {
    animation: none;
  }

  .landing__card,
  .landing__cta {
    transition: none;
  }

  .landing__card:hover {
    transform: none;
  }
}
</style>
