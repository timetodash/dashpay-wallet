<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Choose a password</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-item class="ion-margin-top">
        <ion-label position="floating">Choose a password</ion-label>
        <ion-input type="password" v-model="formPassword"></ion-input>
      </ion-item>
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <ion-title>{{ checkMessage }}</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-button expand="block" color="tertiary" @click="checkPassword()"
          >Pick Password</ion-button
        >
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import { ref } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonLabel,
  IonInput,
  IonItem,
  IonFooter,
} from "@ionic/vue";

import { getClient } from "@/lib/DashClient";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import { storeAccount, createAccountId } from "@/lib/helpers/AccountStorage";

export default {
  name: "ChoosePassword",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonFooter,
    IonButton,
    IonLabel,
    IonInput,
    IonItem,
  },
  setup() {
    const client = getClient();

    const router = useRouter();

    const store = useStore();

    const formPassword = ref("");

    const checkMessage = ref("");

    // onMounted(async () => {});

    const checkPassword = async () => {
      console.log("store.state.wishName :>> ", store.state.wishName);
      console.log("formPassword.value :>> ", formPassword.value);

      console.log(
        "client.wallet!.exportWallet() :>> ",
        client.wallet!.exportWallet()
      );

      const encMnemonic = client.account!.encrypt(
        "aes",
        client.wallet?.exportWallet(),
        formPassword.value
      );

      const accountId = createAccountId(
        client.wallet!.exportWallet().toString()
      );

      await storeAccount({
        wishName: store.state.wishName,
        id: accountId,
        encMnemonic,
      });

      checkMessage.value = "Wallet saved on device";

      setTimeout(() => router.push("/backupmnemonic"), 1200);
    };

    return { formPassword, checkPassword, checkMessage };
  },
};
</script>
