<template>
  <div class="flex nowrap">
    <div class="chat_timestamp chat_timestamp_message">
      {{ msg.createdAt.getHours() }}:{{ msg.createdAt.getMinutes() }}
    </div>
    <ion-icon v-if="msg._direction === 'SENT'" :icon="checkmarkDoneOutline">
    </ion-icon>
  </div>
</template>

<script>
import { IonIcon } from "@ionic/vue";
import { checkmarkDoneOutline } from "ionicons/icons";

export default {
  props: ["msg"],
  components: {
    IonIcon,
  },
  setup() {
    return {
      checkmarkDoneOutline,
    };
  },
};
</script>

<style scoped>
.chat_timestamp_message {
  margin: 5px 4px 0px 13px;
}
.nowrap {
  display: flex;
  flex-wrap: nowrap;
  float: right;
}
ion-icon {
  color: rgba(0, 0, 0, 0.4);
}
</style>