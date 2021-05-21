<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Receive</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-item>
        <ion-label position="floating">Address</ion-label>
        <ion-input :value="unusedAddress" readonly></ion-input>
      </ion-item>
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-button
        color="secondary"
        fill="outline"
        expand="block"
        router-link="/home"
        >Done</ion-button
      >
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
  IonInput,
  IonFooter,
  IonLabel,
  IonTextarea,
  IonItem,
} from "@ionic/vue";

import { initClient, getClient } from "@/lib/DashClient";
import { Client } from "dash/dist/src/SDK/Client/index";

export default {
  name: "ReceiveDash",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonButton,
    IonInput,
    IonFooter,
    IonLabel,
    // IonTextarea,
    IonItem,
  },
  setup() {
    // const router = useRouter();
    const store = useStore(); //FIXME store type

    const client: Client = getClient();

    const account = client.account as any;

    const unusedAddress = ref<number>(account?.getUnusedAddress().address);

    // onMounted(async () => {});

    return {
      unusedAddress,
    };
  },
};
</script>
