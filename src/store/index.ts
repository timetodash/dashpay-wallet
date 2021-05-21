import { createStore } from "vuex";

const state = {
  accountDPNS: null,
  balance: null,
};

const mutations = {
  setAccountDPNS(state: any, accountDPNS: any) {
    state.accountDPNS = accountDPNS;
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
