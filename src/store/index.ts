import { createStore } from "vuex";

const state = {
  accountDPNS: null,
  balance: null,
  wishName: null,
};

const mutations = {
  setAccountDPNS(state: any, accountDPNS: any) {
    state.accountDPNS = accountDPNS;
  },
  setWishName(state: any, wishName: string) {
    state.wishName = wishName;
  },
};

const actions = {};

const getters = {
  name: (state: any) => state.accountDPNS?.label,
  identityId: (state: any) => state.accountDPNS?.$ownerId,
};

export default createStore({
  state,
  getters,
  actions,
  mutations,
});
