<template>
  <HeaderMobile class="w-full lg:hidden" :header="{ cartCount: 9 }" />
  <HeaderDesktop class="hidden w-full lg:block" :header="{ cartCount: 9 }" />
  <iframe
    src="https://koalendar.com/e/valuta-le-tue-carte?embed=true"
    width="100%"
    height="800px"
    frameborder="0"
  ></iframe>
</template>

<script setup lang="ts"></script>
