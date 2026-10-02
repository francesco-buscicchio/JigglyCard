<template>
  <div v-if="hasLabels(languages) || hasLabels(conditions)" class="variant-groups">
    <!-- I v-if evitano blocchi vuoti per i sigillati: la loro condizione è
         una stringa vuota, AtomsTag non mostra nulla e restava l'etichetta
         "Condizione" da sola. -->
    <div v-if="hasLabels(languages)" class="variant-group">
      <p :id="`${groupId}-language`" class="variant-group__label">
        {{ t("catalog.filters.language") }}
      </p>
      <div
        class="variant-group__pills"
        role="group"
        :aria-labelledby="`${groupId}-language`"
      >
        <AtomsTag
          v-for="(tag, index) in languages"
          :key="index"
          :text="tag"
          :code="tag"
          :type="selectedLanguage === tag ? 'active' : 'inactive'"
          @tagClicked="handleClickTag('language', tag)"
        />
      </div>
    </div>

    <div v-if="hasLabels(conditions)" class="variant-group">
      <p :id="`${groupId}-condition`" class="variant-group__label">
        {{ t("catalog.filters.condition") }}
      </p>
      <div
        class="variant-group__pills"
        role="group"
        :aria-labelledby="`${groupId}-condition`"
      >
        <AtomsTag
          v-for="(tag, index) in conditions"
          :key="index"
          :text="tag"
          :code="tag"
          :type="
            selectedCondition === tag
              ? 'active'
              : tagType[tag]
              ? 'inactive'
              : 'disabled'
          "
          @tagClicked="handleClickTag('condition', tag)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Variant } from "~/types/variant.type";

const { t } = useI18n();
// Collega ogni gruppo di pillole alla sua etichetta (lettori di schermo).
const groupId = useId();

const selectedLanguage = ref<string | null>(null);
const selectedCondition = ref<string | null>(null);
const enableLanguage = ref<string[]>([]);
const enableConditions = ref<string[]>([]);

const props = defineProps<{
  variants: Variant[];
}>();

const emit = defineEmits<{
  (event: "variantSelected", id: string): void;
}>();

const languages = computed(() => {
  return getUniqueValuesVariant("language");
});

const conditions = computed(() => {
  return getUniqueValuesVariant("condition");
});

const tagType = computed(() => {
  return getTagType();
});

// Solo per la visualizzazione: un gruppo si mostra se almeno un valore ha
// un'etichetta (AtomsTag non disegna nulla per le stringhe vuote).
const hasLabels = (values: (string | null | undefined)[]) =>
  values.some((value) => Boolean(value?.trim()));

// FUNZIONE CHE CREA TUTTE LE OPZIONI PER OGNI TIPOLOGIA DI VARIANTE
function getUniqueValuesVariant(tag: "condition" | "language") {
  selectableTags();
  if (!props.variants || props.variants.length === 0) return [];

  const variants = props.variants.map((variant: Variant) => variant[tag]);
  return variants.filter((value, index, self) => self.indexOf(value) === index);
}

// FUNZIONE CHE RITORNA SOLO I TAG ATTIVI SELEZIONABILI
function selectableTags() {
  if (!props.variants || props.variants.length === 0) return;

  if (!selectedLanguage.value || !selectedCondition.value) {
    const firstVariant = props.variants[0];
    selectedCondition.value = firstVariant.condition;
    selectedLanguage.value = firstVariant.language;
    emitVariantChange(firstVariant);
  }

  const variantsFilteredByLanguage = props.variants.filter(
    (val) => val.language === selectedLanguage.value
  );
  const variantsFilteredByConditions = props.variants.filter(
    (val) => val.condition === selectedCondition.value
  );

  const distinctLanguage: string[] = [];
  for (let item of [...variantsFilteredByConditions]) {
    if (!distinctLanguage.includes(item.language))
      distinctLanguage.push(item.language);
  }

  const distinctConditions: string[] = [];
  for (let item of [...variantsFilteredByLanguage]) {
    if (!distinctConditions.includes(item.condition))
      distinctConditions.push(item.condition);
  }

  enableConditions.value = distinctConditions;
  enableLanguage.value = distinctLanguage;
}

// Calcola il tipo di tag (active o inactive) per ogni tag
function getTagType() {
  const tagTypes: Record<string, boolean> = {};

  const allVariants = [...languages.value, ...conditions.value];

  allVariants.forEach((tag) => {
    if (!(tag in tagTypes)) {
      tagTypes[tag] = false;
    }
  });

  const allTags = [...enableConditions.value, ...enableLanguage.value];

  allTags.forEach((tag) => {
    tagTypes[tag] = true;
  });

  return tagTypes;
}

// Gestisce il click su un tag
function handleClickTag(tag: "condition" | "language", code: string) {
  // Se è un tag disabilitato, seleziona anche l'altro tag
  if (tag === "condition" && tagType.value[code] === false) {
    // Se il tag selezionato è una condizione disabilitata, seleziona la lingua corrispondente
    selectedCondition.value = code;
    const correspondingLanguage = getCorrespondingLanguage(code);
    selectedLanguage.value = correspondingLanguage;
    // Emmette l'evento al padre quando la selezione cambia
    const variant = props.variants.find(
      (v) => v.language === correspondingLanguage && v.condition === code
    );
    if (variant) emitVariantChange(variant);
  } else if (tag === "language" && tagType.value[code] === false) {
    // Se il tag selezionato è una lingua disabilitata, seleziona la condizione corrispondente
    selectedLanguage.value = code;
    const correspondingCondition = getCorrespondingCondition(code);
    selectedCondition.value = correspondingCondition;
    // Emmette l'evento al padre quando la selezione cambia
    const variant = props.variants.find(
      (v) => v.language === code && v.condition === correspondingCondition
    );
    if (variant) emitVariantChange(variant);
  } else {
    // Se il tag non è disabilitato, solo aggiorna la selezione
    if (tag === "condition") selectedCondition.value = code;
    if (tag === "language") selectedLanguage.value = code;

    // Emmette l'evento al padre per ogni cambiamento
    const variant = props.variants.find(
      (v) =>
        v.language === selectedLanguage.value &&
        v.condition === selectedCondition.value
    );
    if (variant) emitVariantChange(variant);
  }
}

// Emissione dell'evento al padre con l'ID della variante selezionata
function emitVariantChange(variant: Variant) {
  emit("variantSelected", variant.documentId);
}

// Trova la lingua corrispondente per una condizione
function getCorrespondingLanguage(condition: string) {
  const variant = props.variants.find((v) => v.condition === condition);
  return variant ? variant.language : null;
}

// Trova la condizione corrispondente per una lingua
function getCorrespondingCondition(language: string) {
  const variant = props.variants.find((v) => v.language === language);
  return variant ? variant.condition : null;
}
</script>

<style scoped>
.variant-groups {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.variant-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Etichetta in stile "kicker" della home: monospace maiuscolo. */
.variant-group__label {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 12px;
  line-height: 1.4;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--im-muted);
}

.variant-group__pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.variant-group__pills :deep(.variant-tag:focus-visible) {
  outline: 2px solid var(--im-teal);
  outline-offset: 3px;
}

.variant-group__pills :deep(.variant-tag:not(.variant-tag--disabled):hover) {
  transform: translateY(-1px);
}

@media (prefers-reduced-motion: reduce) {
  .variant-group__pills :deep(.variant-tag:not(.variant-tag--disabled):hover) {
    transform: none;
  }
}
</style>
