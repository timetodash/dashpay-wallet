import { ref, computed, unref } from "vue";
import { strict as assert } from "assert";
import { getClient, getClientIdentity, getClientOpts } from "../lib/DashClient";
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

  const myLabel = computed(() => store.getters.myLabel);

  const myAvatar = computed(() => store.getters.myAvatar);

  const myDisplayName = computed(() => store.getters.myDisplayName);

  const myPublicMessage = computed(() => store.getters.myPublicMessage);

  const myOwnerId = computed(() => store.getters.myOwnerId);

  const storeDashpayProfile = async (profile: any) => {
    const existingProfile = store.state.dashpayProfiles[myOwnerId.value];
    interface DocumentBatch {
      create: any[];
      replace: any[];
      delete: any[];
    }

    const documentBatch: DocumentBatch = {
      create: [], // Document(s) to create
      replace: [], // Document(s) to update
      delete: [], // Document(s) to delete
    };

    if (existingProfile) {
      // console.log("existingProfile :>> ", existingProfile);

      existingProfile.data = { ...existingProfile.data, ...profile };

      // console.log("existingProfile :>> ", existingProfile);

      documentBatch.replace.push(existingProfile);
    } else {
      const document = await getClient().platform?.documents.create(
        "dashpay.profile",
        getClientIdentity(),
        profile
      );
      documentBatch.create.push(document);
    }

    // console.log("documentBatch :>> ", documentBatch);

    // Sign and submit the document(s)
    const result = await getClient().platform?.documents.broadcast(
      documentBatch,
      getClientIdentity()
    );
    // console.log("result storeDashpayProfile :>> ", result);
    const ownerId = result.ownerId;
    const resultProfileDocument = { ...result.transitions[0], ownerId };

    // store.commit("setDashpayProfiles", [resultProfileDocument]);
    store.dispatch("fetchDashpayProfiles", {
      ownerIds: [ownerId.toString()],
      forceRefresh: true,
    });
    return result;
  };

  async function syncContactRequestsLoop() {
    if (!isRefreshLoopActive) return;
    // console.log("syncContactRequestsLoop");

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

    // console.log("startSyncContactRequests");
    if (!client) client = getClient();
    // console.log("got a client startSyncContactRequests", isRefreshLoopActive);
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
    myLabel,
    myAvatar,
    myOwnerId,
    myDisplayName,
    myPublicMessage,
    storeDashpayProfile,
  };
}
