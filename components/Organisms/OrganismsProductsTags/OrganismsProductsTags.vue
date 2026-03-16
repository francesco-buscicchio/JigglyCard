<template>
  <div>
    <div>
      <p class="mb-4 lg:mb-2">
        {{ t("catalog.filters.language") }}:
      </p>
      <div class="flex gap-3 flex-wrap">
        <div
          v-if="languages.length"
          v-for="(tag, index) in languages"
          :key="index"
        >
          <AtomsTag
            :text="tag"
            :code="tag"
            :type="selectedLanguage === tag ? 'active' : 'inactive'"
            @tagClicked="handleClickTag('language', tag)"
          />
        </div>
      </div>
    </div>

    <div>
      <p class="mb-4 lg:mb-2">
        {{ t("catalog.filters.condition") }}:
      </p>
      <div class="flex gap-3 flex-wrap">
        <div
          v-if="conditions.length"
          v-for="(tag, index) in conditions"
          :key="index"
        >
          <AtomsTag
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
  </div>
</template>

<script setup lang="ts">
import type { Variant } from "~/types/variant.type";

const { t } = useI18n();

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
