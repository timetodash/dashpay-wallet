<template>
  <ion-avatar slot="start" class="userAvatar"
    ><img :src="store.getters.myAvatar"
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
      <MainMenu></MainMenu>
    </ion-popover>
  </ion-buttons>
  <div class="userName">
    {{ name }}
    <ion-icon :icon="eyeOutline" style="margin-bottom: -2px"></ion-icon>
    <div class="dashBalance">
      {{ walletBalance }}
      <span class="usdBalance">({{ fiatBalance }}) </span>
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
import { ref } from "vue";

import MainMenu from "@/components/Home/MainMenu.vue";

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

    const isMainMenuOpen = ref(false);

    const mainMenuEvent = ref();

    const showMainMenu = (state: boolean, event?: Event) => {
      mainMenuEvent.value = event;
      isMainMenuOpen.value = state;
      console.log("isMainMenuOpen.value :>> ", isMainMenuOpen.value);
      console.log(mainMenuEvent);
    };

    return {
      ellipsisVertical,
      eyeOutline,
      store,
      isMainMenuOpen,
      showMainMenu,
      mainMenuEvent,
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
.usdBalance {
  font-weight: 100;
  font-size: 13px;
  color: gray;
}
.ellipsisColor {
  color: rgba(0, 0, 0, 0.61);
}
</style>
