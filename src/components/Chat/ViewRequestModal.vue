<template>
  <ion-header>
    <ion-toolbar>
      <ion-title
        ><span style="color: #6a67fb; font-weight: bold">Accept Request</span>
      </ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
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
        <h3>New balance: {{ duffsInDash(newBalance) }} Dash</h3>
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
    <span v-if="newBalance < 0" style="color: red"
      >Not enough funds to pay this request.</span
    >
    <ion-input
      placeholder="Amount"
      readonly
      :value="duffsInDash(msg.data.amount)"
    ></ion-input>
    <!-- msg.data.fiatAmount; also used in sendRequestModal -->
    <ion-input
      placeholder="Message"
      readonly
      :value="msg.data.text"
    ></ion-input>
  </ion-content>
  <ion-footer>
    <!-- TODO disable button if balance is too low -->
    <ion-button
      expand="block"
      color="tertiary"
      @click="sendRequestAmount"
      :disabled="newBalance < 0"
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
import useRates from "@/composables/rates";

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
import { defineComponent, computed } from "vue";
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
    const { duffsInDash } = useRates();

    //   modalController.dismiss();

    const newBalance = computed(() => {
      return myBalance.value - parseInt(props.msg.data.amount);
    });

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
        duffsInDash.value(props.msg.data.amount),
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
      duffsInDash,
      newBalance,
    };
  },
});
</script>
