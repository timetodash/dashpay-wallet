import { ref, computed } from "vue";
import { strict as assert } from "assert";
import { getClient } from "../lib/DashClient";
import { useStore } from "vuex";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let client: any;

let isRefreshLoopActive = false;

export default function useContacts() {
  const store = useStore();
  console.log("store :>> ", store);
  async function syncContactRequestsLoop() {
    if (!isRefreshLoopActive) return;
    console.log("syncContactRequestsLoop");
    store.dispatch("syncContactRequests");
    await sleep(10000);
    syncContactRequestsLoop();
  }

  function startSyncContactRequests() {
    assert(
      !isRefreshLoopActive,
      "Error: syncConttactRequests refresh loop already running!"
    );

    console.log("startSyncContactRequests");
    if (!client) client = getClient();
    console.log("got a client startSyncContactRequests", isRefreshLoopActive);
    isRefreshLoopActive = true;

    syncContactRequestsLoop();
  }

  function stopSyncContactRequestsLoop() {
    isRefreshLoopActive = false;
  }

  return {
    startSyncContactRequests,
    stopSyncContactRequestsLoop,
  };
}
