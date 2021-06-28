<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Save your backup phrase</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-item>
        <ion-label position="floating">Backup phrase</ion-label>
        <ion-textarea readonly auto-grow :value="mnemonic"></ion-textarea>
      </ion-item>
      <ion-item>
        <ion-label>I securely stored my phrase</ion-label>
        <ion-toggle
          @ionChange="backupConfirmed = !backupConfirmed"
          :checked="backupConfirmed"
        >
        </ion-toggle>
      </ion-item>
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <ion-button
          :disabled="!backupConfirmed"
          color="tertiary"
          expand="block"
          router-link="/redeeminvite"
          >Next</ion-button
        >
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import { onMounted, ref } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonItem,
  IonFooter,
  IonLabel,
  IonTextarea,
  IonToggle,
} from "@ionic/vue";

import { getClient } from "@/lib/DashClient";
import { Client } from "dash/dist/src/SDK/Client/index";

// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
  name: "BackupMnemonic",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonTextarea,
    IonPage,
    IonButton,
    IonItem,
    // IonCard,
    IonFooter,
    IonLabel,
    IonToggle,
  },
  setup() {
    console.log(process.env.VUE_APP_DAPIADDRESSES);

    let client: Client;

    const mnemonic = ref("");

    const balance = ref<number>();

    const backupConfirmed = ref(false);

    onMounted(async () => {
      client = getClient();

      mnemonic.value = client.wallet!.exportWallet().toString();

      balance.value = client.account!.getTotalBalance();
    });

    return { mnemonic, balance, backupConfirmed };
  },
};
</script>
