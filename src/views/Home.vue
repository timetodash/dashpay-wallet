<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="app-header"
        ><HomeHeader
          :name="name"
          :walletBalance="walletBalance"
          :fiatBalance="fiatBalance"
        ></HomeHeader>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-toolbar class="searchbar">
        <ion-searchbar></ion-searchbar>
      </ion-toolbar>

      <ChatList></ChatList>

      <ion-fab horizontal="end" vertical="bottom" slot="fixed">
        <ion-fab-button class="compose" @click="router.push(`/contactSearch`)">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <ion-fab
        horizontal="end"
        vertical="bottom"
        slot="fixed"
        style="margin-bottom: 74px"
      >
        <ion-fab-button class="capture" @click="router.push(`/senddash`)">
          <ion-icon :icon="scan" color="tertiary"> </ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonFab,
  IonFabButton,
  IonSearchbar,
  IonIcon,
} from "@ionic/vue";
import {
  listCircle,
  personAdd,
  send,
  download,
  scan,
  add,
} from "ionicons/icons";
import HomeHeader from "@/components/HomeHeader.vue";
import ChatList from "@/components/Chat/ChatList.vue";
import useWallet from "@/composables/wallet";
import useContacts from "@/composables/contacts";
import useChats from "@/composables/chats";

import {
  initClient,
  getClient,
  getClientOpts,
  getClientIdentity,
} from "@/lib/DashClient";
import { Client } from "dash/dist/src/SDK/Client/index";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Dashcore = require("@dashevo/dashcore-lib");

export default {
  name: "Home",
  components: {
    IonHeader,
    IonToolbar,
    IonContent,
    IonPage,
    IonSearchbar,
    IonFab,
    IonFabButton,
    IonIcon,
    HomeHeader,
    ChatList,
  },
  setup() {
    const router = useRouter();

    const store = useStore();
    store.dispatch("fetchDashpayProfiles", [store.state.accountDPNS.$ownerId]);

    const { startRefreshWalletDataLoop, balance } = useWallet();
    const { startSyncContactRequests } = useContacts();
    const { startSyncChats } = useChats();

    startSyncChats();
    startRefreshWalletDataLoop();
    startSyncContactRequests();

    // onMounted(() => {
    // });

    return {
      identityId: computed(() => store.getters.identityId),
      name: computed(() => store.getters.name),
      walletBalance: computed(() => `${balance.value / 1e8} Dash`),
      fiatBalance: computed(
        () => `${Math.floor(((balance.value || 0) / 1e8) * 178 * 10) / 10} USD`
      ),
      listCircle,
      personAdd,
      send,
      download,
      getUserLabel: store.getters.getUserLabel,
      router,
      scan,
      add,
    };
  },
};
</script>

<style scoped>
ion-header {
  padding-top: 16px;
  padding-left: 16px;
  background: #f7f7f7;
  border: 1px solid #e3e3e3;
  /* --background-color: #f7f7f7; */
}
.app-header {
  --background-color: #f7f7f7;
}
/* removes the shadow below the header */
.header-md::after {
  height: 0px;
  border-style: solid 2px;
}
/* ion-toolbar {
  --background: primary;
} */

.searchbar {
  padding-left: 16px;
  padding-right: 16px;
  --background: white;
}
.compose {
  --background: linear-gradient(38.82deg, #6a67fb 13.64%, #8d71ff 86.36%);
}
.capture {
  --background: #ffffff;
}
ion-searchbar {
  --background: #f3f3f3;
  --border-radius: 8px;
  --box-shadow: 0;
  --icon-color: #9c9c9c;
  --placeholder-color: #9c9c9c;
  width: 100%;
  /* width: 334px; width in mobile with padding */
  height: 31px;
  padding-left: 0px;
  padding-right: 0px;
}
ion-toolbar {
  --background: #f7f7f7;
}
</style>
