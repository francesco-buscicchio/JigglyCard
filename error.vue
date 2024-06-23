<template>
  <div class="error-container">
    <img
      src="~/assets/img/404-image.avif"
      alt="Lost in a fantasy forest"
      class="error-image"
    />
    <h1 class="pt-10">404 - Pagina Non Trovata</h1>
    <p class="text-l">
      Sembra che tu ti sia perso nel bosco delle illusioni... cerca di ritrovare
      la strada!
    </p>
    <nuxt-link to="/" class="home-link">Torna alla Home</nuxt-link>
  </div>
</template>

<style scoped>
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 15px;
}

.error-image {
  max-width: 90%;
  height: auto;
}

.home-link {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #ffcb05; /* Colore giallo per rimanere in tema */
  color: #2a75bb; /* Colore blu per il testo */
  border: none;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
}

@media (min-width: 768px) {
  .error-image {
    max-width: 50%;
  }
}
</style>
