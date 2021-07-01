<template>
  <div v-if="msg._direction === 'SENT'" class="response-text response user">
    <div v-if="msg.data.request === 'decline'" class="flex ion-nowrap">
      You declined a request of
      {{ duffsInDash(msg.data.amount) }} Dash
      <div class="flex ion-nowrap">
        <div class="chat_timestamp chat_timestamp_message">
          {{ msg.createdAt.getHours() }}:{{ msg.createdAt.getMinutes(2) }}
        </div>
        <ion-icon
          class="read"
          v-if="msg._direction === 'SENT'"
          :icon="checkmarkDoneOutline"
        >
        </ion-icon>
      </div>
    </div>
    <div v-if="msg.data.request === 'accept'" class="flex ion-nowrap">
      {{ getUserLabel(msg.ownerId.toString()) }} accepted your request of
      {{ duffsInDash(msg.data.amount) }} Dash
      <div class="flex ion-nowrap">
        <div class="chat_timestamp chat_timestamp_message">
          {{ msg.createdAt.getHours() }}:{{ msg.createdAt.getMinutes(2) }}
        </div>
        <ion-icon
          class="read"
          v-if="msg._direction === 'SENT'"
          :icon="checkmarkDoneOutline"
        >
        </ion-icon>
      </div>
    </div>
  </div>

  <div
    v-if="msg._direction === 'RECEIVED'"
    class="response-text response partner"
  >
    <div v-if="msg.data.request === 'decline'" class="flex ion-nowrap">
      {{ getUserLabel(msg.ownerId.toString()) }} declined your request of
      {{ duffsInDash(msg.data.amount) }} Dash
      <div class="flex ion-nowrap">
        <div class="chat_timestamp chat_timestamp_message">
          {{ msg.createdAt.getHours() }}:{{ msg.createdAt.getMinutes(2) }}
        </div>
        <ion-icon
          class="read"
          v-if="msg._direction === 'SENT'"
          :icon="checkmarkDoneOutline"
        >
        </ion-icon>
      </div>
    </div>
    <div v-if="msg.data.request === 'accept'" class="flex ion-nowrap">
      {{ getUserLabel(msg.ownerId.toString()) }} accepted your request of
      {{ duffsInDash(msg.data.amount) }} Dash
      <div class="flex ion-nowrap">
        <div class="chat_timestamp chat_timestamp_message">
          {{ msg.createdAt.getHours() }}:{{ msg.createdAt.getMinutes(2) }}
        </div>
        <ion-icon
          class="read"
          v-if="msg._direction === 'SENT'"
          :icon="checkmarkDoneOutline"
        >
        </ion-icon>
      </div>
    </div>
  </div>
</template>

<script>
import { IonIcon } from "@ionic/vue";
import { checkmarkDoneOutline } from "ionicons/icons";

import useRates from "@/composables/rates";
import useContacts from "@/composables/contacts";

export default {
  props: ["msg"],
  components: {
    IonIcon,
  },
  setup() {
    const { duffsInDash } = useRates();
    const { getUserLabel } = useContacts();
    return {
      duffsInDash,
      getUserLabel,
      checkmarkDoneOutline,
    };
  },
};
</script>

<style scoped>
.response {
  display: flex;
  /* width: 274px; */
  min-height: 36px;
  padding: 9px 12px;

  background: #f5f5f7;
  border-radius: 10px;
}
.response-text {
  /* font-family: Inter; */
  font-style: italic;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: #a1a3ac;
}
.partner {
  margin-right: 22px;
}
.read {
  font-size: 16px;
  margin-top: 2px;
}
.chat_timestamp_message {
  margin: 5px 4px 0px 13px;
}
</style>