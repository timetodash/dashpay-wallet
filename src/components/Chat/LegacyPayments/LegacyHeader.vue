<template>
  <ion-buttons slot="start"
    ><ion-back-button default-href="/home" :icon="arrowBack"></ion-back-button
  ></ion-buttons>
  <ion-avatar slot="start" class="useravatar"
    ><img
      class="squareborder"
      :src="require('/public/assets/avatars/dash.png')"
  /></ion-avatar>
  <div class="username">Legacy Payments</div>
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
    return {
      arrowBack,
      ellipsisVertical,
    };
  },
};
</script>

<style scoped>
ion-back-button {
  color: rgba(0, 0, 0, 0.5);
  font-weight: 100;
  --ionicon-stroke-width: 10px;
}
.useravatar {
  display: flex;
  align-items: center;
  justify-content: left;
  border-radius: 10px;
}
.squareborder {
  border-radius: 10px;
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
