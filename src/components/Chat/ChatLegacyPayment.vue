<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        Legacy Payments</ion-toolbar
      >
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list>
        <ion-card>
          <ion-item v-for="(transaction, idx) in transactionHistory" :key="idx">
            {{ transactionDisplay(transaction) }}
          </ion-item>
        </ion-card>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonList,
  IonCard,
  IonItem,
  IonToolbar,
  IonHeader,
  IonContent,
  IonPage,
  IonButtons,
  IonBackButton,
} from "@ionic/vue";

import useWallet from "@/composables/wallet";

import { useStore } from "vuex";

export default {
  name: "ChatLegacyPayment",
  components: {
    IonItem,
    IonToolbar,
    IonHeader,
    IonPage,
    IonList,
    IonContent,
    IonCard,
    IonButtons,
    IonBackButton,
  },
  setup() {
    const store = useStore();

    const { transactionDisplay, transactionHistory, balance } = useWallet();

    // startRefreshWalletDataLoop();
    console.log("balance.value :>> ", balance.value);
    console.log("transactionHistory.value :>> ", transactionHistory.value);
    return {
      transactionHistory,
      transactionDisplay,
    };
  },
};
</script>

<style></style>
