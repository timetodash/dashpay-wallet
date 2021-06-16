import { createStore } from "vuex";
import { getClient } from "@/lib/DashClient";

const state = {
  accountDPNS: null,
  balance: null,
  wishName: null,
  dpns: {},
  dashpayProfiles: {},
  contactRequests: {
    received: {},
    sent: {},
    lastTimestampReceived: 0,
    lastTimestampSent: 0,
  },
  chats: {
    msgsByOwnerId: {},
    lastTimestamp: 0,
    lastSeenTimestampByOwnerId: {},
  },
  chatList: [{ id: "legacy" }],
};
interface SetLastSeenTimestampByOwnerIdMutation {
  friendOwnerId: string;
  timestamp: number;
}

const mutations = {
  setLastSeenChatTimestampByOwnerId(
    state: any,
    { friendOwnerId, timestamp }: SetLastSeenTimestampByOwnerIdMutation
  ) {
    state.chats.lastSeenTimestampByOwnerId[friendOwnerId] = timestamp;
  },
  sortChatList(state: any) {
    console.log("sortChatList start");
    const chatList: any = [];
    Object.entries(state.chats.msgsByOwnerId).forEach((entry) => {
      const friendOwnerId = entry[0];
      console.log("friendOwnerId :>> ", friendOwnerId);

      const chatMsgs = entry[1] as [];

      const lastMessage: any = chatMsgs[chatMsgs.length - 1];
      console.log("entry[1] :>> ", entry[1]);
      console.log("lastMessage :>> ", lastMessage);

      const direction =
        lastMessage.ownerId.toString() === friendOwnerId ? "RECEIVED" : "SENT";

      const contactRequestReceived =
        state.contactRequests.received[friendOwnerId];

      const contactRequestSent = state.contactRequests.sent[friendOwnerId];

      const friendshipState =
        contactRequestReceived && contactRequestSent ? "LINKED" : "UNLINKED";

      const chatListItem = {
        id: lastMessage.id.toString(),
        friendOwnerId,
        lastMessage,
        direction,
        friendshipState,
        contactRequestReceived,
        contactRequestSent,
      };

      console.log("chatListItem :>> ", chatListItem);

      // Only add items with existing contactRequests
      if (
        chatListItem.contactRequestReceived ||
        chatListItem.contactRequestSent
      ) {
        chatList.push(chatListItem);
      }
    });

    const chatListSorted = chatList.sort(
      (a: any, b: any) => b.lastMessage.createdAt - a.lastMessage.createdAt
    );

    console.log("sortChatList chatListSorted :>> ", chatListSorted);
    // debugger;

    chatListSorted.push({ id: "legacy" });

    state.chatList = chatListSorted;
  },
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
    const friendOwnerId = contactRequest.ownerId.toString();

    state.contactRequests.received[friendOwnerId] = contactRequest;
  },
  setContactRequestSent(state: any, contactRequest: any) {
    const friendOwnerId = contactRequest.data.toUserId.toString();

    state.contactRequests.sent[friendOwnerId] = contactRequest;
  },
  setContactRequestReceivedLastTimestamp(state: any, timestamp: Date) {
    state.contactRequests.lastTimestampReceived = timestamp;
  },
  setContactRequestSentLastTimestamp(state: any, timestamp: number) {
    console.log("timestamp :>> ", timestamp);
    state.contactRequests.lastTimestampSent = timestamp;
  },
  setChatMsgs(state: any, chatMsgs: any) {
    // Collate the chats by the friendOwnerId
    const myOwnerId = state.accountDPNS.$ownerId;

    chatMsgs.forEach((chatMsg: any) => {
      let friendOwnerId: string;

      if (chatMsg.ownerId.toString() === myOwnerId)
        friendOwnerId = chatMsg.data.toOwnerId;
      else friendOwnerId = chatMsg.ownerId.toString();

      state.chats.msgsByOwnerId[friendOwnerId] = (
        state.chats.msgsByOwnerId[friendOwnerId] || []
      ).concat(chatMsg);
    });

    console.log("state.chats.msgsByOwnerId :>> ", state.chats.msgsByOwnerId);
  },
  setChatMsgsLatTimestamp(state: any, timestamp: Date) {
    state.chats.lastTimestamp = timestamp;
  },
  setDashpayProfiles(state: any, dashpayProfiles: any) {
    console.log("setDashpayProfiles", dashpayProfiles);
    dashpayProfiles.forEach((profile: any) => {
      console.log("profile :>> ", profile);
      state.dashpayProfiles[profile.ownerId.toString()] = profile;
    });
  },
};

const actions = {
  async fetchDashpayProfiles(context: any, ownerIds: any) {
    console.log("fetchDashpayProfiles", ownerIds);

    const client = getClient();

    const profilePromises = ownerIds
      .filter(
        (ownerId: any) => !(ownerId.toString() in context.state.dashpayProfiles)
      )
      .map((ownerId: any) =>
        client?.platform?.documents.get("dashpay.profile", {
          where: [["$ownerId", "==", ownerId.toString()]],
        })
      );

    console.log("profilePromises :>> ", profilePromises);

    const results = (await Promise.all(profilePromises))
      .map((x: any) => x[0])
      .filter((x) => !!x);

    console.log("results :>> ", results);

    context.commit("setDashpayProfiles", results);

    console.log(
      "context.state.dashpayProfiles :>> ",
      context.state.dashpayProfiles
    );
  },
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
      context.commit("sortChatList");
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

    const resultSentFriendOwnerIds = resultSent.map((contactRequest: any) =>
      contactRequest.data.toUserId.toString()
    );

    context.dispatch("fetchDashpayProfiles", resultSentFriendOwnerIds); // use identifier and 'in' operator

    resultReceived.forEach((contactRequest: any) => {
      context.commit("setContactRequestReceived", contactRequest);

      context.commit(
        "setContactRequestReceivedLastTimestamp",
        contactRequest.createdAt.getTime()
      );

      context.dispatch("fetchDPNSDoc", contactRequest.ownerId.toString());
    });

    const resultReceivedFriendOwnerIds = resultReceived.map(
      (contactRequest: any) => contactRequest.ownerId.toString()
    );

    context.dispatch("fetchDashpayProfiles", resultReceivedFriendOwnerIds); // use identifier and 'in' operator

    if (resultReceived.length > 0 || resultSent.length > 0)
      context.commit("sortChatList");
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
  getNewChatMsgCount: (state: any) => (friendOwnerId: string) => {
    const lastTimestamp = new Date(
      state.chats.lastSeenTimestampByOwnerId[friendOwnerId] || 0
    );

    return state.chats.msgsByOwnerId[friendOwnerId].filter(
      (chat: any) =>
        chat.createdAt > lastTimestamp &&
        chat.ownerId.toString() === friendOwnerId
    ).length;
  },
  getChatMsgs: (state: any) => (friendOwnerId: string) => {
    return ((state.chats as any).msgsByOwnerId[friendOwnerId] ?? []).map(
      (chat: any) => {
        const direction =
          chat.ownerId.toString() === friendOwnerId ? "RECEIVED" : "SENT";

        return {
          ...chat,
          _friendOwnerId: friendOwnerId,
          _direction: direction,
        };
      }
    );
  },
  getUserLabel: (state: any) => (ownerId: any) => {
    return (state.dpns as any)[ownerId]?.data.label ?? ownerId.substr(0, 6);
  },
  getUserAvatar: (state: any) => (ownerId: any) => {
    return (
      (state.dashpayProfiles as any)[ownerId.toString()]?.data.avatarUrl ??
      "/assets/defaults/avataaar.png"
    );
  },
  myAvatar: (state: any) => {
    return (
      (state.dashpayProfiles as any)[state.accountDPNS.$ownerId]?.data
        .avatarUrl ?? "/assets/defaults/avataaar.png"
    );
  },
};

export default createStore({
  state,
  getters,
  actions,
  mutations,
});
