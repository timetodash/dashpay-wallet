<template>
  <ion-header>
    <ion-toolbar>
      <div class="flex ion-nowrap ion-padding-bottom">
        <ion-icon :icon="closeOutline" class="close" @click="cancel"></ion-icon>
        <div class="unlock">{{ label }}</div>
      </div>
      <!-- <ion-title>{{ label }}</ion-title> -->
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <qrcode-vue :value="label" size="300" level="H" />
    <ion-button color="primary" shape="round" @click="dismiss"
      >Close</ion-button
    >
  </ion-content>
</template>

<script>
import {
  IonContent,
  IonHeader,
  // IonTitle,
  IonToolbar,
  modalController,
  IonButton,
} from "@ionic/vue";
import { defineComponent } from "vue";
import QrcodeVue from "qrcode.vue";

export default defineComponent({
  name: "ContactQRCodeModal",
  props: {
    label: { type: String, default: "" },
  },
  data() {
    return {};
  },
  methods: {
    dismiss() {
      modalController.dismiss();
    },
  },
  components: {
    QrcodeVue,
    IonContent,
    IonHeader,
    // IonTitle,
    IonToolbar,
    IonButton,
  },
});
</script>
