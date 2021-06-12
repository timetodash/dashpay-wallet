import { createStore } from "vuex";
import {
  getClientOpts,
  initClient,
  getClient,
  getClientIdentity,
} from "@/lib/DashClient";

const state = {
  accountDPNS: null,
  balance: null,
  wishName: null,
  dpns: {},
  contactRequests: {
    received: {},
    sent: {},
    lastTimestampReceived: 0,
    lastTimestampSent: 0,
  },
  chats: {
    msgsByOwnerId: {},
    lastTimestamp: 0,
  },
};
interface ChatMsgsMutation {
  chatMsgs: [];
  ownerId: string;
}

const mutations = {
  setAccountDPNS(state: any, accountDPNS: any) {
    state.accountDPNS = accountDPNS;
  },
  setDPNS(state: any, dpnsDoc: any) {
    state.dpns[dpnsDoc.ownerId.toString()] = dpnsDoc;
  },
  setWishName(state: any, wishName: string) {
    state.wishName = wishName;
  },
  setContactRequestReceived(state: any, contactRequest: any) {
    const contactOwnerId = contactRequest.ownerId.toString();

    state.contactRequests.received[contactOwnerId] = contactRequest;
  },
  setContactRequestSent(state: any, contactRequest: any) {
    const contactOwnerId = contactRequest.data.toUserId.toString();

    state.contactRequests.sent[contactOwnerId] = contactRequest;
  },
  setContactRequestReceivedLastTimestamp(state: any, timestamp: Date) {
    state.contactRequests.lastTimestampReceived = timestamp;
  },
  setContactRequestSentLastTimestamp(state: any, timestamp: number) {
    console.log("timestamp :>> ", timestamp);
    state.contactRequests.lastTimestampSent = timestamp;
  },
  setChatMsgs(state: any, chatMsgs: any) {
    // Collate the chats by the otherOwnerId
    const myOwnerId = state.accountDPNS.$ownerId;

    chatMsgs.forEach((chatMsg: any) => {
      let otherOwnerId: string;

      if (chatMsg.ownerId.toString() === myOwnerId)
        otherOwnerId = chatMsg.data.toOwnerId;
      else otherOwnerId = chatMsg.ownerId.toString();

      state.chats.msgsByOwnerId[otherOwnerId] = (
        state.chats.msgsByOwnerId[otherOwnerId] || []
      ).concat(chatMsg);
    });

    console.log("state.chats.msgsByOwnerId :>> ", state.chats.msgsByOwnerId);
  },
  setChatMsgsLatTimestamp(state: any, timestamp: Date) {
    state.chats.lastTimestamp = timestamp;
  },
};

const actions = {
  async syncChats(context: any) {
    const client = getClient();
    const myOwnerId = context.state.accountDPNS.$ownerId;

    console.log("context.state :>> ", context.state);

    const { lastTimestamp } = context.state.chats;

    const promiseSent = client?.platform?.documents.get("dashpayWallet.chat", {
      where: [
        ["$ownerId", "==", myOwnerId],
        ["$createdAt", ">", lastTimestamp],
      ],
    });

    const promiseReceived = client?.platform?.documents.get(
      "dashpayWallet.chat",
      {
        where: [
          ["toOwnerId", "==", myOwnerId],
          ["$createdAt", ">", lastTimestamp],
        ],
        orderBy: [["$createdAt", "desc"]],
      }
    );

    const [resultSent, resultReceived] = await Promise.all([
      promiseSent,
      promiseReceived,
    ]);

    console.log("resultSent :>> ", resultSent);

    console.log("resultReceived :>> ", resultReceived);

    const results = [...resultSent, ...resultReceived].sort(
      (a, b) => a.createdAt - b.createdAt
    );

    console.log("results :>> ", results);

    if (results.length > 0) {
      context.commit("setChatMsgs", results);
      context.commit(
        "setChatMsgsLatTimestamp",
        results[results.length - 1].createdAt.getTime()
      );
    }
  },
  async syncContactRequests(context: any) {
    const client = getClient();

    console.log("context.state :>> ", context.state);

    const {
      lastTimestampReceived,
      lastTimestampSent,
    } = context.state.contactRequests;

    const promiseSent = client?.platform?.documents.get(
      "dashpay.contactRequest",
      {
        where: [
          ["$ownerId", "==", context.state.accountDPNS.$ownerId],
          ["$createdAt", ">", lastTimestampSent],
        ],
      }
    );

    const promiseReceived = client?.platform?.documents.get(
      "dashpay.contactRequest",
      {
        where: [
          ["toUserId", "==", context.state.accountDPNS.$ownerId],
          ["$createdAt", ">", lastTimestampReceived],
        ],
      }
    );

    const [resultSent, resultReceived] = await Promise.all([
      promiseSent,
      promiseReceived,
    ]);

    console.log("resultSent :>> ", resultSent);

    console.log("resultReceived :>> ", resultReceived);

    resultSent.forEach((contactRequest: any) => {
      context.commit("setContactRequestSent", contactRequest);

      context.commit(
        "setContactRequestSentLastTimestamp",
        contactRequest.createdAt.getTime()
      );

      context.dispatch("fetchDPNSDoc", contactRequest.data.toUserId.toString());
    });

    resultReceived.forEach((contactRequest: any) => {
      context.commit("setContactRequestReceived", contactRequest);

      context.commit(
        "setContactRequestReceivedLastTimestamp",
        contactRequest.createdAt.getTime()
      );

      context.dispatch("fetchDPNSDoc", contactRequest.ownerId.toString());
    });
  },
  async fetchDPNSDoc(context: any, ownerId: string) {
    // If dpnsDoc is already cached, don't hit DAPI again
    if (context.state.dpns[ownerId]) return;

    const client = getClient();
    const [dpnsDoc] = await client?.platform?.names.resolveByRecord(
      "dashUniqueIdentityId",
      ownerId
    );
    console.log("fetchDPNSDoc dpnsDoc :>> ", dpnsDoc);

    if (dpnsDoc) context.commit("setDPNS", dpnsDoc);
  },
};

const getters = {
  name: (state: any) => state.accountDPNS?.label,
  identityId: (state: any) => state.accountDPNS?.$ownerId,
  getUserLabel: (state: any) => (ownerId: any) => {
    console.log("getUserLabel ownerId :>> ", ownerId);
    return (state.dpns as any)[ownerId]?.data.label ?? ownerId.substr(0, 6);
  },
};

export default createStore({
  state,
  getters,
  actions,
  mutations,
});
