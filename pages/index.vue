<template>
  <div>
    <h1>Elementi della collezione Test</h1>
  </div>
</template>

<script setup lang="ts">
import FirebaseCollection from "../service/firebase.collection";
const fbcol = new FirebaseCollection();
const result = await fbcol.readCollection("test");
console.log(result);
</script>
