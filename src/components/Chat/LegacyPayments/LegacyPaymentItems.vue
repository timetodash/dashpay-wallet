<template>
  <div class="scroll_container">
    <div>
      <div class="flex ion-justify-content-center">
        <ion-chip class="timestamp_chip"
          ><ion-label class="timestamp_label">Aug 12</ion-label></ion-chip
        >
      </div>

      <ion-grid class="ion-no-padding">
        <ion-row
          v-for="(transaction, idx) in myTransactionHistory"
          :key="idx"
          class="row_padding"
        >
          <ion-col class="ion-padding-horizontal"
            ><legacy-payment-content
              :transaction="transaction"
            ></legacy-payment-content>
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>
  </div>
</template>

<script>
import { IonChip, IonLabel, IonGrid, IonRow, IonCol } from "@ionic/vue";
import LegacyPaymentContent from "@/components/Chat/LegacyPayments/LegacyPaymentContent.vue";
import useWallet from "@/composables/wallet";

export default {
  components: {
    IonChip,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    LegacyPaymentContent,
  },
  setup() {
    const { transactionDisplay, myTransactionHistory, myBalance } = useWallet();

    console.log("balance.value :>> ", myBalance.value);
    console.log("transactionHistory.value :>> ", myTransactionHistory.value);
    return {
      myTransactionHistory,
      transactionDisplay,
    };
  },
};
</script>

<style scoped>
.scroll_container {
  height: 100%;
  display: flex;
  overflow-y: scroll;
  flex-direction: column-reverse;
}
</style>
