<template>
  <div class="scroll_container">
    <div>
      <div class="flex ion-justify-content-center">
        <ion-chip class="timestamp_chip">
          <!-- @timetodash implement dynamic timestamp chips -->
          <ion-label class="timestamp_label">Aug 12</ion-label></ion-chip
        >
      </div>

      <ion-grid class="ion-no-padding">
        <ion-row
          v-for="transaction in myTransactionHistory"
          :key="transaction.txId"
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
import { watchEffect } from "vue";
import { useStore } from "vuex";

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
    const store = useStore();
    const {
      //transactionDisplay,
      myTransactionHistory,
      myBalance,
    } = useWallet();

    console.log("balance.value :>> ", myBalance.value);
    console.log("transactionHistory.value :>> ", myTransactionHistory.value);

    // Mark msgs as read
    watchEffect(() => {
      if (!myTransactionHistory.value.length > 0) return;

      const lastTimestamp = myTransactionHistory.value[0].time;

      console.log(
        "watch effect loop myTransactionHistory.value[0].time :>> ",
        myTransactionHistory.value[0].time
      );

      // TODO loop through to txs and find first confirmed time
      if (myTransactionHistory.value[0].time === "999999999") return;

      store.commit("setLastSeenChatTimestampByOwnerId", {
        lastTimestamp,
        friendOwnerId: "legacy",
      });

      store.dispatch("saveLastSeenChatTimestamps");
    });
    return {
      myTransactionHistory,
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
