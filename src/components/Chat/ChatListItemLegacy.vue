<template>
  <ion-item>
    <ion-avatar slot="start" class="avatar">
      <img
        :src="require('/public/assets/avatars/dash.png')"
        class="squareBorder"
      />
    </ion-avatar>
    <ion-label
      :class="{
        messageBold: contact.direction === 'Received',
      }"
    >
      <h1>
        Legacy Payments
        <div class="messageTime">{{ contact.createdAt }}</div>
      </h1>
      <p>
        <ion-chip
          v-if="true"
          :class="{
            received: true === 'Received',
            sent: false === 'Sent',
          }"
          >{{ contact.amount }} Dash
          <ion-icon
            class="sentReceiveIcon"
            v-if="true === 'Received'"
            :src="require('/public/assets/icons/receiveDash.svg')"
          />
          <ion-icon
            v-if="false === 'Sent'"
            class="sentReceiveIcon"
            :src="require('/public/assets/icons/sendDash.svg')"
          />
        </ion-chip>
        <ion-badge>1</ion-badge>
        <ion-icon
          v-if="true"
          class="dashViewed"
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
  setup() {
    const store = useStore();

    return { getUserLabel: store.getters.getUserLabel };
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
.messageTime {
  float: right;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 15px;

  letter-spacing: -0.003em;
  color: #858585;
}

.squareBorder {
  border-radius: 10px;
}
.messageBold > p {
  font-weight: 500;
  color: #000000;
}

.sentReceiveIcon {
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
.dashViewed {
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
