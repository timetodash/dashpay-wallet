import { createStore } from "vuex";
import { getClient } from "@/lib/DashClient";
import { Storage } from "@capacitor/storage";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const getDefaultState = () => {
  return {
    accountDPNS: null,
    balance: null, // TODO deprecated, remove
    wishName: null,
    isMnemonicBackedUp: false,
    dpns: {},
    dashpayProfiles: {},
    socialGraph: {
      sentByOwnerId: {},
      suggestedContacts: [], //ordered by common connections
    },
    contactRequests: {
      received: {},
      sent: {},
      lastTimestampReceived: 0,
      lastTimestampSent: 0,
    },
    chats: {
      msgsByOwnerId: {},
      msgsByDocumentId: {},
      msgsByReplyToId: {},
      lastTimestamp: 0,
      lastSeenTimestampByOwnerId: {},
    },
    chatList: [{ id: "legacy" }],
    fiatRate: {},
    fiatSymbol: "",
    activeReplyToIds: {}, // The msgId we reply to, one per contact
  };
};

const state = getDefaultState();
interface SetLastSeenTimestampByOwnerIdMutation {
  friendOwnerId: string;
  lastTimestamp: number;
}

interface SetActiveReplyToIdMutation {
  friendOwnerId: string; // TODO use id regexp
  replyToId: string | undefined;
}

const mutations = {
  setActiveReplyToId(state: any, payload: SetActiveReplyToIdMutation) {
    state.activeReplyToIds[payload.friendOwnerId] = payload.replyToId;
  },
  setIsMnemonicBackedUp(state: any, newState: boolean) {
    state.isMnemonicBackedUp = newState;
  },
  resetStateKeepAccountDPNS(state: any) {
    const newState = getDefaultState();
    newState.accountDPNS = state.accountDPNS;
    newState.dpns = state.dpns;
    Object.assign(state, newState);
  },
  resetStateKeepDashpayProfiles(state: any) {
    const newState = getDefaultState();
    newState.dashpayProfiles = state.dashpayProfiles;
    newState.dpns = state.dpns;
    Object.assign(state, newState);
  },
  resetState(state: any) {
    Object.assign(state, getDefaultState());
  },
  setFiatSymbol(state: any, symbol: string) {
    state.fiatSymbol = symbol;
  },
  setFiatRate(state: any, rate: any) {
    state.fiatRate[rate.quoteCurrency] =
      state.fiatRate[rate.quoteCurrency] || {};

    state.fiatRate[rate.quoteCurrency] = rate;
  },
  setLastSeenChatTimestampObject(state: any, obj: any) {
    state.chats.lastSeenTimestampByOwnerId = obj;
  },
  setLastSeenChatTimestampByOwnerId(
    state: any,
    { friendOwnerId, lastTimestamp }: SetLastSeenTimestampByOwnerIdMutation
  ) {
    state.chats.lastSeenTimestampByOwnerId[friendOwnerId] = lastTimestamp;
  },
  sortChatList(state: any) {
    // console.log("sortChatList start");
    const chatList: any = [];
    Object.entries(state.chats.msgsByOwnerId).forEach((entry) => {
      const friendOwnerId = entry[0];
      // console.log("friendOwnerId :>> ", friendOwnerId);

      const chatMsgs = entry[1] as [];

      const lastMessage: any = chatMsgs[chatMsgs.length - 1];
      // console.log("entry[1] :>> ", entry[1]);
      // console.log("lastMessage :>> ", lastMessage);

      const direction =
        lastMessage.ownerId.toString() === friendOwnerId ? "RECEIVED" : "SENT";

      const contactRequestReceived =
        state.contactRequests.received[friendOwnerId];

      const contactRequestSent = state.contactRequests.sent[friendOwnerId];

      const friendshipState =
        contactRequestReceived && contactRequestSent ? "LINKED" : "UNLINKED";

      const searchLabel =
        (state.dpns as any)[friendOwnerId]?.data.label ??
        friendOwnerId.substr(0, 6);

      const searchDisplayName = (state.dashpayProfiles as any)[friendOwnerId]
        ?.data.displayName;

      const chatListItem = {
        id: lastMessage.id.toString(),
        friendOwnerId,
        lastMessage,
        direction,
        friendshipState,
        contactRequestReceived,
        contactRequestSent,
        searchLabel,
        searchDisplayName,
      };

      // console.log("chatListItem :>> ", chatListItem);

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

    // console.log("sortChatList chatListSorted :>> ", chatListSorted);
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
  setSocialGraphSent(state: any, contactRequest: any) {
    if (!contactRequest) return;

    const ownerId = contactRequest.ownerId.toString();

    const toUserId = contactRequest.data.toUserId.toString();

    state.socialGraph.sentByOwnerId[ownerId] = state.socialGraph.sentByOwnerId[
      ownerId
    ] || { docs: {}, lastTimestamp: 0 };

    state.socialGraph.sentByOwnerId[ownerId].docs[toUserId] = contactRequest;

    // TODO don't store timestamp if fetch was sorted 'desc', ideally move to different mutation
    state.socialGraph.sentByOwnerId[
      ownerId
    ].lastTimestamp = contactRequest.createdAt.getTime();
  },
  setContactRequestReceivedLastTimestamp(state: any, timestamp: Date) {
    state.contactRequests.lastTimestampReceived = timestamp;
  },
  setContactRequestSentLastTimestamp(state: any, timestamp: number) {
    // console.log("timestamp :>> ", timestamp);
    state.contactRequests.lastTimestampSent = timestamp;
  },
  setChatMsgs(state: any, chatMsgs: any) {
    // Cache documents by $id
    chatMsgs.forEach((chatMsg: any) => {
      const documentId = chatMsg.id.toString();
      state.chats.msgsByDocumentId[documentId] =
        state.chats.msgsByDocumentId[documentId] || {};
      state.chats.msgsByDocumentId[documentId] = chatMsg;

      // Cache documents by replyToId
      if (chatMsg.data.replyToChatId) {
        const replyToChatId = chatMsg.data.replyToChatId;
        state.chats.msgsByReplyToId[replyToChatId] =
          state.chats.msgsByReplyToId[replyToChatId] || {};
        state.chats.msgsByReplyToId[replyToChatId] = chatMsg;
      }

      // Collate the chats by the friendOwnerId
      const myOwnerId = state.accountDPNS.$ownerId;

      let friendOwnerId: string;

      if (chatMsg.ownerId.toString() === myOwnerId)
        friendOwnerId = chatMsg.data.toOwnerId;
      else friendOwnerId = chatMsg.ownerId.toString();

      state.chats.msgsByOwnerId[friendOwnerId] = (
        state.chats.msgsByOwnerId[friendOwnerId] || []
      ).concat(chatMsg);
    });

    // console.log("state.chats.msgsByOwnerId :>> ", state.chats.msgsByOwnerId);
  },
  setChatMsgsLastTimestamp(state: any, timestamp: Date) {
    state.chats.lastTimestamp = timestamp;
  },
  setDashpayProfiles(state: any, dashpayProfiles: any) {
    // console.log("setDashpayProfiles", dashpayProfiles);
    dashpayProfiles.forEach((profile: any) => {
      // console.log("profile :>> ", profile);
      state.dashpayProfiles[profile.ownerId.toString()] = profile;
    });
  },
};

const actions = {
  async loadLastSeenChatTimestamps(context: any) {
    console.log("loadLastSeenChatTimestamps");
    const readResult = await Storage.get({
      key: `lastSeenChatTimestamps_${context.getters.myLabel}`,
    });
    console.log(
      "loadLastSeenChatTimestamps readResult.value :>> ",
      readResult.value
    );
    if (readResult.value) {
      context.commit(
        "setLastSeenChatTimestampObject",
        JSON.parse(readResult.value)
      );
    }
  },
  async saveLastSeenChatTimestamps(context: any) {
    await Storage.set({
      key: `lastSeenChatTimestamps_${context.getters.myLabel}`,
      value: JSON.stringify(context.state.chats.lastSeenTimestampByOwnerId),
    });
  },
  async fetchMsgById(context: any, payload: any) {
    // TODO desctructure and add type
    const msgId = payload.msgId;
    const ownerId = payload.ownerId;

    if (context.state.chats.msgsByDocumentId[msgId]) return; // If cache exists, don't hit DAPI again

    const client = getClient();

    const msg = await client?.platform?.documents.get("dashpayWallet.chat", {
      where: [
        ["toOwnerId", "==", ownerId], // TODO support replying to my own msgs
        ["$id", "==", msgId],
      ],
    });

    context.commit("setChatMsgs", msg);
  },
  async fetchDashpayProfiles(
    context: any,
    { ownerIds = [], forceRefresh = false }
  ) {
    console.log("fetchDashpayProfiles", ownerIds);

    const client = getClient();

    const filteredOwnerIds = forceRefresh
      ? ownerIds
      : ownerIds
          // Filter out ownerIds with already cached profiles
          .filter(
            (ownerId: any) =>
              !(ownerId.toString() in context.state.dashpayProfiles)
          );

    const profilePromises = filteredOwnerIds.map((ownerId: any) =>
      client?.platform?.documents.get("dashpay.profile", {
        where: [["$ownerId", "==", ownerId.toString()]],
      })
    );

    // console.log("profilePromises :>> ", profilePromises);

    const results = (await Promise.all(profilePromises))
      .map((x: any) => x[0])
      .filter((x) => !!x);

    console.log("fetchDashpayProfile results :>> ", results);

    if (results.length > 0) {
      context.commit("setDashpayProfiles", results);
      context.commit("sortChatList"); // TODO optimize performance
    }

    return results; // TODO returned cached entries as well
  },
  async syncChats(context: any) {
    const myOwnerId = context.state.accountDPNS?.$ownerId;

    if (!myOwnerId) return; // Don't sync while we are not logged in

    const client = getClient();

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

    // console.log("resultSent :>> ", resultSent);

    // console.log("resultReceived :>> ", resultReceived);

    const results = [...resultSent, ...resultReceived].sort(
      (a, b) => a.createdAt - b.createdAt
    );

    // console.log("results :>> ", results);

    if (results.length > 0) {
      context.commit("setChatMsgs", results);
      context.commit(
        "setChatMsgsLastTimestamp",
        results[results.length - 1].createdAt.getTime()
      );
      context.commit("sortChatList");
    }
  },
  // async syncSocialGraph(context: any) {},
  async fetchContactRequestsSent(context: any, ownerId: any) {
    const client = getClient();

    const sentByOwnerId = state.socialGraph.sentByOwnerId as any;

    const lastTimestampSent = sentByOwnerId[ownerId]?.lastTimestamp || 0;

    // console.log("fetchContactRequestsSent", ownerId, lastTimestampSent);
    // console.log("dashpay.contactRequest", {
    //   where: [
    //     ["$ownerId", "==", ownerId],
    //     ["$createdAt", ">", lastTimestampSent],
    //   ],
    //   orderBy: [["$createdAt", "asc"]],
    // });
    const resultSent = await client?.platform?.documents.get(
      "dashpay.contactRequest",
      {
        where: [
          ["$ownerId", "==", ownerId],
          ["$createdAt", ">", lastTimestampSent],
        ],
        orderBy: [["$createdAt", "asc"]],
      }
    );

    // console.log(
    //   "fetchContactRequestsSent resultSent :>> ",
    //   resultSent.map((x: any) => x.toJSON())
    // );

    resultSent.forEach((contactRequest: any) => {
      context.commit("setSocialGraphSent", contactRequest);
      context.dispatch("fetchDPNSDoc", contactRequest.data.toUserId.toString()); // TODO fetch using 'in' operator with Identifier
    });

    const resultSentFriendOwnerIds = resultSent.map((contactRequest: any) =>
      contactRequest.data.toUserId.toString()
    );

    context.dispatch("fetchDashpayProfiles", {
      ownerIds: resultSentFriendOwnerIds,
    }); // use identifier and 'in' operator

    if (resultSent.length > 0) {
      await sleep(100);

      await context.dispatch("fetchContactRequestsSent", ownerId);
    }
  },
  async syncContactRequests(context: any) {
    if (!context.state.accountDPNS) return; // Don't sync if we are not logged in

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

    // console.log("resultSent :>> ", resultSent);

    // console.log("resultReceived :>> ", resultReceived);

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

    context.dispatch("fetchDashpayProfiles", {
      ownerIds: resultSentFriendOwnerIds,
    }); // use identifier and 'in' operator

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

    context.dispatch("fetchDashpayProfiles", {
      ownerIds: resultReceivedFriendOwnerIds,
    }); // use identifier and 'in' operator

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
    // console.log("fetchDPNSDoc dpnsDoc :>> ", dpnsDoc);

    if (dpnsDoc) {
      context.commit("setDPNS", dpnsDoc);
      context.commit("sortChatList"); // TODO increase performance
    }
  },
};

const getters = {
  name: (state: any) => state.accountDPNS?.label, // TODO deprecated, remove and refactor
  myLabel: (state: any) => state.accountDPNS?.label,
  myOwnerId: (state: any) => state.accountDPNS?.$ownerId,
  myAvatar: (state: any) => {
    return (
      (state.dashpayProfiles as any)[state.accountDPNS?.$ownerId]?.data
        .avatarUrl ?? "/assets/defaults/avataaar.png"
    );
  },
  myDisplayName: (state: any) => {
    return (
      (state.dashpayProfiles as any)[state.accountDPNS.$ownerId]?.data
        .displayName ?? ""
    );
  },
  myPublicMessage: (state: any) => {
    return (
      (state.dashpayProfiles as any)[state.accountDPNS.$ownerId.toString()]
        ?.data.publicMessage ?? ""
    );
  },
  getUserLabel: (state: any) => (ownerId: string) => {
    return (state.dpns as any)[ownerId]?.data.label ?? ownerId.substr(0, 6);
  },
  getUserDisplayName: (state: any) => (ownerId: string) => {
    return (
      (state.dashpayProfiles as any)[ownerId]?.data.displayName ??
      (state.dpns as any)[ownerId]?.data.label ??
      ownerId.substr(0, 6)
    );
  },

  getUserAvatar: (state: any) => (ownerId: string) => {
    if (!ownerId) return "/assets/defaults/avataaar.png";

    return (
      (state.dashpayProfiles as any)[ownerId.toString()]?.data.avatarUrl ??
      "/assets/defaults/avataaar.png"
    );
  },
  getUserPublicMessage: (state: any) => (ownerId: string) => {
    return (
      (state.dashpayProfiles as any)[ownerId.toString()]?.data.publicMessage ??
      ""
    );
  },
  getSentContactRequest: (state: any) => (friendOwnerId: string) => {
    return (state.contactRequests.sent as any)[friendOwnerId];
  },
  getReceivedContactRequest: (state: any) => (friendOwnerId: string) => {
    return (state.contactRequests.received as any)[friendOwnerId];
  },
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
  getHasNewTx: (state: any) => (friendOwnerId: string) => {
    const lastTimestamp = new Date(
      state.chats.lastSeenTimestampByOwnerId[friendOwnerId] || 0
    );

    return (
      state.chats.msgsByOwnerId[friendOwnerId].filter(
        (chat: any) =>
          chat.createdAt > lastTimestamp &&
          chat.ownerId.toString() === friendOwnerId &&
          chat.data.amount
      ).length > 0
    );
  },
  getUserFriends: (state: any) => (friendOwnerId: string) => {
    const getSocialMetrics = (findOwnerId: string) => {
      const sentByOwnerId = state.socialGraph.sentByOwnerId;

      let count = 0;
      let isMyFriend = false;

      Object.entries(sentByOwnerId).forEach(([rootOwnerId, entry]) => {
        const contactRequestsByFindOwnerId = (entry as any).docs;
        // console.log(
        //   "contactRequestsByFindOwnerId findOwnerId :>> ",
        //   findOwnerId
        // );

        if (findOwnerId in contactRequestsByFindOwnerId) {
          count = count + 1;
        }
      });

      if (findOwnerId in state.contactRequests.sent) isMyFriend = true;
      // console.log(
      //   "state.contactRequests.sent):>> ",
      //   state.contactRequests.sent
      // );

      if (count > 0) count = count - 1;

      return { count, isMyFriend };
    };

    return Object.entries(
      state.socialGraph.sentByOwnerId[friendOwnerId]?.docs ?? {}
    ).map((entry: any) => {
      const contactRequest = entry[1];

      return {
        ...contactRequest,
        _socialMetrics: getSocialMetrics(
          contactRequest.data.toUserId.toString()
        ),
      };
    });
  },
  getMyFriends: (state: any, getters: any) => {
    return Object.entries(state.contactRequests.sent)
      .map((entry: any) => {
        const contactRequest = entry[1];

        return contactRequest;
      })
      .filter((x) => x.data.toUserId.toString() !== getters.myOwnerId)
      .sort((a: any, b: any) => {
        const aLabel = getters.getUserLabel(a.data.toUserId.toString());
        const bLabel = getters.getUserLabel(b.data.toUserId.toString());

        if (aLabel < bLabel) {
          return -1;
        }
        if (aLabel > bLabel) {
          return 1;
        }
        return 0;
      });
  },
  getSuggestedFriends: (state: any, getters: any) => {
    const getSocialMetrics = (findOwnerId: string) => {
      const sentByOwnerId = state.socialGraph.sentByOwnerId;

      let count = 0;
      let isMyFriend = false;

      Object.entries(sentByOwnerId).forEach(([rootOwnerId, entry]) => {
        const contactRequestsByFindOwnerId = (entry as any).docs;
        // console.log(
        //   "contactRequestsByFindOwnerId findOwnerId :>> ",
        //   findOwnerId
        // );

        if (findOwnerId in contactRequestsByFindOwnerId) {
          count = count + 1;
        }
      });

      if (findOwnerId in state.contactRequests.sent) isMyFriend = true;
      // console.log(
      //   "state.contactRequests.sent):>> ",
      //   state.contactRequests.sent
      // );

      return { count, isMyFriend };
    };

    let suggestedFriendsByOwnerId: any = {};

    Object.entries(state.socialGraph.sentByOwnerId).forEach((entry: any) => {
      const contactRequests = entry[1];

      suggestedFriendsByOwnerId = {
        ...suggestedFriendsByOwnerId,
        ...contactRequests.docs,
      };
    });

    // console.log("suggestedFriendsByOwnerId :>> ", suggestedFriendsByOwnerId);

    const suggestedFriends = Object.entries(suggestedFriendsByOwnerId).map(
      (entry: any) => {
        const contactRequest = entry[1];

        return {
          ...contactRequest,
          _socialMetrics: getSocialMetrics(
            contactRequest.data.toUserId.toString()
          ),
        };
      }
    );

    // console.log("suggestedFriends :>> ", suggestedFriends);

    // console.log(
    //   "mutualFriends :>> ",
    //   suggestedFriends.sort(
    //     (a, b) => b._socialMetrics.count - a._socialMetrics.count
    //   )
    // );
    const alreadyFriendOwnerIds = getters.getMyFriends.map((x: any) =>
      x.data.toUserId.toString()
    );

    // console.log("alreadyFriendOwnerIds :>> ", alreadyFriendOwnerIds);

    return suggestedFriends
      .filter((x) => {
        return (
          !alreadyFriendOwnerIds.includes(x.data.toUserId.toString()) &&
          !(x.data.toUserId.toString() === getters.myOwnerId)
        );
      })
      .sort((a, b) => b._socialMetrics.count - a._socialMetrics.count);
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
  getChatMsgById: (state: any) => (id: string, friendOwnerId: string) => {
    const chat = state.chats.msgsByDocumentId[id];
    if(!chat) return undefined
    console.log('chat', chat)
    
        const direction =
          chat.ownerId.toString() === friendOwnerId ? "RECEIVED" : "SENT";
          // chat.ownerId.toString() === friendOwnerId ? "SENT" : "RECEIVED";
          // console.log('getchatmessagebyid', id, friendOwnerId)
          // if (chat.ownerId.toString() !== friendOwnerId)
          // debugger

        return {
          ...chat,
          _friendOwnerId: friendOwnerId,
          _direction: direction,
        };
  },
  getChatMsgByReplyToId: (state: any) => (replyToId: string) => {
    return state.chats.msgsByReplyToId[replyToId];
  },
  getActiveReplyToId: (state: any) => (friendOwnerId: string) => {
    return state.activeReplyToIds[friendOwnerId];
  },
  getFiatRate: (state: any) => (fiatSymbol: string) => {
    return state.fiatRate[fiatSymbol] || {};
  },
  getFiatSymbol: (state: any) => {
    return state.fiatSymbol || "USD";
  },
};

export default createStore({
  state,
  getters,
  actions,
  mutations,
});
