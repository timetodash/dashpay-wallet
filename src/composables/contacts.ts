import { ref, computed } from "vue";
import { strict as assert } from "assert";
import { getClient } from "../lib/DashClient";
import { useStore } from "vuex";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let client: any;

let isRefreshLoopActive = false;

export default function useContacts() {
  const store = useStore();

  const getUserPublicMessage = computed(
    () => store.getters.getUserPublicMessage
  );

  const getUserDisplayName = computed(() => store.getters.getUserDisplayName);

  const getUserLabel = computed(() => store.getters.getUserLabel);

  const getUserAvatar = computed(() => store.getters.getUserAvatar);

  const getMyFriends = computed(() => store.getters.getMyFriends);

  const getSuggestedFriends = computed(() => store.getters.getSuggestedFriends);

  async function syncContactRequestsLoop() {
    if (!isRefreshLoopActive) return;
    console.log("syncContactRequestsLoop");

    await store.dispatch("syncContactRequests");

    Object.entries(store.state.contactRequests.sent).forEach(
      async ([myOwnerId, contactRequest]) => {
        await store.dispatch(
          "fetchContactRequestsSent",
          (contactRequest as any).data.toUserId.toString()
        );
      }
    );

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
    getMyFriends,
    getSuggestedFriends,
    getUserLabel,
    getUserAvatar,
    getUserDisplayName,
    getUserPublicMessage,
  };
}
