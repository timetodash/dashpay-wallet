<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <legacy-header></legacy-header>
      </ion-toolbar>
    </ion-header>

    <ion-content><legacy-payment-items></legacy-payment-items> </ion-content>

    <ion-footer class="ion-no-border"
      ><ion-toolbar> <legacy-footer></legacy-footer> </ion-toolbar
    ></ion-footer>
  </ion-page>
</template>

<script>
import {
  IonToolbar,
  IonHeader,
  IonContent,
  IonPage,
  IonFooter,
} from "@ionic/vue";

import LegacyHeader from "@/components/Chat/LegacyPayments/LegacyHeader.vue";
import LegacyFooter from "@/components/Chat/LegacyPayments/LegacyFooter.vue";
import LegacyPaymentItems from "@/components/Chat/LegacyPayments/LegacyPaymentItems.vue";

export default {
  name: "ChatLegacyPayment",
  components: {
    IonToolbar,
    IonHeader,
    IonPage,
    IonContent,
    IonFooter,
    LegacyHeader,
    LegacyFooter,
    LegacyPaymentItems,
  },
};
</script>
