<template>
  <ion-item>
    <ion-avatar slot="start" class="avatar">
      <img :src="store.getters.getUserAvatar(chatListItem.friendOwnerId)" />
    </ion-avatar>
    <ion-label
      :class="{
        messagebold: chatListItem.direction === 'RECEIVED',
      }"
    >
      <h1
        :class="{
          unlinked: chatListItem.friendshipState === 'UNLINKED',
        }"
      >
        {{ getUserLabel(chatListItem.friendOwnerId) }}
        <span style="font-weight: 400">
          {{ getUserDisplayName(chatListItem.friendOwnerId) }}</span
        >

        <div class="message-time" :class="{ primary: !!newMsgCount }">
          {{ chatListItem.lastMessage.createdAt.getHours() }}:{{
            chatListItem.lastMessage.createdAt.getMinutes()
          }}
        </div>
      </h1>
      <p>
        {{ chatListItem.lastMessage.data.text }}
        <!-- {{ chatListItem.lastMessage.data.request }} -->
        <ion-chip
          v-if="chatListItem.lastMessage.data.amount"
          :class="{
            received: chatListItem.direction === 'RECEIVED',
            sent: chatListItem.direction === 'SENT',
            requested: chatListItem.lastMessage.data.request === 'open',
          }"
          >{{ duffsInDash(chatListItem.lastMessage.data.amount) }} Dash
          <div v-if="!chatListItem.lastMessage.data.request">
            <ion-icon
              class="sent-receive-icon"
              v-if="chatListItem.direction === 'RECEIVED'"
              :src="require('/public/assets/icons/receiveDash.svg')"
            />
            <ion-icon
              v-if="chatListItem.direction === 'SENT'"
              class="sent-receive-icon"
              :src="require('/public/assets/icons/sendDash.svg')"
            />
          </div>
        </ion-chip>
        <ion-badge v-if="newMsgCount > 0">{{ newMsgCount }}</ion-badge>
        <ion-icon
          v-if="hasNewTx && !chatListItem.lastMessage.data.request"
          class="dash-viewed"
          :src="require('/public/assets/icons/D.svg')"
        />
        <ion-icon
          v-if="hasNewTx && chatListItem.lastMessage.data.request === 'open'"
          class="dash-viewed"
          :src="require('/public/assets/icons/requested.svg')"
        />
        <!-- v-if for edge case: don't show gray unlink D if it's a new Tx && you are unlinked. 
        Once user sees the tx, display unlink D in place of new Tx D -->
        <ion-icon
          v-if="chatListItem.friendshipState === 'UNLINKED' && !hasNewTx"
          class="unlink"
          :src="require('/public/assets/icons/unlink.svg')"
        ></ion-icon>
      </p>
    </ion-label>
  </ion-item>
</template>

<script>
import {
  IonItem,
  IonAvatar,
  IonChip,
  IonBadge,
  IonLabel,
  IonIcon,
} from "@ionic/vue";

import { unlink } from "ionicons/icons";

import { useStore } from "vuex";

import { computed } from "vue";

import useRates from "@/composables/rates";

export default {
  components: {
    IonItem,
    IonAvatar,
    IonChip,
    IonBadge,
    IonLabel,
    IonIcon,
  },
  props: ["chatListItem"],
  setup(props) {
    const store = useStore();

    const { duffsInDash } = useRates();

    const { getUserDisplayName, getUserLabel, getUserAvatar } = store.getters;

    const newMsgCount = computed(() =>
      store.getters.getNewChatMsgCount(props.chatListItem.friendOwnerId)
    );

    const hasNewTx = computed(() =>
      store.getters.getHasNewTx(props.chatListItem.friendOwnerId)
    );

    return {
      getUserDisplayName,
      getUserLabel,
      getUserAvatar,
      unlink,
      store,
      newMsgCount,
      hasNewTx,
      duffsInDash,
    };
  },
};
</script>

<style scoped>
.avatar {
  width: 50px;
  height: 50px;
}

.sc-ion-label-md-s h1 {
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 17px;
  /* color: #000000; */
}
.sc-ion-label-md-s p {
  /* font-family: Inter; */
  font-weight: 500;
  font-size: 13px important!;
  line-height: 18px; /* identical to box height, or 138% */
  letter-spacing: -0.003em;
  color: #919191;
}
.message-time {
  float: right;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 15px;

  letter-spacing: -0.003em;
  color: #858585;
}

.squareborder {
  border-radius: 10px;
}
.messagebold {
  font-weight: 500;
  color: #000000;
}

.sent-receive-icon {
  width: 8px;
  height: 10px;
}
.unlink {
  width: 20px;
  height: 20px;
  float: right;
}

.received {
  background: #eaf9f9;
  color: #36bfac;
  border-radius: 11.5px;
  display: flex nowrap;
  justify-content: center;
  align-items: center;
  padding: 4px 11px;
  height: 23px;
  /* font-family: Inter; */
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: -0.003em;
}
.sent {
  background: #f2f4ff;
  color: #6a67fb;
  border-radius: 11.5px;
  display: flex nowrap;
  justify-content: center;
  align-items: center;
  padding: 4px 11px;
  height: 23px;
  /* font-family: Inter; */
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: -0.003em;
}
.requested {
  background: #ffffff;
  border: 0.5px solid #818c99;
  box-sizing: border-box;
  border-radius: 11.5px;
  color: #68717b;
}
.dash-viewed {
  width: 20px;
  height: 20px;
  float: right;
}
ion-badge {
  --background: linear-gradient(38.82deg, #6a67fb 12.59%, #8d71ff 92.59%);
  float: right;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  margin-left: 5px;
}
.primary {
  color: #6a67fb;
}
.unlinked {
  color: #818c99;
}
</style>
