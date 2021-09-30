<template>
  <ion-buttons slot="start"
    ><ion-back-button default-href="/home" :icon="arrowBack"></ion-back-button
  ></ion-buttons>
  <ion-avatar
    slot="start"
    class="useravatar"
    @click="router.push(`/profile/${friendOwnerId}`)"
    ><img :src="store.getters.getUserAvatar(friendOwnerId)"
  /></ion-avatar>
  <div class="username">{{ getUserLabel(friendOwnerId) }}</div>
  <ion-buttons slot="end">
    <ion-button @click="showChatMenu(true, $event)"
      ><ion-icon :icon="ellipsisVertical" class="ellipsis_color"></ion-icon
    ></ion-button>
  </ion-buttons>
  <ion-popover
    :is-open="isChatMenuOpen"
    :event="chatMenuEvent"
    @didDismiss="showChatMenu(false)"
  >
    <ChatMenu class="menu"></ChatMenu>
  </ion-popover>
</template>

<script lang="ts">
import {
  IonAvatar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonPopover,
} from "@ionic/vue";
import { arrowBack, ellipsisVertical } from "ionicons/icons";
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
// import chats from "@/composables/chats.ts";

import ChatMenu from "@/components/Chat/ChatMenu.vue";

export default {
  props: ["friendOwnerId"],
  components: {
    IonAvatar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    ChatMenu,
    IonPopover,
    // chats,
  },

  setup() {
    const store = useStore();

    const router = useRouter();

    const isChatMenuOpen = ref(false);

    const chatMenuEvent = ref();

    const showChatMenu = (state: boolean, event?: Event) => {
      chatMenuEvent.value = event;
      isChatMenuOpen.value = state;
      console.log("isChatMenuOpen.value :>> ", isChatMenuOpen.value);
      console.log("isChatevent", chatMenuEvent);
    };

    return {
      getUserLabel: computed(() => store.getters.getUserLabel),
      store,
      arrowBack,
      ellipsisVertical,
      router,
      isChatMenuOpen,
      chatMenuEvent,
      showChatMenu,
    };
  },
};
</script>

<style scoped>
/* TODO: font weight not registering */
ion-back-button {
  color: rgba(0, 0, 0, 0.5);
  font-weight: 100;
  --icon-font-weight: 100;
}
.useravatar {
  display: flex;
  align-items: center;
  justify-content: left;
}
.useravatar > img {
  height: 30px;
  width: 30px;
}
.username {
  font-style: normal;
  font-size: 16px;
  font-weight: 600;
  line-height: 19px;
  color: #000000;
  margin-left: -21px;
}
.ellipsis_color {
  color: rgba(0, 0, 0, 0.61);
}
.menu {
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.08), 0px 4px 8px rgba(0, 0, 0, 0.16);
  border-radius: 10px;
}
</style>
