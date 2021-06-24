<template>
  <ion-header>
    <ion-toolbar>
      <ion-title
        ><span style=" color:#6A67FB; font-weight:bold">Accept Request</span>
      </ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <!-- @timetodash: move items in sub components and show my own item on top conditional on sendRequestDirection -->
    <!-- @timetodash: use dashcore-lib Unit class and a computed property for New Balance, substract for send, add for receive -->
    <ion-item>
      <ion-avatar slot="start">
        <img :src="myAvatar" />
      </ion-avatar>
      <ion-label>
        <h2
          class="
                flex
                ion-align-items-center ion-justify-content-between ion-nowrap
              "
        >
          {{ myLabel }}
        </h2>
        <h3>New balance: {{ myBalance - parseInt(msg.data.amount) }}</h3>
      </ion-label>
    </ion-item>
    <ion-item>
      <ion-avatar slot="start">
        <img :src="getUserAvatar(friendOwnerId)" />
      </ion-avatar>
      <ion-label>
        <h2
          class="
                flex
                ion-align-items-center ion-justify-content-between ion-nowrap
              "
        >
          {{ getUserLabel(friendOwnerId) }}
        </h2>
        <h3>
          {{ getUserDisplayName(friendOwnerId) }}
        </h3>
      </ion-label>
    </ion-item>
    <ion-input
      placeholder="Amount"
      readonly
      :value="msg.data.amount"
    ></ion-input>
    <ion-input
      placeholder="Message"
      readonly
      :value="msg.data.text"
    ></ion-input>
  </ion-content>
  <ion-footer>
    <!-- TODO disable button if balance is too low -->
    <ion-button expand="block" color="tertiary" @click="sendRequestAmount"
      >Send</ion-button
    >
    <ion-button
      fill="outline"
      expand="block"
      color="danger"
      @click="declineRequestWrapper"
      >Decline</ion-button
    >
    <!-- TODO move cancel to X icon in the header -->
    <ion-button fill="outline" expand="block" color="tertiary" @click="cancel"
      >Cancel</ion-button
    >
  </ion-footer>
</template>

<script>
import useContacts from "@/composables/contacts";
import useWallet from "@/composables/wallet";

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonFooter,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonAvatar,
  modalController,
} from "@ionic/vue";
import { defineComponent, ref } from "vue";
import useChats from "@/composables/chats";

export default defineComponent({
  name: "ViewRequestModal",
  props: ["msg", "friendOwnerId"],
  emits: ["declineRequest"],
  components: {
    IonItem,
    IonLabel,
    IonAvatar,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonFooter,
    IonButton,
    IonInput,
  },
  setup(props, { emit }) {
    const {
      getUserLabel,
      getUserAvatar,
      getUserDisplayName,
      getUserPublicMessage,
      myLabel,
      myAvatar,
      myOwnerId,
    } = useContacts();

    const { myBalance } = useWallet();

    //   modalController.dismiss();

    const cancel = () => {
      modalController.dismiss();
    };

    const declineRequestWrapper = () => {
      emit("declineRequest");
      // TODO keep modal open onError and show error message
      modalController.dismiss();
    };

    const { sendChat } = useChats();

    const sendRequestAmount = () => {
      // TODO send DIP15 L1 tx
      // TODO amount is mocked and should come from request msg
      sendChat(
        "",
        props.friendOwnerId,
        props.msg.data.amount,
        "accept",
        props.msg.id.toString()
      );
      // TODO keep modal open onError and show error message
      modalController.dismiss();
    };

    return {
      declineRequestWrapper,
      getUserLabel,
      getUserAvatar,
      getUserDisplayName,
      getUserPublicMessage,
      myLabel,
      myAvatar,
      myOwnerId,
      myBalance,
      cancel,
      sendRequestAmount,
    };
  },
});
</script>
