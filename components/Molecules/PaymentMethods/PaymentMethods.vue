<template>
    <div>
        <p class="px-6 lg:text-center">{{ $t('payments.terms') }}</p>
        <div class="flex justify-center w-full">
            <div class="flex m-4 px-4 gap-5">
                <div v-for="(payment, index) in paymentMethods" :key="index" class="flex justify-center items-center">
                    <a :href="payment.link" @click="iconSocialPressed(payment.link)">
                        <img :src="payment.src" :alt="payment.alt" class="mt-2 w-18 h-10 object-cover" />
                    </a>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import paypal from "../../../assets/img/paypal.png";

type PaymentMethodType = {
    src: string;
    alt: string;
    link: string;
};

const paymentMethods: PaymentMethodType[] = [
    {
        src: paypal,
        alt: "paypal",
        link: "#",
    },
    // {
    //     src: "https://via.placeholder.com/100x50?text=Pay2",
    //     alt: "Pay Method 2",
    //     link: "#",
    // },
    // {
    //     src: "https://via.placeholder.com/100x50?text=Pay3",
    //     alt: "Pay Method 3",
    //     link: "#",
    // },
    // {
    //     src: "https://via.placeholder.com/100x50?text=Pay4",
    //     alt: "Pay Method 4",
    //     link: "#",
    // },
];

const iconSocialPressed = (url: string) => {
    navigateTo(url, {
        external: true,
        open: {
            target: "_blank",
        },
    });
};
</script>