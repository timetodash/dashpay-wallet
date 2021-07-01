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

import {
  initClient,
  getClient,
  getClientOpts,
  disconnectClient,
} from "@/lib/DashClient";
import { Client } from "dash/dist/src/SDK/Client/index";

export default {
  name: "RecoverWallet",
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
      // "access glad stomach deal tray entire mean grunt boy shoot want shrimp"
      "now tourist leopard scorpion inside nation bitter click wide razor say drastic"
      // "cheese below differ village purity elite icon process cricket left shuffle atom"
    );

    const balance = ref<number>();

    const identityId = ref<string>();

    const name = ref<string>();

    // onMounted(async () => {});

    const recoverWallet = async (event: any) => {
      store.commit("resetState");

      console.log("event :>> ", event);
      try {
        await disconnectClient();
      } catch (e) {
        console.log(e);
      }

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
      store.commit("setIsMnemonicBackedUp", true); // User recovered from mnemonic, so it's backed up
      if (!store.getters.myOwnerId || !store.getters.myLabel) {
        router.push("/choosename");
      } else {
        router.push("/choosepassword");
      }
    };

    return { mnemonic, balance, identityId, name, recoverWallet, router };
  },
};
</script>
