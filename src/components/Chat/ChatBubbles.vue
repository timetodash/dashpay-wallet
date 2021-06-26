<template>
  <div class="scroll_container">
    <div>
      <ion-grid class="ion-no-padding">
        <ion-row
          v-for="msg in chatMsgs"
          :key="msg.id.toString()"
          class="row_padding"
        >
          <ion-col>
            <chat-message v-if="msg.data.text && !msg.data.amount" :msg="msg">
            </chat-message>
            <chat-txn
              v-if="
                (msg.data.amount && msg.data.text) ||
                  msg.data.request === 'open'
              "
              :msg="msg"
              :friendOwnerId="friendOwnerId"
            >
            </chat-txn>
            <div v-if="msg.data.request === 'accept'">
              <!-- @timetodash replace you with variable depending on sender/receiver, use grey informational bubble from figma -->
              <!-- TODO amount is mocked and must come from DIP15 L1 data -->
              {{ getUserLabel(msg.ownerId.toString()) }} accepted to pay
              {{ duffsInDash(msg.data.amount) }} Dash
            </div>
            <div v-if="msg.data.request === 'decline'">
              You declined a request of
              {{ duffsInDash(msg.data.amount) }} Dash
            </div>
            <chat-small-txn
              v-if="!msg.data.request && msg.data.amount && !msg.data.text"
              :msg="msg"
            >
            </chat-small-txn>
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>
  </div>
</template>

<script>
import { IonGrid, IonRow, IonCol } from "@ionic/vue";
import { checkmarkDoneOutline } from "ionicons/icons";
import ChatMessage from "@/components/Chat/ChatMessage.vue";
import ChatTxn from "@/components/Chat/ChatTxn.vue";
import ChatSmallTxn from "@/components/Chat/ChatSmallTxn.vue";
import useRates from "@/composables/rates";
import useContacts from "@/composables/contacts";
// import { reactive } from "vue";

export default {
  props: ["chatMsgs", "friendOwnerId"],
  components: {
    IonGrid,
    IonRow,
    IonCol,
    ChatMessage,
    ChatTxn,
    ChatSmallTxn,
  },
  setup() {
    const { duffsInDash } = useRates();
    const { getUserLabel } = useContacts();
    return {
      checkmarkDoneOutline,
      duffsInDash,
      getUserLabel,
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
.row_padding {
  padding-top: 5px;
  padding-bottom: 4px;
}
</style>
