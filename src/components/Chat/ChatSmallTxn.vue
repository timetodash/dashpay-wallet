<template>
  <div
    class="chatbubble_txn_small"
    :class="{
      user: msg._direction.toUpperCase() === 'SENT',
      chat_partner_txn: msg._direction.toUpperCase() === 'RECEIVED',
    }"
  >
    <div class="sameline">
      <ion-icon
        v-if="msg._direction.toUpperCase() === 'SENT'"
        class="dash_icon_small"
        :src="require('/public/assets/icons/userSent.svg')"
      ></ion-icon>
      <ion-icon
        v-else-if="msg._direction.toUpperCase() === 'RECEIVED'"
        class="dash_icon_small"
        :src="require('/public/assets/icons/partnerSent.svg')"
      ></ion-icon>

      <div class="leftpadding">
        <div class="amount">{{ duffsInDash(msg.data.amount) }} Dash</div>
        <div class="usdamount">
          ~{{ msg.data.fiatAmount }} {{ msg.data.fiatSymbol }}
        </div>
      </div>
    </div>
    <div class="alignrow">
      <div class="chat_timestamp">
        {{ msg.createdAt.getHours() }}:{{ msg.createdAt.getMinutes() }}
      </div>
      <ion-icon
        class="align_checkmark checkmark_color"
        :icon="checkmarkDoneOutline"
      >
      </ion-icon>
    </div>
  </div>
</template>

<script>
import { IonIcon } from "@ionic/vue";
import { checkmarkDoneOutline } from "ionicons/icons";
import useRates from "@/composables/rates";

// import { reactive } from "vue";

export default {
  props: ["msg"],
  components: {
    IonIcon,
  },
  setup() {
    const { duffsInDash, duffsInFiatString, getFiatSymbol } = useRates();

    return {
      checkmarkDoneOutline,
      duffsInDash,
      duffsInFiatString,
      getFiatSymbol,
    };
  },
};
</script>

<style scoped>
.chatbubble_txn_small {
  display: flex;
  flex-wrap: nowrap;
  padding-bottom: 3px;
  padding-top: 3px;
  padding-right: 13px;
  margin-bottom: 6px;
  width: 174px;
  justify-content: space-between;
  box-shadow: 0px 2px 4px rgba(106, 103, 251, 0.3);
  border-radius: 100px;
}
.sameline {
  display: flex;
  wrap: nowrap;
}
.dash_icon_small {
  width: 27px;
  height: 27px;
  margin-left: 4px;
}
.leftpadding {
  padding-left: 7px;
}

.amount {
  /* font-family: Inter; */
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: 600;
  font-style: normal;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height */

  letter-spacing: -0.003em;

  color: #000000;
}

.usdamount {
  /* font-family: Inter; */
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  font-style: normal;
  font-weight: 500;
  font-size: 9px;
  line-height: 11px;
  /* identical to box height */

  letter-spacing: -0.004em;

  color: rgba(0, 0, 0, 0.4);
}
.alignrow {
  display: flex;
  wrap: nowrap;
  align-items: flex-end;
}
</style>
