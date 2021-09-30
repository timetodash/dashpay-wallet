<template>
  <ion-avatar
    slot="start"
    class="userAvatar"
    @click="router.push('chooseaccount')"
    ><img :src="myAvatar"
  /></ion-avatar>
  <ion-buttons slot="end">
    <ion-button @click="showMainMenu(true, $event)"
      ><ion-icon :icon="ellipsisVertical" class="ellipsisColor"></ion-icon
    ></ion-button>
    <ion-popover
      :is-open="isMainMenuOpen"
      :event="mainMenuEvent"
      @didDismiss="showMainMenu(false)"
    >
      <MainMenu class="menu"></MainMenu>
    </ion-popover>
  </ion-buttons>
  <div class="userName">
    {{ myLabel }}
    <ion-icon
      @click="isBlurred === true ? blur(false) : blur(true)"
      :icon="eyeOutline"
    ></ion-icon>
    <div :class="{ blur: isBlurred === true }" class="dashBalance">
      33{{ myDashBalance }} Dash
      <span class="usdBalance">({{ myFiatBalance }} {{ getFiatSymbol }}) </span>
    </div>
  </div>
</template>

<script lang="ts">
import {
  IonAvatar,
  IonButtons,
  IonButton,
  IonIcon,
  IonPopover,
} from "@ionic/vue";
import { ellipsisVertical, eyeOutline } from "ionicons/icons";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ref } from "vue";

import MainMenu from "@/components/Home/MainMenu.vue";

import useWallet from "@/composables/wallet";
import useContacts from "@/composables/contacts";
import useRates from "@/composables/rates";

export default {
  // props: [walletBalance: { type: string, default: "" }],
  props: ["walletBalance", "fiatBalance", "name"],
  components: {
    IonAvatar,
    IonButtons,
    IonButton,
    IonIcon,
    MainMenu,
    IonPopover,
  },

  setup() {
    const store = useStore();
    const router = useRouter();

    const { myDashBalance, myFiatBalance } = useWallet();

    const { getFiatSymbol } = useRates();

    const { myLabel, myAvatar } = useContacts();

    const isMainMenuOpen = ref(false);

    const mainMenuEvent = ref();

    const isBlurred = ref(false);

    const blur = (state: boolean) => {
      console.log("blur", isBlurred.value);
      isBlurred.value = state;
    };

    const showMainMenu = (state: boolean, event?: Event) => {
      mainMenuEvent.value = event;
      isMainMenuOpen.value = state;
      console.log("isMainMenuOpen.value :>> ", isMainMenuOpen.value);
      console.log("isMainevent", mainMenuEvent);
    };

    return {
      ellipsisVertical,
      eyeOutline,
      store,
      isMainMenuOpen,
      showMainMenu,
      mainMenuEvent,
      myLabel,
      myAvatar,
      myDashBalance,
      myFiatBalance,
      getFiatSymbol,
      router,
      isBlurred,
      blur,
    };
  },
};
</script>

<style scoped>
.userAvatar {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
}
.userAvatar > img {
  height: 37px;
  width: 37px;
}
.userName {
  /* font-family: Inter; */
  font-size: 16px;
  font-weight: 600;
}
.dashBalance {
  /* font-family: Inter; */
  font-style: normal;
  font-weight: 200;
  font-size: 13px;
  color: #000000;
}
.blur {
  filter: blur(4.5px);
  margin-bottom: -2px;
}
.usdBalance {
  font-weight: 100;
  font-size: 13px;
  color: gray;
}
.ellipsisColor {
  color: rgba(0, 0, 0, 0.61);
}
.menu {
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.08), 0px 4px 8px rgba(0, 0, 0, 0.16);
  border-radius: 10px;
}
</style>
