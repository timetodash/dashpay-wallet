<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ name }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-item>
        <ion-label position="floating">Balance</ion-label>
        <ion-input :value="balance"></ion-input>
      </ion-item>
      <ion-title class="ion-margin-top">Transactions</ion-title>
      <ion-card>
        <ion-item v-for="(transaction, idx) in transactionHistory" :key="idx">
          {{ transaction.id.substr(0, 6) }}
          {{ transaction.outputs.map((output) => output._satoshis) }}
        </ion-item>
      </ion-card>
      <ion-button color="primary" @click="refreshData()">Refresh</ion-button>
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <ion-grid>
          <ion-row>
            <ion-col col-6>
              <ion-button color="primary" expand="block" router-link="/senddash"
                >Send</ion-button
              >
            </ion-col>
            <ion-col col-6>
              <ion-button
                color="primary"
                expand="block"
                router-link="/receivedash"
                >Receive</ion-button
              >
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import { onMounted, ref, unref, computed } from "vue";
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
  IonGrid,
  IonRow,
  IonCol,
  IonFooter,
} from "@ionic/vue";

import { initClient, getClient } from "@/lib/DashClient";
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
    IonGrid,
    IonRow,
    IonCol,
    IonFooter,
    // IonLabel,
    // IonTextarea,
    // IonItem,
  },
  setup() {
    // const router = useRouter();
    const store = useStore(); //FIXME store type

    const client: Client = getClient();

    // const account = client.account as any;

    const balance = ref<number>();

    const transactionHistory = ref(client.account?.getTransactions());

    const refreshData = () => {
      transactionHistory.value = client.account?.getTransactions();
      console.log("unref(transactionHistory) :>> ", unref(transactionHistory));
      console.log("transactionHistory :>> ", transactionHistory);
      console.log("transactionHistory.value :>> ", transactionHistory.value);

      balance.value = client.account?.getTotalBalance();
    };

    onMounted(async () => {
      refreshData();
    });

    return {
      balance,
      transactionHistory,
      identityId: computed(() => store.getters.identityId),
      name: computed(() => store.getters.name),
      refreshData,
    };
  },
};
</script>
