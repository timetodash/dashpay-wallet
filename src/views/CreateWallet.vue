<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Create Wallet</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-item>
        <ion-label position="floating">Your mnemonic</ion-label>
        <ion-textarea readonly auto-grow :value="mnemonic"></ion-textarea>
      </ion-item>
      <ion-card style="margin-top: 40px">
        <ion-item> Your balance is: {{ balance }}</ion-item>
      </ion-card>
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <ion-button color="primary" expand="block" router-link="/redeeminvite"
          >Redeem Invite</ion-button
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
  IonCard,
  IonFooter,
  IonLabel,
  IonTextarea,
} from "@ionic/vue";

import { initClient, getClient, getClientOpts } from "@/lib/DashClient";
import { Client } from "dash/dist/src/SDK/Client/index";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
  name: "CreateWallet",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonTextarea,
    IonPage,
    IonButton,
    IonItem,
    IonCard,
    IonFooter,
    IonLabel,
  },
  setup() {
    console.log(process.env.VUE_APP_DAPIADDRESSES);
    const clientOpts = getClientOpts(null);

    let client: Client;

    const mnemonic = ref("");

    const balance = ref<number>();

    onMounted(async () => {
      await sleep(450); // Don't block the viewport
      await initClient(clientOpts);

      client = getClient();

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      mnemonic.value = client.wallet!.exportWallet().toString();

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      balance.value = client.account!.getTotalBalance();
    });

    return { mnemonic, balance };
  },
};
</script>
