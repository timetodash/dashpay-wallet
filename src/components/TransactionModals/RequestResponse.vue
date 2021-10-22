<template>
  <div
    v-if="msg._direction === 'SENT'"
    class="response-text response user"
    style="position: relative"
    :class="{ nofloat: isReply === true }"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
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
      You accepted a request of
      <!-- {{ getUserLabel(msg.ownerId.toString()) }} accepted your request of -->
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
    <ReplyPopover
      v-if="!isReply"
      class="nowrap"
      :hover="hover"
      :msg="msg"
      :friendOwnerId="friendOwnerId"
    ></ReplyPopover>
  </div>

  <div
    v-if="msg._direction === 'RECEIVED'"
    class="response-text response partner"
    :class="{ nofloat: isReply === true }"
    style="position: relative"
    @mouseover="hover = true"
    @mouseleave="hover = false"
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
    <ReplyPopover
      v-if="!isReply"
      class="nowrap"
      :hover="hover"
      :msg="msg"
      :friendOwnerId="friendOwnerId"
    ></ReplyPopover>
  </div>
</template>

<script>
import { IonIcon } from "@ionic/vue";
import { checkmarkDoneOutline } from "ionicons/icons";
import { ref } from "vue";

import useRates from "@/composables/rates";
import useContacts from "@/composables/contacts";
import ReplyPopover from "@/components/Chat/ReplyPopover.vue";

export default {
  props: ["msg", "friendOwnerId", "isReply"],
  components: {
    IonIcon,
    ReplyPopover,
  },
  setup() {
    const { duffsInDash } = useRates();
    const { getUserLabel } = useContacts();
    const hover = ref(false);
    return {
      duffsInDash,
      getUserLabel,
      checkmarkDoneOutline,
      hover,
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
  width: 300px;
}
.read {
  font-size: 16px;
  /* margin-top: 2px; */
  margin: 8px 0px -9px;
}
.chat_timestamp_message {
  margin: 10px 4px -10px 8px;
}
.nowrap {
  display: flex;
  flex-wrap: nowrap;
  float: right;
}
.chevron {
  width: 40px;
  height: 20px;
  color: #818c99;
}
.nofloat {
  float: none;
  max-width: 260px;
}
</style>