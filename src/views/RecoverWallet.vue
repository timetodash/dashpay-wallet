<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="ion-no-border">
        <ion-buttons slot="start"
          ><ion-back-button
            style="color: #6c69fc"
            :icon="arrowBack"
          ></ion-back-button
        ></ion-buttons>
        <ion-title class="title">Add an existing wallet</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <MnemonicForm @mnemonicEntered="recoverWallet"></MnemonicForm>
      <ion-loading :is-open="isWalletLoading" message="Loading Wallet...">
      </ion-loading>
    </ion-content>
    <!-- <ion-footer class="ion-no-border">
      <ion-toolbar>
        <ion-button color="tertiary" @click="recoverWallet()" expand="block"
          >Next</ion-button
        >
      </ion-toolbar>
    </ion-footer> -->
  </ion-page>
</template>

<script lang="ts">
import { onMounted, ref, unref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import MnemonicForm from "@/components/MnemonicForm.vue";

import {
  IonLoading,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
} from "@ionic/vue";

import {
  initClient,
  getClient,
  getClientOpts,
  disconnectClient,
} from "@/lib/DashClient";

import { arrowBack } from "ionicons/icons";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
  name: "RecoverWallet",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonBackButton,
    IonButtons,
    IonLoading,
    MnemonicForm,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const isWalletLoading = ref(false);

    const balance = ref<number>();

    const identityId = ref<string>();

    const recoverWallet = async (event: any) => {
      isWalletLoading.value = true;

      store.commit("resetState");

      await sleep(150); // Don't block the viewport

      try {
        await disconnectClient();
      } catch (e) {
        console.log(e);
      }

      const clientOpts = getClientOpts(event);

      await initClient(clientOpts);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      // mnemonic.value = client.wallet!.exportWallet().toString();

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      balance.value = getClient().account!.getTotalBalance();

      [identityId.value] = (
        (await getClient().account) as any
      ).identities.getIdentityIds();

      if (identityId.value) {
        const [dpnsDoc] = await getClient().platform?.names.resolveByRecord(
          "dashUniqueIdentityId",
          identityId.value
        );

        store.commit("setAccountDPNS", dpnsDoc.toJSON());
        store.commit("setDPNS", dpnsDoc);
      }

      store.commit("setIsMnemonicBackedUp", true); // User recovered from mnemonic, so it's backed up

      if (!store.getters.myOwnerId || !store.getters.myLabel) {
        router.push("/choosename");
      } else {
        router.push("/choosepassword");
      }
      isWalletLoading.value = false;
    };

    return {
      recoverWallet,
      router,
      isWalletLoading,
      arrowBack,
    };
  },
};
</script>
