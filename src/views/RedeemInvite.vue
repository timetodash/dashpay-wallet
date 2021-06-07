<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Redeem Invite</ion-title>
      </ion-toolbar>
    </ion-header>
    <!-- <ion-content :fullscreen="true"> </ion-content> -->
    <ion-content fullscreen center text-center>
      <ion-grid>
        <ion-row class="ion-align-items-center">
          <ion-col>
            <h1 v-if="!isRedeemed" text-uppercase no-padding no-margin>
              Redeeming invite code..
            </h1>

            <h3 v-else no-padding no-margin>
              Success, we can now finish the registration.
            </h3>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <ion-button
          expand="block"
          color="tertiary"
          @click="() => router.push('/finishregistration')"
          >Finish</ion-button
        >
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import { onMounted, ref, unref } from "vue";
import { useRouter } from "vue-router";

import axios from "axios";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonGrid,
  IonCol,
  IonRow,
  IonFooter,
} from "@ionic/vue";

import { getClient } from "@/lib/DashClient";

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
    IonCol,
    IonRow,
    IonFooter,
  },
  setup() {
    const client = getClient();

    const router = useRouter();

    const isRedeemed = ref(false);

    const redeemInvite = async () => {
      const address = client.account?.getUnusedAddress().address;

      console.log("Redeem invite to address: ", address);

      const reqs = [
        axios.get(`${process.env.VUE_APP_AUTOFAUCET}${address}`),
        // this.$axios.get(`http://autofaucet-1.dashevo.io:5050/drip/${address}`),
        // this.$axios.get(`http://autofaucet-2.dashevo.io:5050/drip/${address}`),
      ];

      const result = await Promise.race(reqs);
      console.log("... faucet dropped.", result, ...reqs);
      return;
    };

    onMounted(async () => {
      console.log("hello");
      await redeemInvite();
      isRedeemed.value = true;
    });

    return { redeemInvite, router, isRedeemed };
  },
};
</script>
