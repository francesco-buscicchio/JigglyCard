<template>
  <div class="gap-2 bg-accent-500 pb-8 text-accent-50 footer-fixed">
    <div class="grid md:grid-cols-4 mb-4">
      <div v-for="(section, sectionIndex) in sections" :key="'section-' + sectionIndex" class="w-full md:w-auto"
        :style="{ fontSize: sectionFontSize }">
        <!-- Sezioni del footer -->
        <Accordion>
          <template #header>
            <p>{{ section.title }}</p>
          </template>
          <div v-if="Array.isArray(section.sections)">
            <div v-for="(item, index) in section.sections" :key="index">
              <p v-if="typeof item === 'object'">
                <a :href="item.link">{{ item.value }}</a>
              </p>
              <p v-else>{{ item }}</p>
            </div>
          </div>
          <div v-else>
            <p>{{ section.sections }}</p>
          </div>
        </Accordion>
      </div>
    </div>

    <div>
      <!-- sezione dei pagamenti -->
      <p class="whitespace-normal break-words px-6">pagamenti con</p>
      <div class="grid grid-cols-4 mb-4 px-4">
        <div v-for="(payment, index) in paymentMethods" :key="index" class="payment-icon">
          <a :href="payment.link" @click="iconSocialPressed(payment.link)">
            <img :src="payment.src" :alt="payment.alt" class="payment-icon-img" />
          </a>
        </div>
      </div>
    </div>

    <div class="bg-mediumPink flex flex-col items-center py-2 pb-4">
      <!-- Immagini social del footer -->
      <div class="flex flex-row items-center">
        <template v-if="Array.isArray(footer.imgs)">
          <div class="py-2 mx-3 cursor-pointer" v-for="(img, index) in footer.imgs" :key="index"
            @click="iconSocialPressed(img.url)">
            <img :src="img.img" alt="Logo" class="max-h-6" />
          </div>
        </template>
        <template v-else>
          <div class="max-h-6 cursor-pointer" @click="iconSocialPressed(footer.imgs?.url ?? '')">
            <img v-if="footer.imgs" :src="footer.imgs.img" alt="Logo" />
          </div>
        </template>
      </div>
    </div>
    <div>
      <!-- inserisco 12px come grandezza testo come da mock, da valutare  -->
      <p class="px-6 text-xs">
        <a href="/privacy-policy">privacy</a> -
        <a href="/cookies">cookies</a> -
        <a href="/terms-of-use">termini di utilizzo</a>
      </p>
    </div>
  </div>
</template>



<script setup lang="ts">
import { ref } from 'vue';
import Accordion from '../components/Molecules/Accordion/Accordion.vue';

type SocialLinksType = {
  img: string;
  url: string;
};

type PaymentMethodType = {
  src: string;
  alt: string;
  link: string;
};

const iconSocialPressed = (url: string) => {
  navigateTo(url, {
    external: true,
    open: {
      target: "_blank",
    },
  });
};

const props = defineProps({
  sections: {
    type: Array as PropType<
      Array<{
        title: string;
        sections: Array<string | { value: string; link: string }>;
      }>
    >,
    default: () => [],
  },
  footer: {
    type: Object as PropType<{
      imgs?: SocialLinksType | SocialLinksType[];
    }>,
    default: () => ({ text: "", imgs: [] }),
  },
});

const sectionFontSize = "16px";

const paymentMethods = ref<PaymentMethodType[]>([
  { src: 'https://via.placeholder.com/100x50?text=Pay1', alt: 'Pay Method 1', link: '#' },
  { src: 'https://via.placeholder.com/100x50?text=Pay2', alt: 'Pay Method 2', link: '#' },
  { src: 'https://via.placeholder.com/100x50?text=Pay3', alt: 'Pay Method 3', link: '#' },
  { src: 'https://via.placeholder.com/100x50?text=Pay4', alt: 'Pay Method 4', link: '#' }
]);
</script>

<style scoped>
@media (max-width: 767px) {
  .mobile-section-content {
    display: block;
  }

  .payment-icon {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .payment-icon-img {
    margin-top: 8px;
    width: 73px;
    height: 40px;
  }
}
</style>
