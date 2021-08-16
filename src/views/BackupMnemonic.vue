<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"
          ><ion-back-button
            style="color: #6c69fc"
            :icon="arrowBack"
          ></ion-back-button
        ></ion-buttons>
        <ion-title class="headername">Save your backup phrase</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-item>
        <ion-label position="floating" class="smalldescription"
          >Backup phrase</ion-label
        >
        <ion-textarea rows="3" readonly :value="mnemonic"></ion-textarea>
      </ion-item>
      <ion-item lines="none">
        <ion-label>I securely stored my phrase</ion-label>
        <ion-toggle
          @ionChange="backupConfirmed = !backupConfirmed"
          :checked="backupConfirmed"
          color="tertiary"
        >
        </ion-toggle>
      </ion-item>
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <ion-button
          :disabled="!backupConfirmed"
          class="ion-padding-horizontal capitalize"
          color="tertiary"
          expand="block"
          @click="next"
          >Next</ion-button
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
  IonButtons,
  IonBackButton,
  IonItem,
  IonFooter,
  IonLabel,
  IonTextarea,
  IonToggle,
} from "@ionic/vue";

import { arrowBack } from "ionicons/icons";

import { getClient } from "@/lib/DashClient";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
  name: "BackupMnemonic",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonTextarea,
    IonPage,
    IonButton,
    IonButtons,
    IonBackButton,
    IonItem,
    IonFooter,
    IonLabel,
    IonToggle,
  },
  setup() {
    console.log(process.env.VUE_APP_DAPIADDRESSES);
    const router = useRouter();
    const store = useStore();

    const mnemonic = ref("");

    const backupConfirmed = ref(false);

    const next = () => {
      if (!store.getters.myOwnerId || !store.getters.myLabel) {
        router.push("/redeeminvite");
      } else {
        router.push("/home");
      }
    };

    onMounted(async () => {
      mnemonic.value = getClient().wallet!.exportWallet().toString();
    });

    return { mnemonic, backupConfirmed, next, arrowBack };
  },
};
</script>

<style scoped>
.smalldescription {
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  /* font-size: 14px; figma */
  line-height: 17px;
  color: #68717b;
  margin-top: 20px;
}
</style>
