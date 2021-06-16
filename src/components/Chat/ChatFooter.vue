<template>
  <div class="oneline">
    <ion-input
      placeholder="Messsage... "
      v-model="chatText"
      @keyup.enter="sendChat"
    >
      <ion-icon class="emoji" :icon="happyOutline"></ion-icon>
      <ion-icon class="attach" :icon="attachOutline"></ion-icon>
    </ion-input>
    <ion-icon
      v-if="chatText === ''"
      class="dash_button"
      :src="require('/public/assets/icons/userSent.svg')"
      @click="showSendRequestDashSheet"
    ></ion-icon>
    <ion-icon
      v-else
      class="dash_button"
      @click="sendChat"
      :src="require('/public/assets/icons/sending.svg')"
    ></ion-icon>
  </div>
</template>

<script>
import { IonInput, IonIcon } from "@ionic/vue";
import { happyOutline, attachOutline, send } from "ionicons/icons";
import { ref } from "vue";

export default {
  components: {
    IonInput,
    IonIcon,
  },
  setup(_, context) {
    const chatText = ref("");

    const sendChat = function() {
      context.emit("sendChat", chatText.value);
      chatText.value = "";
    };

    const showSendRequestDashSheet = function() {
      context.emit("showSendRequestDashSheet", true);
    };

    return {
      happyOutline,
      attachOutline,
      send,
      sendChat,
      showSendRequestDashSheet,
      chatText,
    };
  },
};
</script>
<style scoped>
ion-input {
  --background: #f3f3f5;
  border-radius: 100px;
}
.emoji {
  padding: 10px 10px 10px 15px;
  /* increased width and height compared to figma */
  width: 20px;
  height: 20px;
  color: #929292;
  /* font-weight: 100px; */
}
.attach {
  /* increased width and height compared to figma */
  padding: 8px 12px 8px 8px;
  width: 24px;
  height: 24px;
  color: #929292;
  order: 3;
}
.dash_button {
  width: 36px;
  height: 36px;
  margin-left: 11px;
  padding-right: 16px;
}
.oneline {
  display: flex;
  flex: nowrap;
}
</style>
