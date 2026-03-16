<template>
  <div class="mx-5 py-4">
    <h5>{{ t("cart.shipping.heading") }}</h5>

    <div class="my-4">
      <div v-if="shippingOptions.length > 0">
        <div
          v-for="option in shippingOptions"
          :key="option.id"
          class="py-1"
        >
          <AtomsRadioButton
            :id="option.id"
            :value="option"
            :selectedValue="selectedOption?.id"
            name="shippingMethod"
            @update:modelValue="updateSelectedOption"
          >
            <template #label>
              <span class="ml-2 text-base">
                {{ option.label }}: {{ option.price }}€
              </span>
            </template>
          </AtomsRadioButton>
        </div>
      </div>
      <p class="text-xs py-3">
        {{ t("cart.shipping.note") }}
      </p>
    </div>

    <div class="border-t-[2px] border-neutral-200 py-4">
      <div class="flex justify-between" v-if="couponData.value > 0">
        <p>{{ t("cart.shipping.couponLabel") }}: {{ couponData.name }}</p>
        <p>-{{ couponData.value }} €</p>
      </div>
      <div v-if="couponData.value > 0">
        <AtomsButtonCTA
          type="underline-text"
          :text="t('cart.shipping.removeCoupon')"
          @click="removeCoupon"
        />
      </div>
      <div class="flex justify-between">
        <p class="">{{ t("cart.shipping.total") }}</p>
        <p class="price-tag">{{ total }} €</p>
      </div>
    </div>
    <!-- Codice promo -->
    <div class="mb-12">
      <p class="mb-2">{{ t("cart.shipping.couponQuestion") }}</p>
      <div class="lg:flex w-full lg:gap-3 lg:items-top lg:justify-center">
        <div class="mb-2 lg:mb-0 flex-1">
          <MoleculesContainerInput
            :status="couponData.error === '' ? 'newsletter' : 'error'"
            :placeholder="placeholder"
            @inputUpdate="updateCouponCode($event)"
            :notValidMessage="couponData.error"
            :isValid="couponData.error === ''"
          />
        </div>
        <div class="lg:max-w-22">
          <AtomsButtonCTA
            type="secondary"
            :text="codeApply"
            @click="applyCoupon()"
          />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-y-4">
      <AtomsButtonCTA
        type="primary"
        :text="t('cart.shipping.buyCta')"
        @button-clicked="goTo(PATH.CHECKOUT)"
      />
      <AtomsButtonCTA
        type="underline-text"
        :text="t('cart.shipping.back')"
        @button-clicked="goBack"
      />
    </div>

    <div class="my-16">
      <MoleculesTextViewer>
        <template v-slot:title>
          {{ t("cart.help.title") }}
        </template>
        <template v-slot:content>
          <!-- TODO mettere descrizione corretta -->
          {{ t("product.messages.defaultDescription") }}
        </template>
      </MoleculesTextViewer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { goBack } from "@/utils/navigationUtils";
import { PATH } from "~/data/const";
import { goTo } from "@/utils/navigationUtils";
import { ShippingMethodStrapiService } from "~/service/Strapi/ShippingMethodService";
const { t } = useI18n();
import { type CartItem } from "~/service/CartService";

type ShippingOption = {
  id: string;
  label: string;
  price: number;
};

type NormalizedShippingMethod = {
  id: string;
  name: string;
  price: number;
  maxWeight: number;
  maxValue: number;
  international: boolean;
};

const props = defineProps<{
  products: CartItem[];
  totalCart: number | string;
  couponData: any;
  isInternational?: boolean;
}>();

const emit = defineEmits(["couponApplied", "removeCoupon"]);
const isDesktopView = isDesktop();
const runtimeConfig = useRuntimeConfig();
const couponCode = ref("");
const shippingMethods = ref<any[]>([]);
const selectedOption = ref<ShippingOption | null>(null);

const cartValue = computed(() => Number(props.totalCart) || 0);
const cartWeight = computed(() => {
  return (props.products || []).reduce((total, item) => {
    const weight = Number((item as any).weight ?? (item as any).productWeight);
    if (!Number.isFinite(weight)) return total;
    return total + weight * Number(item.selectedQuantity || 0);
  }, 0);
});

const isInternational = computed(() => Boolean(props.isInternational));

function parseNumber(value: any) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function parseBoolean(value: any) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return Boolean(value);
}

function normalizeShippingMethod(raw: any): NormalizedShippingMethod {
  const name = raw.name ?? raw.Name ?? "Spedizione";
  const price = parseNumber(raw.price ?? raw.Price ?? 0);
  const maxWeight = parseNumber(
    raw.max_weight ?? raw.Max_Weight ?? raw.maxWeight ?? 0
  );
  const maxValue = parseNumber(
    raw.max_value ?? raw.Max_Value ?? raw.maxValue ?? 0
  );
  const international = parseBoolean(
    raw.international ?? raw.International ?? false
  );
  const id = String(raw.documentId ?? raw.id ?? `${name}-${price}`);
  return {
    id,
    name,
    price,
    maxWeight,
    maxValue,
    international,
  };
}

const shippingOptions = computed(() => {
  const normalized = shippingMethods.value.map(normalizeShippingMethod);
  const eligible = normalized.filter((method) => {
    if (method.international !== isInternational.value) return false;
    if (method.maxValue > 0 && cartValue.value > method.maxValue) return false;
    if (method.maxWeight > 0 && cartWeight.value > method.maxWeight)
      return false;
    return true;
  });

  const byName = new Map<string, ShippingOption>();
  eligible.forEach((method) => {
    const existing = byName.get(method.name);
    if (!existing || method.price < existing.price) {
      byName.set(method.name, {
        id: method.id,
        label: method.name,
        price: method.price,
      });
    }
  });

  return Array.from(byName.values()).sort((a, b) => a.price - b.price);
});

watch(
  shippingOptions,
  (options) => {
    if (!options.length) {
      selectedOption.value = null;
      return;
    }
    if (!selectedOption.value) {
      selectedOption.value = options[0];
      return;
    }
    const exists = options.some((opt) => opt.id === selectedOption.value?.id);
    if (!exists) selectedOption.value = options[0];
  },
  { immediate: true }
);

const updateCouponCode = (event: string) => {
  couponCode.value = event;
};

const total = computed(() => {
  return (Number(props.totalCart) - Number(props.couponData.value)).toFixed(2);
});

const applyCoupon = () => {
  emit("couponApplied", couponCode.value);
};

const removeCoupon = () => {
  emit("removeCoupon");
};

const placeholder = computed(() => {
  return isDesktopView.value ? "XXXX" : t("cart.shipping.couponPlaceholder");
});
const codeApply = computed(() => {
  return isDesktopView.value
    ? t("cart.shipping.applyDesktop")
    : t("cart.shipping.apply");
});

function updateSelectedOption(option: ShippingOption) {
  selectedOption.value = option;
}

async function loadShippingMethods() {
  try {
    const service = new ShippingMethodStrapiService(
      runtimeConfig.public.STRAPI_BASE_URL,
      runtimeConfig.public.FULL_ACCESS_TOKEN
    );
    shippingMethods.value = await service.getAllShippingMethods();
  } catch (_) {
    shippingMethods.value = [];
  }
}

onMounted(loadShippingMethods);
</script>
