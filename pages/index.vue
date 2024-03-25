<template>
  <div>
    <h1>Elementi della collezione Test</h1>
  </div>
</template>

<script setup lang="ts">
import collection from "../service/firebase.collection";
const result = await collection.readCollection("test");
console.log(result);
</script>
