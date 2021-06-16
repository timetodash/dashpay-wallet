<template>
  <div style="height: 100%">
    <ion-grid class="ion-no-padding">
      <ion-row
        v-for="msg in chatMsgs"
        :key="msg.id.toString()"
        class="row_padding"
      >
        <ion-col class="ion-padding-horizontal">
          <chat-message v-if="msg.data.text && !msg.data.amount" :msg="msg">
          </chat-message>
          <chat-txn
            v-if="(msg.data.amount && msg.data.text) || msg.data.request"
            :msg="msg"
            :friendOwnerId="friendOwnerId"
          >
          </chat-txn>
          <chat-small-txn
            v-if="!msg.data.request && msg.data.amount && !msg.data.text"
            :msg="msg"
          >
          </chat-small-txn>
        </ion-col>
      </ion-row>
    </ion-grid>
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
.row_padding {
  padding-top: 5px;
  padding-bottom: 4px;
}
</style>