import { ref, computed } from "vue";
import { strict as assert } from "assert";
import { getClient, getClientIdentity } from "../lib/DashClient";
import { useStore } from "vuex";
import useRates from "@/composables/rates";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createContactRequest } = require("../lib/crypto/dashpay-crypto");

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let client: any;

let isRefreshLoopActive = false;

export default function useChats() {
  const store = useStore();

  const { dashInDuffs, getFiatSymbol, duffsInFiatNumber } = useRates();

  console.log("store :>> ", store);

  const sentContactRequest = computed(
    () => store.getters.getSentContactRequest
  );

  const receivedContactRequest = computed(
    () => store.getters.getReceivedContactRequest
  );

  const getChatMsgs = computed(() => store.getters.getChatMsgs);

  const getChatMsgById = computed(() => store.getters.getChatMsgById);

  const getRequestByReplyToId = computed(
    () => store.getters.getRequestByReplyToId
  );

  async function syncChatsLoop() {
    if (!isRefreshLoopActive) return;
    console.log("syncChatsLoop");
    store.dispatch("syncChats");
    await sleep(5000);
    syncChatsLoop();
  }

  function startSyncChats() {
    assert(
      !isRefreshLoopActive,
      "Error: syncChats refresh loop already running!"
    );

    console.log("startSyncChats");
    isRefreshLoopActive = true;

    syncChatsLoop();
  }

  function stopSyncChats() {
    isRefreshLoopActive = false;
  }

  const sendChat = async (
    chatText: string,
    friendOwnerId: string,
    amount = 0,
    request = "", // TODO type as enum
    replyToChatId = ""
  ) => {
    console.log("sendChat", { chatText, friendOwnerId, amount, request });

    const client = getClient();
    // console.log("logged in with mnemonic :>> ", client?.wallet?.exportWallet());

    const duffs = dashInDuffs.value(amount);

    const docProperties = {
      text: chatText,
      txId: "",
      replyToChatId,
      toOwnerId: friendOwnerId,
      amount: amount ? duffs : undefined,
      request: request || undefined,
      fiatSymbol: getFiatSymbol.value || undefined,
      fiatAmount: duffsInFiatNumber.value(duffs) || undefined,
    };

    console.log("sendChat docProperties :>> ", docProperties);

    const document = await client.platform?.documents.create(
      "dashpayWallet.chat",
      getClientIdentity(),
      docProperties
    );

    console.log("sendChat document :>> ", document);

    store.commit("setChatMsgs", [{ ...document, _state: "sending" }]);

    const documentBatchMsgOnly = {
      create: [document],
      replace: [],
      delete: [],
    };

    let documentBatchToSend;

    // Attach contact request if we haven't sent one before
    if (!store.getters.getSentContactRequest(friendOwnerId)) {
      const contactRequest = await createContactRequest(
        client,
        getClientIdentity(),
        friendOwnerId
      );

      documentBatchToSend = {
        create: [document, contactRequest],
        replace: [],
        delete: [],
      };
    } else documentBatchToSend = documentBatchMsgOnly;

    console.log("sendChat broadcasting", {
      documentBatchToSend,
      clientIdenity: getClientIdentity(),
    });

    // Broadcast document with potentially attached contactRequest
    // Catch duplicate contactRequest error and only broadcast chatMsg
    let result;
    try {
      result = await client.platform?.documents.broadcast(
        documentBatchToSend,
        getClientIdentity()
      );

      console.log("sendChat documentBatchToSend result :>> ", result);

      // On successful ST immediately set the contactRequest in state to speed up UX
      if (result.transitions[1]?.type === "contactRequest") {
        const newContactRequestSent = {
          ...result.transitions[1],
          ownerId: result.ownerId,
        };
        console.log("newContactRequestSent :>> ", newContactRequestSent);
        store.commit("setContactRequestSent", newContactRequestSent);
      }

      // Commit broadcast msg State Transistion directly to state to speed up UX
      const chatSent = result.transitions[0];

      chatSent.ownerId = result.ownerId;

      chatSent._state = "sent";

      store.commit("setChatMsgs", [chatSent]);
    } catch (e) {
      // Catch duplicate contactRequest error and only broadcast chatMsg
      if (e.data.errors[0].name === "DuplicateDocumentError") {
        try {
          result = await client.platform?.documents.broadcast(
            documentBatchMsgOnly,
            getClientIdentity()
          );
          // Commit broadcast msg State Transistion directly to state to speed up UX
          const chatSent = result.transitions[0];

          chatSent.ownerId = result.ownerId;

          chatSent._state = "sent";

          store.commit("setChatMsgs", [chatSent]);

          console.log("sendChat documentBatchMsgOnly result :>> ", result);
        } catch (e) {
          store.commit("setChatMsgs", [{ ...document, _state: "error" }]);
          throw e;
        }
      } else {
        throw e;
      }
    }

    // debugger;
  };

  return {
    startSyncChats,
    stopSyncChats,
    sendChat,
    getChatMsgs,
    getChatMsgById,
    getRequestByReplyToId,
    sentContactRequest,
    receivedContactRequest,
  };
}
