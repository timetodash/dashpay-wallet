<template>
  <!-- Received transaction -->
  <div
    v-if="transaction.type === 'received'"
    class="flex ion-no-wrap received_txn"
  >
    You received
    <div class="dash">
      {{ receivedDash(transaction) }}
    </div>
    on
    <div class="address">
      {{ truncatedAddress(transaction.to[0].address) }}
    </div>
  </div>

  <!-- Sent transaction -->
  <div
    v-if="transaction.type === 'sent' && transaction.to[0].address != 'false'"
    class="sent_txn flex ion-justify-content-end"
  >
    You sent
    <div class="dash">
      {{ sentDash(transaction) }}
    </div>
    to
    <div class="address">
      {{ truncatedAddress(transaction.to[0].address) }}
    </div>
  </div>

  <!-- Received and sent transaction chat bubbles -->
  <!-- <chat-small-txn
    v-if="
      transaction.type === 'received' ||
        (transaction.type === 'sent' && transaction.to[0].address != 'false')
    "
    :direction="transaction.type"
    :amount="duffsToDash(transaction.to[0].satoshis)"
    :hours="new Date().getHours()"
    :minutes="new Date().getMinutes(2)"
  ></chat-small-txn> -->

  <!-- Internal transfer or Topup  -->
  <div class="flex ion-justify-content-center">
    <div
      v-if="
        transaction.type === 'address_transfer' ||
          (transaction.type === 'sent' && transaction.to[0].address === 'false')
      "
      class="internal"
    >
      <!-- Internal transfer -->
      <div
        class="flex ion-no-wrap"
        :class="{
          internal_text: transaction.type === 'address_transfer',
          topup_text:
            transaction.type === 'sent' &&
            transaction.to[0].address === 'false',
        }"
      >
        <div v-if="transaction.type === 'address_transfer'">
          Internal Transfer of {{ sentDash(transaction) }}
        </div>

        <!-- Identity TopUp -->
        <div
          v-if="
            transaction.type === 'sent' && transaction.to[0].address === 'false'
          "
        >
          Identity TopUp of {{ sentDash(transaction) }}
        </div>
        <span class="space_between">
          <!-- TODO -->
          <!-- {{ internalTransferText(transaction.internal) }} -->
        </span>
        {{ new Date().getHours() }}:{{ new Date().getMinutes() }}
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Dashcore = require("@dashevo/dashcore-lib");
const Unit = Dashcore.Unit;

// import ChatSmallTxn from "@/components/Chat/ChatSmallTxn.vue";
import useWallet from "@/composables/wallet";

export default {
  name: "ChatLegacyPayment",
  components: {
    // ChatSmallTxn,
  },
  props: ["transaction"],
  setup() {
    const truncatedAddress = function(address) {
      console.log("address :>> ", address);
      return (
        address.substring(0, 6) +
        "..." +
        address.substring(address.length - 6, address.length)
      );
    };

    const duffsToDash = function(duffs) {
      return Unit.fromSatoshis(duffs).toBTC();
    };

    const sentDash = function(transaction) {
      return Unit.fromSatoshis(transaction.to[0].satoshis).toBTC();
    };

    const receivedDash = function(transaction) {
      return Unit.fromSatoshis(transaction.to[0].satoshis).toBTC();
    };

    const internalTransferText = function(amount) {
      return (
        duffsToDash(amount) +
        "Dash (" +
        (duffsToDash(amount) * 175).toFixed(2) + // TODO USD rate
        ") USD"
      );
    };

    return {
      truncatedAddress,
      internalTransferText,
      duffsToDash,
      sentDash,
      receivedDash,
    };
  },
};
</script>

<style scoped>
.sent_txn {
  /* font-family: Inter; */
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  line-height: 12px;
  color: #6a67fb;
  margin: 6px 2px 6px 0px;
}
.received_txn {
  /* font-family: Inter; */
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  line-height: 12px;
  color: #34bba8;
  margin: 6px 0px 7px 3px;
}
.address {
  color: rgba(0, 0, 0, 0.4);
  margin-left: 3px;
  margin-right: 3px;
}
.internal {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px 0px;

  /* width: 262px; */
  height: 23px;

  background: #f3f3f5;
  border-radius: 10.5px;
  margin: 6px 0px;
}
.internal_text {
  /* font-family: Inter; */
  font-style: normal;
  font-weight: 500;
  line-height: 13px;
  color: rgba(0, 0, 0, 0.4);
  font-size: 11px;

  flex: none;
  order: 0;
  flex-grow: 0;
  margin: 0px 13px;
}
.topup_text {
  /* font-family: Inter; */
  font-style: normal;
  font-weight: 500;
  line-height: 12px;
  margin: 0px 13px;
  color: rgba(0, 0, 0, 0.4);
  font-size: 10px;
}
.space_between {
  margin-left: 13px;
  margin-right: 13px;
}
.dash {
  font-weight: 700;
  color: #66bda8;
}
</style>
