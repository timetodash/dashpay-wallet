<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Send</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-item>
        <ion-label position="floating">Amount</ion-label>
        <ion-input v-model="amount"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">Address</ion-label>
        <ion-input v-model="recipient"></ion-input>
      </ion-item>
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-button expand="block" @click="sendDash()">Send</ion-button>
      <ion-button
        color="secondary"
        fill="outline"
        expand="block"
        router-link="/home"
        >Done</ion-button
      >
    </ion-footer>
    <ion-toast
      :is-open="isOpenRef"
      color="success"
      position="middle"
      :message="`Success: Your transaction Id is ${transactionId}`"
      :duration="2000"
      @didDismiss="setOpen(false)"
    >
    </ion-toast>
  </ion-page>
</template>

<script lang="ts">
import { onMounted, ref, unref, computed, defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Unit } = require("@dashevo/dashcore-lib");

import {
  IonPage,
  IonHeader,
  IonFooter,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonLabel,
  IonTextarea,
  IonInput,
  IonItem,
  IonToast,
} from "@ionic/vue";

import { initClient, getClient } from "@/lib/DashClient";
import { Client } from "dash/dist/src/SDK/Client/index";

export default defineComponent({
  name: "SendDash",
  components: {
    IonHeader,
    IonFooter,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonButton,
    IonInput,
    IonLabel,
    IonToast,
    // IonTextarea,
    IonItem,
  },
  setup() {
    // const router = useRouter();
    const store = useStore(); //FIXME store type

    const client: Client = getClient();

    const account = client.account as any;

    const balance = ref<number>(account?.getTotalBalance());

    const amount = ref<number>();

    const recipient = ref<string>(account?.getUnusedAddress().address);

    const transactionId = ref<string>();

    const isOpenRef = ref(false);

    const setOpen = (state: boolean) => (isOpenRef.value = state);

    const sendDash = async function() {
      const satoshis = Unit.fromBTC(amount.value).toSatoshis();

      const transaction = account.createTransaction({
        recipient: recipient.value,
        satoshis,
      });
      console.log("transaction :>> ", transaction);

      console.log("transactionId :>> ", transactionId);
      transactionId.value = await account.broadcastTransaction(transaction);
      console.log("transactionId :>> ", transactionId);

      console.log("transactionId :>> ", transactionId);

      setOpen(true);
    };

    // onMounted(async () => {});

    return {
      balance,
      recipient,
      amount,
      transactionId,
      sendDash,
      isOpenRef,
      setOpen,
    };
  },
});
</script>
