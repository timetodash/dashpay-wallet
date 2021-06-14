import { ref, computed } from "vue";
import { strict as assert } from "assert";
import { getClient } from "../lib/DashClient";
import { useStore } from "vuex";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let client: any;

let isRefreshLoopActive = false;

export default function useChats() {
  const store = useStore();
  console.log("store :>> ", store);
  async function syncChatsLoop() {
    if (!isRefreshLoopActive) return;
    console.log("syncChatsLoop");
    store.dispatch("syncChats");
    await sleep(10000);
    syncChatsLoop();
  }

  function startSyncChats() {
    assert(
      !isRefreshLoopActive,
      "Error: syncChats refresh loop already running!"
    );

    console.log("startSyncChats");
    if (!client) client = getClient();
    console.log("got a client startSyncChats", isRefreshLoopActive);
    isRefreshLoopActive = true;

    syncChatsLoop();
  }

  function stopSyncChats() {
    isRefreshLoopActive = false;
  }

  const chatMsgs = computed(() => (friendOwnerId: string) => {
    console.log("friendOwnerId :>> ", friendOwnerId);
    console.log(store.state.chats.msgsByOwnerId[friendOwnerId]);
    return store.state.chats.msgsByOwnerId[friendOwnerId];
  });

  console.log("chatMsgs :>> ", chatMsgs);

  return {
    startSyncChats,
    stopSyncChats,
    chatMsgs,
  };
}
