import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";

import Welcome from "@/views/Welcome.vue";
import CreateWallet from "@/views/CreateWallet.vue";
import RecoverWallet from "@/views/RecoverWallet.vue";
import RegisterName from "@/views/RegisterName.vue";
import RedeemInvite from "@/views/RedeemInvite.vue";
import Home from "@/views/Home.vue";
import SendDash from "@/views/SendDash.vue";
import ReceiveDash from "@/views/ReceiveDash.vue";

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
    path: "/createwallet",
    component: CreateWallet,
  },
  {
    path: "/recoverwallet",
    component: RecoverWallet,
  },
  {
    path: "/registername",
    component: RegisterName,
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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
