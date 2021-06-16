import { ref, computed } from "vue";
import { strict as assert } from "assert";
import { getClient } from "../lib/DashClient";
import { useStore } from "vuex";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let client: any;

let isRefreshLoopActive = false;

export default function useChats(
  friendOwnerId: string | undefined = undefined
) {
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

  const chatMsgs = computed(() => store.getters.getChatMsgs(friendOwnerId));

  return {
    startSyncChats,
    stopSyncChats,
    chatMsgs,
  };
}
