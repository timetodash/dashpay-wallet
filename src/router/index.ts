import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";

import Welcome from "@/views/Welcome.vue";
import Login from "@/views/Login.vue";
import CreateWallet from "@/views/CreateWallet.vue";
import RecoverWallet from "@/views/RecoverWallet.vue";
import FinishRegistration from "@/views/FinishRegistration.vue";
import RedeemInvite from "@/views/RedeemInvite.vue";
import Home from "@/views/Home.vue";
import SendDash from "@/views/SendDash.vue";
import ReceiveDash from "@/views/ReceiveDash.vue";
import ChooseName from "@/views/ChooseName.vue";
import ChoosePassword from "@/views/ChoosePassword.vue";
import BackupMnemonic from "@/views/BackupMnemonic.vue";
import ContactSearch from "@/views/ContactSearch.vue";
import ContactProfile from "@/views/ContactProfile.vue";
import Conversation from "@/views/Conversation.vue";
import ChatLegacyPayment from "@/components/Chat/LegacyPayments/ChatLegacyPayment.vue";
import Settings from "@/views/Settings.vue";

import Autologin from "@/views/Autologin.vue"; // TODO deploy: remove, this is for dev only

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/welcome",
  },
  {
    path: "/welcome",
    component: Welcome,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/createwallet",
    component: CreateWallet,
  },
  {
    path: "/recoverwallet",
    component: RecoverWallet,
  },
  {
    path: "/finishregistration",
    component: FinishRegistration,
  },
  {
    path: "/redeeminvite",
    component: RedeemInvite,
  },
  {
    path: "/home",
    component: Home,
  },
  {
    path: "/senddash",
    component: SendDash,
  },
  {
    path: "/receivedash",
    component: ReceiveDash,
  },
  {
    path: "/choosename",
    component: ChooseName,
  },
  {
    path: "/choosepassword",
    component: ChoosePassword,
  },
  {
    path: "/backupmnemonic",
    component: BackupMnemonic,
  },
  {
    path: "/contactsearch",
    component: ContactSearch,
  },
  {
    path: "/profile/:friendOwnerId",
    component: ContactProfile,
    name: "ContactProfile",
    props: true,
  },
  {
    path: "/conversation/:friendOwnerId",
    component: Conversation,
    name: "Conversation",
    props: true,
  },
  {
    path: "/legacy",
    component: ChatLegacyPayment,
  },
  {
    path: "/settings",
    component: Settings,
  },
  {
    // TODO remove for production
    path: "/autologin",
    component: Autologin,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
