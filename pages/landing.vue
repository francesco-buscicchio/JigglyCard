<template>
  <div
    class="flex flex-col gap-y-6 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50"
  >
    <div class="mx-[4vw] mt-7">
      <!-- Hero section with welcome message -->
      <div class="text-center mb-12 animate-fade-in">
        <h1
          class="text-4xl md:text-6xl font-bold text-gray-800 mb-4 animate-slide-up"
        >
          Benvenuto su Jigglycard
        </h1>
        <p
          class="text-xl text-gray-600 max-w-2xl mx-auto animate-slide-up-delay"
        >
          Scopri il mondo delle carte Pokémon con noi. Compra, vendi e scambia
          le tue collezioni preferite!
        </p>
      </div>
    </div>

    <div class="mx-[4vw] mt-6">
      <!-- Action cards grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Cardmarket Card -->
        <div
          class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden animate-slide-up-delay-1"
        >
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
            <Icon
              name="heroicons:shopping-bag"
              size="48"
              class="text-white mb-4 animate-bounce-subtle"
            />
            <h3 class="text-2xl font-bold text-white mb-2">Cardmarket</h3>
            <p class="text-blue-100">
              Scopri la nostra collezione su Cardmarket
            </p>
          </div>
          <div class="p-6">
            <a
              href="https://www.cardmarket.com/it/Pokemon/Users/Jigglycard"
              target="_blank"
              class="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 hover:animate-pulse"
            >
              Visita Cardmarket
              <Icon name="heroicons:arrow-right" size="20" />
            </a>
          </div>
        </div>

        <!-- Cardtrader Card -->
        <div
          class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden animate-slide-up-delay-2"
        >
          <div class="bg-gradient-to-r from-green-500 to-green-600 p-6">
            <Icon
              name="heroicons:currency-dollar"
              size="48"
              class="text-white mb-4 animate-bounce-subtle"
            />
            <h3 class="text-2xl font-bold text-white mb-2">Cardtrader</h3>
            <p class="text-green-100">
              Esplora i nostri prodotti su Cardtrader
            </p>
          </div>
          <div class="p-6">
            <a
              href="https://www.cardtrader.com/it/users/jigglycard"
              target="_blank"
              class="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 hover:animate-pulse"
            >
              Visita Cardtrader
              <Icon name="heroicons:arrow-right" size="20" />
            </a>
          </div>
        </div>

        <!-- Sell Collection Card -->
        <div
          class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden animate-slide-up-delay-3"
        >
          <div class="bg-gradient-to-r from-red-500 to-red-600 p-6">
            <Icon
              name="heroicons:document-text"
              size="48"
              class="text-white mb-4 animate-bounce-subtle"
            />
            <h3 class="text-2xl font-bold text-white mb-2">
              Regolamento vendita collezione
            </h3>
            <p class="text-red-100">
              Leggi le condizioni per vendere le tue carte Pokémon
            </p>
          </div>
          <div class="p-6">
            <NuxtLink
              to="/regolamento-vendita-collezione"
              class="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 hover:animate-pulse"
            >
              Leggi regolamento
              <Icon name="heroicons:arrow-right" size="20" />
            </NuxtLink>
          </div>
        </div>

        <!-- Appointment Card -->
        <div
          class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden animate-slide-up-delay-4"
        >
          <div class="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
            <Icon
              name="heroicons:calendar-days"
              size="48"
              class="text-white mb-4 animate-bounce-subtle"
            />
            <h3 class="text-2xl font-bold text-white mb-2">
              Valuta la tua collezione
            </h3>
            <p class="text-purple-100">
              Prenota un appuntamento con i nostri esperti
            </p>
          </div>
          <div class="p-6">
            <NuxtLink
              to="/valuta-la-tua-collezione"
              class="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 hover:animate-pulse"
            >
              Prenota appuntamento
              <Icon name="heroicons:arrow-right" size="20" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce-subtle {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}

.animate-slide-up {
  animation: slide-up 1s ease-out;
}

.animate-slide-up-delay {
  animation: slide-up 1s ease-out 0.3s both;
}

.animate-slide-up-delay-1 {
  animation: slide-up 1s ease-out 0.6s both;
}

.animate-slide-up-delay-2 {
  animation: slide-up 1s ease-out 0.8s both;
}

.animate-slide-up-delay-3 {
  animation: slide-up 1s ease-out 1s both;
}

.animate-slide-up-delay-4 {
  animation: slide-up 1s ease-out 1.2s both;
}

.animate-bounce-subtle {
  animation: bounce-subtle 2s infinite;
}
</style>
