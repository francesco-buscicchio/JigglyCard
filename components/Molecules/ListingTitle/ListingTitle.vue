<template>
  <h1 class="text-accent-500 text-center">{{ $t(title).split(" - ")[0] }}</h1>
  <h5 class="text-accent-500 text-center pt-2" v-if="$t(title).split(' - ')[1]">
    {{ $t(title).split(" - ")[1].toLocaleUpperCase() }}
    {{ $t(title).split(" - ")[1].toLocaleLowerCase() }}
  </h5>
</template>

<script setup lang="ts">
defineProps({
  title: String,
});
</script>
