<template>
  <a
    href="https://www.iubenda.com/privacy-policy/94013012"
    class="text-blue-400 hover:text-blue-600"
    title="Privacy Policy"
    target="_blank"
  >
  </a>
</template>

<script setup>
import { ref, onMounted } from "vue";

onMounted(() => {
  const hasAcceptedCookies = localStorage.getItem(
    "_iub_previous_preference_id"
  );

  if (hasAcceptedCookies) {
    return;
  }

  // Aggiungi il primo script di configurazione Iubenda
  const iubConfigScript = document.createElement("script");
  iubConfigScript.type = "text/javascript";
  iubConfigScript.innerHTML = `
    var _iub = _iub || [];
    _iub.csConfiguration = {"siteId":4175415,"cookiePolicyId":94013012,"lang":"it","storage":{"type":"local_storage","useSiteId":true}};
  `;
  document.head.appendChild(iubConfigScript);

  // Carica il secondo script di Iubenda
  const iubScript1 = document.createElement("script");
  iubScript1.type = "text/javascript";
  iubScript1.src = "https://cs.iubenda.com/autoblocking/4175415.js";
  document.body.appendChild(iubScript1);

  // Carica il terzo script di Iubenda
  const iubScript2 = document.createElement("script");
  iubScript2.type = "text/javascript";
  iubScript2.src = "//cdn.iubenda.com/cs/iubenda_cs.js";
  iubScript2.charset = "UTF-8";
  iubScript2.async = true;
  document.body.appendChild(iubScript2);
});
</script>
