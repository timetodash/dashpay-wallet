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
};

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
};

const actions = {
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
