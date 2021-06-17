<template>
  <ion-buttons slot="start"
    ><ion-back-button default-href="/home" :icon="arrowBack"></ion-back-button
  ></ion-buttons>
  <ion-avatar slot="start" class="useravatar"
    ><img :src="store.getters.getUserAvatar(friendOwnerId)"
  /></ion-avatar>
  <div class="username">{{ getUserLabel(friendOwnerId) }}</div>
  <ion-buttons slot="end">
    <ion-button
      ><ion-icon :icon="ellipsisVertical" class="ellipsis_color"></ion-icon
    ></ion-button>
  </ion-buttons>
</template>

<script>
import {
  IonAvatar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import { arrowBack, ellipsisVertical } from "ionicons/icons";
import { computed } from "vue";
import { useStore } from "vuex";
// import chats from "@/composables/chats.ts";

export default {
  props: ["friendOwnerId"],
  components: {
    IonAvatar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    // chats,
  },

  setup() {
    const store = useStore();
    return {
      getUserLabel: computed(() => store.getters.getUserLabel),
      store,
      arrowBack,
      ellipsisVertical,
    };
  },
};
</script>

<style>
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
  /* font-family: Inter; */
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
</style>
