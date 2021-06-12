<template>
  <ion-item>
    <ion-avatar slot="start" class="avatar">
      <img
        v-if="contact.type === 'legacy'"
        :src="require('/public/assets/avatars/dash.png')"
        :class="{ squareborder: contact.type === 'legacy' }"
      />
      <img :src="require('/public/assets/defaults/avataaar.png')" />
    </ion-avatar>
    <ion-label
      :class="{
        messagebold: contact.direction === 'Received',
      }"
    >
      <h1>
        {{ getUserLabel(otherOwnerId) }}
        <div class="message-time">
          {{ contact.createdAt.getHours() }}:{{
            contact.createdAt.getMinutes()
          }}
        </div>
      </h1>
      <p>
        {{ mostRecentMsg }}
        <ion-chip
          v-if="true"
          :class="{
            received: true,
            sent: false,
          }"
          >{{ contact.amount }} Dash
          <ion-icon
            class="sent-receive-icon"
            v-if="true"
            :src="require('/public/assets/icons/receiveDash.svg')"
          />
          <ion-icon
            v-if="false"
            class="sent-receive-icon"
            :src="require('/public/assets/icons/sendDash.svg')"
          />
        </ion-chip>
        <ion-badge>1</ion-badge>
        <ion-icon
          v-if="true"
          class="dash-viewed"
          :src="require('/public/assets/icons/D.svg')"
        />
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

import { useStore } from "vuex";

import { computed } from "vue";

export default {
  components: {
    IonItem,
    IonAvatar,
    IonChip,
    IonBadge,
    IonLabel,
    IonIcon,
  },
  props: ["contact"],
  setup(props) {
    console.log("props :>> ", props);

    const store = useStore();

    const otherOwnerId = props.contact.data.toUserId.toString();

    const mostRecentMsg = computed(() => {
      const chatMsgs = store.state.chats.msgsByOwnerId[otherOwnerId];
      if (!chatMsgs) return "";

      const lastIdx = chatMsgs.length - 1;

      return chatMsgs[lastIdx].data.text;
    });

    return {
      getUserLabel: store.getters.getUserLabel,
      mostRecentMsg,
      otherOwnerId,
    };
  },
};
</script>

<style>
.avatar {
  width: 50px;
  height: 50px;
}

.sc-ion-label-md-s h1 {
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 17px;
  color: #000000;
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
.messagebold > p {
  font-weight: 500;
  color: #000000;
}

.sent-receive-icon {
  width: 8px;
  height: 10px;
}

.received {
  background: #eaf9f9;
  color: #36bfac;
  border-radius: 11.5px;
  display: flex no-wrap;
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
  display: flex no-wrap;
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
</style>
