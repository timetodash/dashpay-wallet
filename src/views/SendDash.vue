<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="flex ion-nowrap ion-padding-bottom">
        <ion-icon
          :icon="closeOutline"
          class="close"
          @click="router.push(`/home`)"
        ></ion-icon>
        <!-- <ion-icon :icon="closeOutline" class="close" @click="cancel"></ion-icon> -->
        <div class="title purple flex ion-nowrap">
          <ion-icon
            class="header-icon"
            :src="require('/public/assets/icons/sendHeader.svg')"
          />
          Send Dash
        </div>
      </div>

      <span class="funds" v-if="newDashBalance < 0"
        >Not enough funds to send this transaction.</span
      >

      <div class="swap-container">
        <dash-currency
          @newFiatSymbol="fiatSymbol = $event"
          @newFiatRate="fiatRate = $event"
          v-if="currency === 'dash'"
          v-model:amount="amount"
          :amount="amount"
          :fiatAmount="fiatAmount"
          :fiatSymbol="fiatSymbol"
        >
        </dash-currency>
        <fiat-currency
          @newFiatSymbol="fiatSymbol = $event"
          @newFiatRate="fiatRate = $event"
          v-if="currency === 'fiat'"
          v-model:fiatAmount="fiatAmount"
          :fiatAmount="fiatAmount"
          :amount="amount"
          :fiatSymbol="fiatSymbol"
        ></fiat-currency>

        <ion-icon
          class="swap"
          @click="swapCurrency"
          :src="require('/public/assets/icons/swap_currency.svg')"
        ></ion-icon>
      </div>

      <div class="message-text">Recipient Dash Address</div>
      <ion-input class="message-input" v-model="recipient"></ion-input>

      <!-- <ion-item>
        <ion-label position="floating">Amount</ion-label>
        <ion-input v-model="amount"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">Address</ion-label>
        <ion-input v-model="recipient"></ion-input>
      </ion-item>
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-button expand="block" @click="sendDash()">Send</ion-button>
      <ion-button
        color="secondary"
        fill="outline"
        expand="block"
        router-link="/home"
        >Done</ion-button
      >
    </ion-footer> -->
    </ion-content>

    <ion-footer class="ion-no-border">
      <!-- TODO disable button if the balance is too low -->
      <ion-chip
        expand="block"
        shape="round"
        class="nextbutton send_color"
        @click="sendDash()"
        ><span class="next-text">Send</span></ion-chip
      >
    </ion-footer>

    <ion-toast
      :is-open="isOpenRef"
      color="success"
      position="middle"
      :message="`Success: Your transaction Id is ${transactionId}`"
      :duration="2000"
      @didDismiss="setOpen(false)"
    >
    </ion-toast>
  </ion-page>
</template>

<script lang="ts">
import DashCurrency from "@/components/TransactionModals/DashCurrency.vue";
import FiatCurrency from "@/components/TransactionModals/FiatCurrency.vue";

import { ref, computed, defineComponent, watchEffect } from "vue";
import { useRouter } from "vue-router";
// import { useStore } from "vuex";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Unit } = require("@dashevo/dashcore-lib");

import {
  IonPage,
  IonFooter,
  IonContent,
  IonIcon,
  IonInput,
  IonToast,
  modalController,
} from "@ionic/vue";

import {
  chevronDownOutline,
  arrowDownOutline,
  closeOutline,
} from "ionicons/icons";

import { initClient, getClient } from "@/lib/DashClient";
import { Client } from "dash/dist/src/SDK/Client/index";

import useRates from "@/composables/rates";

export default defineComponent({
  name: "SendDash",
  components: {
    IonFooter,
    IonPage,
    IonContent,
    IonIcon,
    IonInput,
    IonToast,
    DashCurrency,
    FiatCurrency,
  },
  setup() {
    const router = useRouter();
    // const store = useStore(); //FIXME store type

    const amount = ref(0);
    const fiatAmount = ref(0);

    const { getFiatSymbol, getFiatRate, duffsInDash, dashInDuffs } = useRates();

    const fiatSymbol = ref(getFiatSymbol.value);
    const fiatRate = ref(getFiatRate.value(getFiatSymbol.value).price);

    const client: Client = getClient();

    const account = client.account as any;

    const balance = ref<number>(account?.getTotalBalance());

    // const amount = ref<number>();

    const recipient = ref<string>(account?.getUnusedAddress().address);

    const transactionId = ref<string>();

    const isOpenRef = ref(false);

    const setOpen = (state: boolean) => (isOpenRef.value = state);

    const sendDash = async function () {
      const satoshis = Unit.fromBTC(amount.value).toSatoshis();

      const transaction = account.createTransaction({
        recipient: recipient.value,
        satoshis,
      });
      console.log("transaction :>> ", transaction);

      console.log("transactionId :>> ", transactionId);
      transactionId.value = await account.broadcastTransaction(transaction);
      console.log("transactionId :>> ", transactionId);

      console.log("transactionId :>> ", transactionId);

      setOpen(true);
    };

    const currency = ref("dash");
    const swapCurrency = () => {
      currency.value =
        currency.value === "dash"
          ? (currency.value = "fiat")
          : (currency.value = "dash");
      console.log("show currency", currency.value);
    };

    watchEffect(() => {
      if (currency.value === "dash") {
        return (fiatAmount.value = amount.value * fiatRate.value);
      }
      if (currency.value === "fiat") {
        return (amount.value = fiatAmount.value / fiatRate.value);
      }
    });

    const newDashBalance = computed(() => {
      const bal = balance.value - dashInDuffs.value(amount.value);
      return duffsInDash.value(bal);
    });

    const cancel = () => {
      modalController.dismiss();
    };

    // onMounted(async () => {});

    return {
      balance,
      recipient,
      amount,
      transactionId,
      sendDash,
      isOpenRef,
      setOpen,
      chevronDownOutline,
      arrowDownOutline,
      closeOutline,
      newDashBalance,
      cancel,
      swapCurrency,
      fiatAmount,
      fiatSymbol,
      fiatRate,
      currency,
      router,
    };
  },
});
</script>

<style scoped>
.title {
  position: fixed;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: 14px;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  text-transform: capitalize;
  display: flex;
  align-items: center;
}
.header-icon {
  /* order: 0; */
  width: 28px;
  height: 28px;
  display: flex;
  align-items: flex-start;
  margin-right: 8px;
}
.swap-container {
  position: relative;
  margin-top: 36px;
}
.message-text {
  margin: 13px 0px 8px 0px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 18px;
  color: #a3a3a3;
}
.message-input {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  min-height: 44px;

  background: #f5f5f7;

  border: 0.5px solid rgba(0, 0, 0, 0.12);
  /* box-sizing: border-box; */
  border-radius: 10px;
}
.swap {
  width: 35px;
  height: 35px;
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translate(0%, -50%);
}
</style>