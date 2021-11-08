<template>
  <ion-list>
    <ion-item
      lines="none"
      button
      @click="popoverController.dismiss() && router.push('/editprofile')"
    >
      <ion-icon class="graphic" :icon="personCircleOutline"></ion-icon>
      <!-- :src="require('/public/assets/icons/editProfile.svg')" -->
      <ion-label>Edit my Profile</ion-label>
    </ion-item>
    <ion-item lines="none">
      <ion-icon class="graphic d" :icon="qrCodeOutline"></ion-icon>
      <!-- :src="require('/public/assets/icons/QR.svg')" -->
      <ion-label>Show my QR code</ion-label>
    </ion-item>
    <ion-item lines="none">
      <ion-icon class="graphic d" :icon="personAddOutline"></ion-icon>
      <ion-label>Invite a friend</ion-label>
    </ion-item>
    <ion-item lines="none">
      <ion-icon
        class="graphic d"
        :src="require('/public/assets/icons/dashd-purple.svg')"
      ></ion-icon>
      <ion-label>Transactions</ion-label>
    </ion-item>
    <ion-item lines="none">
      <ion-icon class="graphic d" :icon="newspaperOutline"></ion-icon>
      <ion-label>News & Updates</ion-label>
    </ion-item>
    <ion-item
      lines="none"
      button
      @click="popoverController.dismiss() && router.push('/settings')"
    >
      <ion-icon class="graphic d" :icon="settingsOutline"></ion-icon>
      <!-- :src="require('/public/assets/icons/settings.svg')" -->
      <ion-label>Settings</ion-label>
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
import {
  qrCodeOutline,
  personAddOutline,
  personCircleOutline,
  newspaperOutline,
  settingsOutline,
} from "ionicons/icons";

export default {
  name: "MainMenu",
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
      personCircleOutline,
      personAddOutline,
      newspaperOutline,
      settingsOutline,
    };
  },
};
</script>

<style scoped>
.graphic {
  margin-right: 12px;
  color: #6c69fc;
}
.d {
  height: 18px;
  width: 18px;
  margin-left: 2px;
}
</style>
