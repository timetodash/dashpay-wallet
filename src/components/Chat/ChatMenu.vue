<template>
  <ion-list>
    <ion-item lines="none" button @click="popoverController.dismiss()">
      <ion-icon class="graphic" :icon="qrCodeOutline"></ion-icon>
      <!-- :src="require('/public/assets/icons/QR.svg')" -->
      <ion-label>Show Dash address</ion-label>
    </ion-item>

    <ion-item lines="none" button @click="popoverController.dismiss()">
      <ion-icon class="graphic" :icon="notificationsOff"></ion-icon>
      <!-- :src="require('/public/assets/icons/editProfile.svg')" -->
      <ion-label>Disable notifications</ion-label>
    </ion-item>

    <ion-item lines="none" @click="popoverController.dismiss()">
      <ion-icon class="graphic" :icon="headset"></ion-icon>
      <ion-label>Ignore</ion-label>
    </ion-item>
  </ion-list>
</template>

<script lang="ts">
import {
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  popoverController,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { qrCodeOutline, notificationsOff, headset } from "ionicons/icons";

export default {
  name: "ChatMenu",
  components: {
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
  },

  setup() {
    const router = useRouter();

    return {
      router,
      popoverController,
      qrCodeOutline,
      notificationsOff,
      headset,
    };
  },
};
</script>

<style scoped>
.graphic {
  margin: 3px 12px 0px 2px;
  color: #6c69fc;
  height: 18px;
  width: 18px;
}
</style>
