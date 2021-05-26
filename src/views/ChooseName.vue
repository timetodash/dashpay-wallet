<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Choose a Dash Name</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-item class="ion-margin-top">
        <ion-label position="floating">Choose a Name</ion-label>
        <ion-input v-model="formName"></ion-input>
      </ion-item>
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <ion-title>{{ checkMessage }}</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-button
          :disabled="!hasClient"
          expand="block"
          color="primary"
          @click="checkIfNameExists"
          >Pick name</ion-button
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
  IonLabel,
  IonInput,
  IonItem,
  IonFooter,
} from "@ionic/vue";

import { getClientOpts, initClient } from "@/lib/DashClient";

import { useRouter } from "vue-router";
import { useStore } from "vuex";

import { Client } from "dash/dist/src/SDK/Client/index";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
  name: "CreateWallet",
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
    let client: Client;

    const clientOpts = getClientOpts(null);

    const router = useRouter();

    const store = useStore();

    const formName = ref("");

    const checkMessage = ref("");

    const hasClient = ref(false);

    const checkIfNameExists = async () => {
      checkMessage.value = "Checking if username exists..";

      const dpnsDoc = await client.platform?.names.resolve(
        `${formName.value}.dash`
      );
      console.log({ dpnsDoc });

      if (dpnsDoc === null) {
        store.commit("setWishName", formName.value);
        checkMessage.value = "Username is availabe";
        setTimeout(() => {
          router.push("/choosepassword");
        }, 1200);
      } else {
        checkMessage.value = "Username is taken.";
        console.log("formName is taken:>> ", formName.value);
      }
    };

    onMounted(async () => {
      await sleep(450); // Don't block the viewport
      console.log(!!client);
      client = await initClient(clientOpts);
      hasClient.value = true;
      console.log("hasClient.value :>> ", hasClient.value);
    });

    return { formName, checkIfNameExists, checkMessage, hasClient };
  },
};
</script>
