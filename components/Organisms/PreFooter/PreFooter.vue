<template>
  <div class="prefooter">
    <!-- Il pannello newsletter sta nella stessa colonna centrale della home,
         staccato dal footer invece di essere una fascia a tutta larghezza. -->
    <div class="im-container">
      <MoleculesNewsletterPrefooter />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.prefooter {
  padding: 24px 0 64px;
}

@media (min-width: 1024px) {
  .prefooter {
    padding: 32px 0 96px;
  }
}
</style>
