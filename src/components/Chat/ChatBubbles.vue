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
              You accepted a request of {{ msg.data.amount }} Dash
            </div>
            <div v-if="msg.data.request === 'decline'">
              You declined a request of {{ msg.data.amount }} Dash
            </div>
            <chat-small-txn
              v-if="!msg.data.request && msg.data.amount && !msg.data.text"
              :direction="msg._direction"
              :amount="msg.data.amount"
              :hours="msg.createdAt.getHours()"
              :minutes="msg.createdAt.getMinutes()"
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
    return {
      checkmarkDoneOutline,
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
