<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Import Wallet</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-item>
        <ion-label position="floating">Enter mnemonic</ion-label>
        <ion-textarea v-model="mnemonic"></ion-textarea>
      </ion-item>
      <ion-card style="margin-top: 40px">
        <ion-item>Your Name is: {{ name }}</ion-item>
        <ion-item> Your balance is: {{ balance }}</ion-item>
        <ion-item>Your IdentityId is: {{ identityId }}</ion-item>
      </ion-card>
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <ion-button color="primary" @click="recoverWallet()" expand="block"
          >Recover</ion-button
        >
        <ion-button
          color="secondary"
          @click="() => router.push('/redeeminvite')"
          expand="block"
          >Redeem invite</ion-button
        >
        <ion-button
          color="tertiary"
          @click="() => router.push('/home')"
          expand="block"
          >Home</ion-button
        >
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import { onMounted, ref, unref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonLabel,
  IonTextarea,
  IonItem,
  IonCard,
  IonFooter,
} from "@ionic/vue";

import { initClient, getClient, getClientOpts } from "@/lib/DashClient";
import { Client } from "dash/dist/src/SDK/Client/index";

export default {
  name: "CreateWallet",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonButton,
    IonLabel,
    IonTextarea,
    IonItem,
    IonCard,
    IonFooter,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    let client: Client;

    const mnemonic = ref(
      "strike health super useless much garment soon pride rebel club coast motor"
    );

    const balance = ref<number>();

    const identityId = ref<string>();

    const name = ref<string>();

    // onMounted(async () => {});

    const recoverWallet = async (event: any) => {
      console.log("event :>> ", event);
      const clientOpts = getClientOpts(mnemonic.value);

      await initClient(clientOpts);

      client = getClient();
      const account = client.account as any;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      mnemonic.value = client.wallet!.exportWallet().toString();

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      balance.value = client.account!.getTotalBalance();

      [identityId.value] = await account.identities.getIdentityIds();

      if (identityId.value) {
        const [dpnsDoc] = await client.platform?.names.resolveByRecord(
          "dashUniqueIdentityId",
          identityId.value
        );

        name.value = dpnsDoc?.data.label ?? "No Name registered";

        store.commit("setAccountDPNS", dpnsDoc.toJSON());
        store.commit("setDPNS", dpnsDoc);
      } else {
        identityId.value = " No Identity registered.";
      }

      console.log("balance, mnemonic :>> ", unref(balance), unref(mnemonic));
    };

    return { mnemonic, balance, identityId, name, recoverWallet, router };
  },
};
</script>
