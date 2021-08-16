<template>
  <div class="scroll_container">
    <div>
      <ion-grid style="padding: 0px">
        <ion-row
          v-for="msg in chatMsgs"
          :key="msg.id.toString()"
          class="row_padding"
          @click="setReplyToId(msg)"
        >
          <ion-col>
            <div v-if="msg.data.replyToChatId">
              {{
                store.getters.getChatMsgById(msg.data.replyToChatId)?.data.text
              }}
            </div>
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

            <chat-small-txn
              v-if="!msg.data.request && msg.data.amount && !msg.data.text"
              :msg="msg"
            >
            </chat-small-txn>
            <request-response
              v-if="
                msg.data.request === 'decline' || msg.data.request === 'accept'
              "
              :msg="msg"
            ></request-response>
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { IonGrid, IonRow, IonCol } from "@ionic/vue";
import { checkmarkDoneOutline } from "ionicons/icons";
import ChatMessage from "@/components/Chat/ChatMessage.vue";
import ChatTxn from "@/components/Chat/ChatTxn.vue";
import ChatSmallTxn from "@/components/Chat/ChatSmallTxn.vue";
import RequestResponse from "../TransactionModals/RequestResponse.vue";

export default {
  props: ["chatMsgs", "friendOwnerId"],
  components: {
    IonGrid,
    IonRow,
    IonCol,
    ChatMessage,
    ChatTxn,
    ChatSmallTxn,
    RequestResponse,
  },
  setup(props) {
    const store = useStore();

    const setReplyToId = (msg) => {
      store.commit("setActiveReplyToId", {
        friendOwnerId: props.friendOwnerId,
        replyToId: msg.id.toString(),
      });
    };

    // Resolve reply to msgs
    // TODO load in single query
    props.chatMsgs.map((msg) => {
      if (!msg.data.replyToChatId) return;
      store.dispatch("fetchMsgById", {
        ownerId: props.friendOwnerId,
        msgId: msg.data.replyToChatId,
      });
    });

    return {
      checkmarkDoneOutline,
      setReplyToId,
      store,
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
