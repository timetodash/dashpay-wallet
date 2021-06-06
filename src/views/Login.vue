<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <AccountList v-if="!selectedAccount" @selectAccount="selectAccount" />
      <PasswordPrompt v-model="password" :account="selectedAccount" v-else />
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar v-if="selectedAccount">
        <ion-button color="primary" @click="decryptMnemonic()" expand="block"
          >Login</ion-button
        >
        <ion-button
          color="secondary"
          @click="selectAccount(null)"
          expand="block"
          fill="outline"
          >Cancel</ion-button
        >
      </ion-toolbar>
      <ion-toolbar v-else>
        <ion-button color="primary" router-link="/choosename" expand="block"
          >Sign Up</ion-button
        >
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import AccountList from "@/components/login/AccountList.vue";
import PasswordPrompt from "@/components/login/PasswordPrompt.vue";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonFooter,
} from "@ionic/vue";

import { getClientOpts, initClient } from "@/lib/DashClient";

import { Client } from "dash/dist/src/SDK/Client/index";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const decrypt = require("@dashevo/wallet-lib/src/types/Account/methods/decrypt");

export default {
  name: "CreateWallet",
  components: {
    AccountList,
    PasswordPrompt,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonButton,
    IonFooter,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    let client: Client;

    const password = ref("");

    const recoverWallet = async (mnemonic: string) => {
      console.log("recover wallet");

      const clientOpts = getClientOpts(mnemonic);
      client = await initClient(clientOpts);

      const account = client.account as any;

      const balance = client.account!.getTotalBalance();

      console.log("balance :>> ", balance);
      console.log(
        "client.wallet.exportWallet() :>> ",
        client.wallet?.exportWallet()
      );

      const [identityId] = await account.identities.getIdentityIds();

      console.log("identityId :>> ", identityId);

      if (identityId) {
        const [dpnsDoc] = await client.platform?.names.resolveByRecord(
          "dashUniqueIdentityId",
          identityId
        );

        console.log("dpnsDoc :>> ", dpnsDoc?.toJSON());

        if (dpnsDoc) {
          store.commit("setAccountDPNS", dpnsDoc.toJSON());
          router.push("/home");
        } else {
          router.push("/finishregistration");
        }
      } else {
        if (balance > 0) {
          router.push("/finishregistration");
        } else {
          router.push("/redeeminvite");
        }
      }

      // console.log("balance, mnemonic :>> ", unref(balance), unref(mnemonic));

      // NEXT finish sign up or go to home
      // router.push("/home");
    };

    const accounts = ref([]);
    // onMounted(async () => {});

    const selectedAccount = ref();

    function selectAccount(account: any) {
      console.log("selectAccountFired");
      selectedAccount.value = account;
      console.log("selectedAccount.value :>> ", selectedAccount.value);
      store.commit("setWishName", account.wishName);
    }

    const decryptMnemonic = function() {
      console.log("password", password.value);
      console.log(selectedAccount.value);
      console.log(
        "        aes        selectedAccount.value.encMnemonic,        password.value :>>",
        "aes",
        selectedAccount.value.encMnemonic,
        password.value
      );
      const mnemonic = decrypt(
        "aes",
        selectedAccount.value.encMnemonic,
        password.value
      );

      console.log("mnemonic :>> ", mnemonic);
      recoverWallet(mnemonic);
    };

    return {
      recoverWallet,
      router,
      accounts,
      selectedAccount,
      selectAccount,
      password,
      decryptMnemonic,
    };
  },
};
</script>
