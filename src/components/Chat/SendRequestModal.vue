<template>
  <ion-header>
    <ion-toolbar>
      <ion-title
        ><span
          style="text-transform: capitalize; color: #6a67fb; font-weight: bold"
          >{{ sendRequestDirection }}</span
        >
        Dash
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
    <ion-button color="tertiary" @click="switchSendRequest">switch</ion-button>
    <ion-input placeholder="Amount" v-model="amount"></ion-input>
    <ion-item>
      <ion-label>{{ fiatAmount }}</ion-label>
    </ion-item>
    <ion-button color="tertiary" @click="showChooseCurrencyModal(true)">{{
      fiatSymbol
    }}</ion-button>
    <ion-input placeholder="Message" v-model="message"></ion-input>
  </ion-content>
  <ion-footer>
    <!-- TODO disable button if the balance is too low -->
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
  <ion-modal
    :is-open="isChooseCurrencyModalOpen"
    @didDismiss="showChooseCurrencyModal(false)"
  >
    <ChooseCurrencyModal @chooseCurrency="chooseCurrency"></ChooseCurrencyModal>
  </ion-modal>
</template>

<script lang="ts">
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
  IonModal,
  modalController,
} from "@ionic/vue";
import { defineComponent, ref, computed, onMounted } from "vue";

import useRates from "@/composables/rates";

import ChooseCurrencyModal from "@/components/Settings/ChooseCurrencyModal.vue";

export default defineComponent({
  name: "SendReceiveDashModal",
  props: ["initSendRequestDirection", "friendOwnerId"],
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
    IonModal,
    ChooseCurrencyModal,
  },
  setup(props, { emit }) {
    const amount = ref(0);

    const sendRequestDirection = ref("send");

    // eslint-disable-next-line vue/no-setup-props-destructure
    sendRequestDirection.value = props.initSendRequestDirection;

    const message = ref("");

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

    const { fetchRate, getFiatSymbol, getFiatRate, duffsInDash, dashInDuffs } =
      useRates();

    const newBalance = computed(() => {
      return myBalance.value - dashInDuffs.value(amount.value);
    });

    const switchSendRequest = () => {
      sendRequestDirection.value =
        sendRequestDirection.value === "send"
          ? (sendRequestDirection.value = "request")
          : (sendRequestDirection.value = "send");
    };

    const isChooseCurrencyModalOpen = ref(false);
    console.log("getFiatSymbol.value :>> ", getFiatSymbol.value);
    const fiatSymbol = ref(getFiatSymbol.value);

    const fiatRate = ref(getFiatRate.value(fiatSymbol.value).price);
    console.log("fiatRate.value :>> ", fiatRate.value);

    const fiatAmount = computed(() => amount.value * fiatRate.value);

    const chooseCurrency = async (symbol: string) => {
      fiatSymbol.value = symbol;
      fiatRate.value = parseFloat((await fetchRate(fiatSymbol.value)).price);
    };

    // chooseCurrency("USD");

    const showChooseCurrencyModal = (state: boolean) => {
      isChooseCurrencyModalOpen.value = state;
    };

    const handleSendRequest = () => {
      console.log("sendDash inside modal :>> ", amount.value, message.value);
      emit("handleSendRequest", {
        amount: amount.value,
        message: message.value,
        sendRequestDirection: sendRequestDirection.value,
      });
      modalController.dismiss();
    };

    const cancel = () => {
      modalController.dismiss();
    };

    return {
      getUserLabel,
      getUserAvatar,
      getUserDisplayName,
      getUserPublicMessage,
      myLabel,
      myAvatar,
      myOwnerId,
      myBalance,
      handleSendRequest,
      switchSendRequest,
      cancel,
      amount,
      message,
      sendRequestDirection,
      isChooseCurrencyModalOpen,
      fiatSymbol,
      chooseCurrency,
      showChooseCurrencyModal,
      fiatAmount,
      newBalance,
      duffsInDash,
    };
  },
});
</script>
