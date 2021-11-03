<template>
  <div
    class="chatbubble flex"
    :class="{
      user: msg._direction === 'SENT',
      chat_partner: msg._direction === 'RECEIVED',
    }"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <div v-if="msg.data.replyToChatId">
      <!-- {{ store.getters.getChatMsgById(msg.data.replyToChatId, friendOwnerId) }} -->
      <div class="reply">
        <div class="replied">You replied to</div>
        <!-- <div class="verticalline"> -->
        <chat-txn
          v-if="
            (store.getters.getChatMsgById(msg.data.replyToChatId, friendOwnerId)
              ?.data.amount &&
              store.getters.getChatMsgById(
                msg.data.replyToChatId,
                friendOwnerId
              )?.data.text) ||
              store.getters.getChatMsgById(
                msg.data.replyToChatId,
                friendOwnerId
              )?.data.request === 'open'
          "
          :msg="
            store.getters.getChatMsgById(msg.data.replyToChatId, friendOwnerId)
          "
          :friendOwnerId="friendOwnerId"
          :isReply="true"
        >
        </chat-txn>

        <chat-small-txn
          class="singleline"
          v-if="
            store.getters.getChatMsgById(msg.data.replyToChatId, friendOwnerId)
              ?.data.amount &&
              !store.getters.getChatMsgById(
                msg.data.replyToChatId,
                friendOwnerId
              )?.data.text &&
              !store.getters.getChatMsgById(
                msg.data.replyToChatId,
                friendOwnerId
              )?.data.request
          "
          :msg="
            store.getters.getChatMsgById(msg.data.replyToChatId, friendOwnerId)
          "
          :friendOwnerId="friendOwnerId"
          :isReply="true"
        >
        </chat-small-txn>

        <request-response
          class="singleline"
          {{
          store.getters.getChatMsgById(msg.data.replyToChatId,
          friendOwnerId)
          }}
          v-if="
            store.getters.getChatMsgById(msg.data.replyToChatId, friendOwnerId)
              ?.data.request === 'decline' ||
              store.getters.getChatMsgById(
                msg.data.replryToChatId,
                friendOwnerId
              )?.data.request === 'accept'
          "
          :msg="
            store.getters.getChatMsgById(msg.data.replyToChatId, friendOwnerId)
          "
          :friendOwnerId="friendOwnerId"
          :isReply="true"
        ></request-response>

        <div
          class="message"
          v-if="
            !store.getters.getChatMsgById(msg.data.replyToChatId, friendOwnerId)
              ?.data.amount &&
              store.getters.getChatMsgById(
                msg.data.replyToChatId,
                friendOwnerId
              )?.data.text
          "
        >
          {{
            store.getters.getChatMsgById(msg.data.replyToChatId, friendOwnerId)
              ?.data.text
          }}
        </div>
        <!-- </div> -->
      </div>
    </div>
    <div>
      {{ msg.data.text }} {{ msg._state }}
      <ReplyPopover
        class="nowrap"
        :hover="hover"
        :msg="msg"
        :friendOwnerId="friendOwnerId"
      ></ReplyPopover>
      <div class="nowrap">
        <div class="chat_timestamp chat_timestamp_message">
          {{ msg.createdAt.getHours() }}:{{ msg.createdAt.getMinutes() }}
        </div>
        <ion-icon v-if="msg._direction === 'SENT'" :icon="checkmarkDoneOutline">
        </ion-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { IonIcon } from "@ionic/vue";
import { checkmarkDoneOutline, chevronDownOutline } from "ionicons/icons";

import useRates from "@/composables/rates";
import useContacts from "@/composables/contacts";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import ReplyPopover from "@/components/Chat/ReplyPopover.vue";
import ChatTxn from "@/components/Chat/ChatTxn.vue";
import ChatSmallTxn from "@/components/Chat/ChatSmallTxn.vue";
import RequestResponse from "@/components/TransactionModals/RequestResponse.vue";

import { ref } from "vue";

export default {
  props: ["msg", "friendOwnerId"],
  components: {
    IonIcon,
    ReplyPopover,
    ChatTxn,
    ChatSmallTxn,
    RequestResponse,
  },
  setup() {
    const { duffsInDash } = useRates();
    const { getUserLabel } = useContacts();
    const hover = ref(false);
    const store = useStore();
    const router = useRouter();

    return {
      duffsInDash,
      getUserLabel,
      checkmarkDoneOutline,
      chevronDownOutline,
      hover,
      store,
      router,
      // showReplyMenu,
      // isReplyMenuOpen,
      // replyMenuEvent,
    };
  },
};
</script>

<style scoped>
.chat_timestamp_message {
  margin: 5px 4px 0px 13px;
}
.nowrap {
  display: flex;
  flex-wrap: nowrap;
  float: right;
}
.chevron {
  width: 40px;
  height: 20px;
  color: #818c99;
}
ion-icon {
  color: rgba(0, 0, 0, 0.4);
}
sc-ion-popover-md-h {
  --width: 134px;
  --border-radius: 10px;
}
.sc-ion-popover-md-h {
  --width: 134px;
}
ion-popover .menu {
  --width: 134px;
  width: 134px;
  --height: 90px;
  --box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.08), 0px 4px 8px rgba(0, 0, 0, 0.16);
}
/* .sc-ion-popover-md-h { */
.popover-viewport.sc-ion-popover-md {
  width: 134px;
  height: 90px;
  border-radius: 10px;
}
.menu .custom-class {
  border-radius: 10px;
  width: 134px;
  height: 90px;
}
.reply {
  /* font-family: Inter; */
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  line-height: 12px;
  border-left: 2px solid #6c69fc;
  padding-left: 8px;
  margin-bottom: 6px;
}
.replied {
  color: #818c99;
  margin-bottom: 5px;
}
.message {
  margin: 3px 6px 6px 0px;
  color: #000000;
}
.singleline {
  float: none;
}
.verticalline {
  border-left: 2px solid #6c69fc;
  padding-left: 8px;
}
</style>
