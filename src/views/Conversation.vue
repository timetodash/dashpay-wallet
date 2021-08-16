<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <chat-header :friendOwnerId="friendOwnerId"></chat-header>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-start ion-padding-end">
      <ChatBubbles
        :chatMsgs="getChatMsgs(friendOwnerId)"
        :friendOwnerId="friendOwnerId"
      ></ChatBubbles>
    </ion-content>
    <ion-action-sheet
      :is-open="isSendRequestDashSheetOpen"
      header="Send / Request"
      :buttons="sendAndRequestButtons"
      @didDismiss="showSendRequestDashSheet(false)"
    >
    </ion-action-sheet>
    <ion-modal
      :is-open="isSendRequestDashModalOpen"
      @didDismiss="showSendRequestDashModal(false)"
    >
      <SendRequestDashModal
        :initSendRequestDirection="sendRequestDirection"
        :friendOwnerId="friendOwnerId"
        @handleSendRequest="handleSendRequest"
      ></SendRequestDashModal>
    </ion-modal>
    <ion-footer class="ion-no-border">
      <chat-footer
        :receivedContactRequest="receivedContactRequest(friendOwnerId)"
        :sentContactRequest="sentContactRequest(friendOwnerId)"
        :friendOwnerId="friendOwnerId"
        @send-chat-wrapper="sendChatWrapper"
        @showSendRequestDashSheet="showSendRequestDashSheet"
      ></chat-footer>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import { onMounted, ref, watchEffect, watch, computed } from "vue";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonActionSheet,
  IonFooter,
  IonModal,
} from "@ionic/vue";

import { getClient, getClientIdentity } from "@/lib/DashClient";

// import {} from "ionicons/icons";

import { useRoute } from "vue-router";
import { useStore } from "vuex";
import useChats from "@/composables/chats";
import ChatBubbles from "@/components/Chat/ChatBubbles.vue";
import ChatHeader from "@/components/Chat/ChatHeader.vue";
import ChatFooter from "@/components/Chat/ChatFooter.vue";
import SendRequestDashModal from "@/components/TransactionModals/SendRequestModal.vue";

// import { Client } from "dash/dist/src/SDK/Client/index";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
  name: "Conversation",
  components: {
    IonHeader,
    IonToolbar,
    IonContent,
    IonPage,
    ChatBubbles,
    ChatHeader,
    ChatFooter,
    IonActionSheet,
    SendRequestDashModal,
    IonModal,
    IonFooter,
  },
  setup() {
    // const client = getClient();

    // const clientIdentity = getClientIdentity();

    // const router = useRouter();

    const route = useRoute();

    const store = useStore();

    const getUserLabel = computed(() => store.getters.getUserLabel);

    const friendOwnerId = ref(route.params.friendOwnerId as string);

    const {
      getChatMsgs,
      sendChat,
      sentContactRequest,
      receivedContactRequest,
    } = useChats();

    const chatText = ref("");

    watch(
      () => route.params.friendOwnerId,
      () => {
        if (route.params.friendOwnerId) {
          friendOwnerId.value = route.params.friendOwnerId as string;

          // Resolve friend if still unknown
          store.dispatch("fetchDPNSDoc", friendOwnerId.value);
          store.dispatch("fetchDashpayProfiles", {
            ownerIds: [friendOwnerId.value],
          });
        }
      }
    );

    // Mark msgs as read
    watchEffect(() => {
      console.log("watcheffect friendOwnerId.value :>> ", friendOwnerId.value);
      console.log(
        "watcheffect store.getters.getChatMsgs(friendOwnerId.value) length :>> ",
        store.getters.getChatMsgs(friendOwnerId.value).length,
        store.getters.getChatMsgs(friendOwnerId.value)
      );
      if (!(store.getters.getChatMsgs(friendOwnerId.value).length > 0)) return;

      const getLastMsgTimestamp = (msgs: any[]) => {
        return msgs[msgs.length - 1].createdAt.getTime();
      };

      const lastTimestamp = getLastMsgTimestamp(
        store.getters.getChatMsgs(friendOwnerId.value)
      );

      store.commit("setLastSeenChatTimestampByOwnerId", {
        lastTimestamp,
        friendOwnerId: friendOwnerId.value,
      });

      store.dispatch("saveLastSeenChatTimestamps");
    });

    // Handle the Dash Button
    const isSendRequestDashSheetOpen = ref(false);

    const isSendRequestDashModalOpen = ref(false);

    const showSendRequestDashSheet = async (state: boolean) => {
      isSendRequestDashSheetOpen.value = state;
    };
    const sendRequestDirection = ref("");

    const showSendRequestDashModal = async (
      state = true,
      direction: string
    ) => {
      sendRequestDirection.value = direction;
      isSendRequestDashModalOpen.value = state;
    };

    const showSendDashModal = async () => {
      showSendRequestDashModal(true, "send");
    };

    const showRequestDashModal = async () => {
      showSendRequestDashModal(true, "request");
    };

    const sendAndRequestButtons = [
      { text: "Send", handler: showSendDashModal },
      { text: "Request", handler: showRequestDashModal },
    ];
    const sendChatWrapper = (message: string, amount: number, request: any) => {
      // TODO add types

      const replyToChatId = store.getters.getActiveReplyToId(
        friendOwnerId.value
      );

      console.log(
        "message: string, amount: number, request: any",
        message,
        amount,
        request,
        replyToChatId
      );
      sendChat(message, friendOwnerId.value, amount, request, replyToChatId);

      // reset the friend's replyToId
      store.commit("setActiveReplyToId", {
        friendOwnerId: friendOwnerId.value,
        replyToId: undefined,
      });
    };
    const handleSendRequest = (event: any) => {
      console.log("event :>> ", event);
      const request = event.sendRequestDirection === "request" ? "open" : "";
      console.log("request :>> ", request);
      console.log(
        "sendChat",
        event.message,
        friendOwnerId.value,
        event.amount,
        request
      );
      sendChatWrapper(event.message, event.amount, request); // TODO add replyToChatId for requests
    };

    // onMounted(async () => {});

    return {
      chatText,
      sendChatWrapper,
      showSendRequestDashSheet,
      friendOwnerId,
      getChatMsgs,
      getUserLabel,
      store,
      sendAndRequestButtons,
      isSendRequestDashSheetOpen,
      isSendRequestDashModalOpen,
      showSendRequestDashModal,
      handleSendRequest,
      sendRequestDirection,
      showRequestDashModal,
      showSendDashModal,
      sentContactRequest,
      receivedContactRequest,
    };
  },
};
</script>

<style scoped>
/* ion-header {
  padding-top: 16px;
  padding-left: 0px;
  background-color: #f7f7f7;
  border: 1px solid #e3e3e3;
}

ion-toolbar {
  --background: primary;
} */
/* removes the shadow below the header */
/* .header-md::after {
  height: 0px;
  border-style: solid 2px;
} */
ion-footer {
  padding: 0px 0px 8px 16px;
}
</style>
