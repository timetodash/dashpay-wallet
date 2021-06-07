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
          {{ transactionDisplay(transaction) }}
        </ion-item>
      </ion-card>
      <ion-button color="primary" @click="refreshData()">Refresh</ion-button>
      <ion-fab
        vertical="bottom"
        horizontal="end"
        edge
        slot="fixed"
        style="margin-bottom: 50px"
      >
        <ion-fab-button>
          <ion-icon :icon="listCircle" />
        </ion-fab-button>
        <ion-fab-list side="top">
          <ion-fab-button router-link="/contactsearch">
            <ion-icon color="secondary" :icon="personAdd" />
          </ion-fab-button>
          <ion-fab-button router-link="/receivedash"
            ><ion-icon color="secondary" :icon="download" />
          </ion-fab-button>
          <ion-fab-button router-link="/senddash"
            ><ion-icon color="secondary" :icon="send" />
          </ion-fab-button>
        </ion-fab-list>
      </ion-fab>
    </ion-content>
    <ion-footer></ion-footer>
    <!-- <ion-footer class="ion-no-border">
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
    </ion-footer> -->
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
  IonInput,
  IonCard,
  IonFab,
  IonFabList,
  IonFabButton,
  IonIcon,
} from "@ionic/vue";
import { listCircle, personAdd, send, download } from "ionicons/icons";

import { initClient, getClient, getClientOpts } from "@/lib/DashClient";
import { Client } from "dash/dist/src/SDK/Client/index";
import { resolveTransaction, DIRECTION } from "@/lib/helpers/Transactions";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Dashcore = require("@dashevo/dashcore-lib");

export default {
  name: "Home",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonButton,
    // IonGrid,
    // IonRow,
    // IonCol,
    IonFooter,
    IonLabel,
    IonInput,
    IonCard,
    // IonTextarea,
    IonItem,
    IonFab,
    IonFabList,
    IonFabButton,
    IonIcon,
  },
  setup() {
    // const router = useRouter();
    const store = useStore(); //FIXME store type

    const client: Client = getClient();
    // let client: Client;

    const balance = ref<number>();

    const transactionHistory = ref();

    const transactionDisplay = (transaction: any) => {
      console.log("transaction :>> ", transaction);
      let txDisplay = "";
      switch (transaction.transferDirection) {
        case DIRECTION.SENT:
          txDisplay = `Sent ${transaction.transferSatoshis} to ${transaction.remoteAddress}`;

          if (transaction.remoteAddress === "false")
            txDisplay = `Identity TopUp of ${transaction.transferSatoshis}`;
          break;
        case DIRECTION.RECEIVED:
          txDisplay = `Received ${transaction.transferSatoshis} from ${transaction.remoteAddress}`;
          break;
        case DIRECTION.MOVED:
          txDisplay = `Internal transfer of ${transaction.transferSatoshis}`;
          break;

        default:
          break;
      }

      return txDisplay;
    };

    const refreshData = () => {
      balance.value = client.account!.getTotalBalance();

      const transactions = Object.entries(
        client.account!.getTransactions()
      ).map((el) => el[1]);

      console.log("transactions :>> ", transactions);

      transactionHistory.value = transactions.map((tx: any) =>
        resolveTransaction(client, tx)
      );
      console.log("transactionHistory.value :>> ", transactionHistory.value);
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
      transactionDisplay,
      listCircle,
      personAdd,
      send,
      download,
    };
  },
};
</script>
