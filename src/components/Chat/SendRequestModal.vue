<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{ sendRequestDirection }} Dash</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-input placeholder="Amount" v-model="amount"></ion-input>
    <ion-input placeholder="Message" v-model="message"></ion-input>
  </ion-content>
  <ion-footer>
    <ion-button
      expand="block"
      color="tertiary"
      @click="handleSendRequest"
      :disabled="amount === 0"
      >{{ sendRequestDirection }}</ion-button
    >
    <ion-button fill="outline" expand="block" color="tertiary" @click="cancel"
      >Cancel</ion-button
    >
  </ion-footer>
</template>

<script>
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonFooter,
  IonButton,
  IonInput,
  modalController,
} from "@ionic/vue";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "SendReceiveDashModal",
  props: ["sendRequestDirection"],
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonFooter,
    IonButton,
    IonInput,
  },
  setup(props, { emit }) {
    const amount = ref(0);

    const message = ref("");

    const handleSendRequest = () => {
      console.log("sendDash inside modal :>> ", amount.value, message.value);
      emit("handleSendRequest", {
        amount: parseInt(amount.value),
        message: message.value,
        sendRequestDirection: props.sendRequestDirection,
      });
      modalController.dismiss();
    };

    const cancel = () => {
      modalController.dismiss();
    };

    return { handleSendRequest, cancel, amount, message };
  },
});
</script>
