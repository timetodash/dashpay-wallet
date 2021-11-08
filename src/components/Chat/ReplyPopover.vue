<template>
  <div v-show="hover" class="nowrap">
    <ion-icon
      :icon="chevronDownOutline"
      class="chevron"
      @click="showReplyMenu(true, $event)"
    ></ion-icon>
    <ion-popover
      show-backdrop="false"
      :is-open="isReplyMenuOpen"
      :event="replyMenuEvent"
      @didDismiss="showReplyMenu(false)"
    >
      <ReplyMenu
        :msg="msg"
        :friendOwnerId="friendOwnerId"
        class="menu"
      ></ReplyMenu>
    </ion-popover>
  </div>
</template>

<script lang="ts">
import { IonIcon, IonPopover } from "@ionic/vue";
import { chevronDownOutline } from "ionicons/icons";

import ReplyMenu from "@/components/Chat/ReplyMenu.vue";

import { ref } from "vue";

export default {
  props: ["msg", "friendOwnerId", "hover"],
  components: {
    IonIcon,
    ReplyMenu,
    IonPopover,
  },
  setup() {
    // const hover = ref(false);

    const isReplyMenuOpen = ref(false);
    const replyMenuEvent = ref();

    const showReplyMenu = (state: boolean, event?: Event) => {
      replyMenuEvent.value = event;
      isReplyMenuOpen.value = state;
      console.log("isReplyMenuOpen.value", isReplyMenuOpen.value);
      console.log("replyMenuEvent", replyMenuEvent.value);
    };

    return {
      chevronDownOutline,
      //   hover,
      showReplyMenu,
      isReplyMenuOpen,
      replyMenuEvent,
    };
  },
};
</script>

<style scoped>
.nowrap {
  display: flex;
  flex-wrap: nowrap;
  float: right;
}
.chevron {
  position: absolute;
  right: 0px;
  top: 4px;
  width: 40px;
  height: 20px;
  color: #818c99;
  backdrop-filter: blur(20px);
}
.menu {
  border-radius: 10px;
  height: 90px;
}
</style>