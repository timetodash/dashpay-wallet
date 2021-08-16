<template>
  <ion-content class="ion-padding">
    <div class="flex ion-nowrap ion-padding-bottom">
      <ion-icon
        :icon="closeOutline"
        class="close"
        @click="router.push('/choosename')"
      ></ion-icon>
      <div class="title purple flex ion-nowrap">
        <ion-icon
          class="header-icon"
          :src="require('/public/assets/icons/sendHeader.svg')"
        />
        Accept request
      </div>
    </div>
    <div class="transaction sendit">
      <MySelf
        :amount="duffsInDash(msg.data.amount)"
        :sendRequestDirection="'send'"
      ></MySelf>
      <div class="line" />
      <MyFriend :friendOwnerId="friendOwnerId"></MyFriend>
      <ion-icon
        class="arrow"
        :src="require('/public/assets/icons/arrow_down.svg')"
      ></ion-icon>
    </div>

    <span class="funds" v-if="newDashBalance < 0"
      >Not enough funds to pay this request.</span
    >
    <div class="swap-container">
      <Accept
        :amount="duffsInDash(msg.data.amount)"
        :fiatAmount="msg.data.fiatAmount"
      >
      </Accept>
    </div>

    <ion-input
      class="show-message"
      placeholder="Message"
      readonly
      :value="msg.data.text"
    ></ion-input>
  </ion-content>
  <ion-footer class="ion-no-border ion-padding">
    <ion-toolbar>
      <!-- TODO disable button if the balance is too low -->
      <div class="flex ion-nowrap">
        <ion-chip class="decline" @click="declineRequestWrapper"
          ><span class="next-text purple"> Decline</span></ion-chip
        >
        <!-- :disabled="newDashBalance < 0" -->
        <ion-chip class="send" @click="sendRequestAmount"
          ><span class="send-text next-text"> Send</span></ion-chip
        >
      </div>
    </ion-toolbar>
  </ion-footer>
</template>

<script lang="ts">
import useWallet from "@/composables/wallet";
import useRates from "@/composables/rates";
import useChats from "@/composables/chats";

import MySelf from "@/components/TransactionModals/MySelf.vue";
import MyFriend from "@/components/TransactionModals/MyFriend.vue";
import Accept from "@/components/TransactionModals/Accept.vue";

import {
  IonContent,
  IonIcon,
  IonInput,
  IonChip,
  IonFooter,
  IonToolbar,
  modalController,
} from "@ionic/vue";
import { defineComponent, computed } from "vue";

import { arrowDownOutline, closeOutline } from "ionicons/icons";

export default defineComponent({
  props: ["msg", "initSendRequestDirection", "friendOwnerId"],
  components: {
    IonContent,
    IonIcon,
    IonInput,
    IonChip,
    IonFooter,
    IonToolbar,
    MySelf,
    MyFriend,
    Accept,
  },
  setup(props, { emit }) {
    const { myBalance } = useWallet();
    const { duffsInDash } = useRates();

    const newDashBalance = computed(() => {
      return myBalance.value - parseInt(props.msg.data.amount);
    });

    const declineRequestWrapper = () => {
      emit("declineRequest");
      // TODO keep modal open onError and show error message
      modalController.dismiss();
    };

    const { sendChat } = useChats();

    const sendRequestAmount = () => {
      // TODO send DIP15 L1 tx
      // TODO amount is mocked and should come from request msg
      sendChat(
        "",
        props.friendOwnerId,
        duffsInDash.value(props.msg.data.amount),
        "accept",
        props.msg.id.toString()
      );
      // TODO keep modal open onError and show error message
      modalController.dismiss();
    };

    const cancel = () => {
      modalController.dismiss();
    };

    return {
      myBalance,
      newDashBalance,
      sendRequestAmount,
      cancel,
      emit,
      declineRequestWrapper,
      arrowDownOutline,
      closeOutline,
      duffsInDash,
    };
  },
});
</script>

<style scoped>
.close {
  width: 25px;
  height: 25px;
  color: #6c69fc;
}
.title {
  /* font-family: Inter; */
  position: fixed;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: 12px;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  text-transform: capitalize;
  display: flex;
  align-items: center;
}
.header-icon {
  /* order: 0; */
  width: 28px;
  height: 28px;
  display: flex;
  align-items: flex-start;
  margin-right: 8px;
}
.transaction {
  border-radius: 10px;
  position: relative;
}
.req {
  background: linear-gradient(266.73deg, #f2f8fd 0%, #ebfff8 98.09%);
}
.sendit {
  background: linear-gradient(
    266.51deg,
    #f3f3ff 0%,
    #e9f0ff 100%,
    #e9f0ff 100%
  );
}
ion-item {
  --background: none;
  --min-height: 70px;
}
.switch {
  width: 35px;
  height: 35px;
  color: #6c69fc;
  position: absolute;
  top: 50%;
  right: 33.5px;
  transform: translate(50%, -50%);
  z-index: 1;
}
.arrow {
  position: absolute;
  z-index: 1;
  top: 50%;
  transform: translate(27px, -50%);
  height: 15px;
}
.swap {
  width: 35px;
  height: 35px;
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translate(0%, -50%);
}
.message-text {
  margin: 13px 0px 8px 0px;

  /* font-family: Inter; */
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 18px;
  color: #a3a3a3;
}
.message-input {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  min-height: 44px;

  background: #f5f5f7;

  border: 0.5px solid rgba(0, 0, 0, 0.12);
  box-sizing: border-box;
  border-radius: 10px;
}
.input-format {
  color: #000000;
}
.swap-container {
  margin-top: 36px;
}
ion-chip {
  display: flex;
  flex-direction: row;
  justify-content: center;
  /* align-items: center;
  /* padding: 13px 148px; */
  border-radius: 10px;

  width: 158px;
  height: 44px;
}
.send {
  width: 158px;
  height: 44px;
  background: linear-gradient(40.37deg, #6a67fb 0.15%, #8d71ff 100%);
}
.decline {
  width: 158px;
  height: 44px;
  background: #f2f4ff;
}
.next-text {
  /* font-family: Inter; */
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;
}
.send-text {
  color: #ffffff;
}
.line {
  position: absolute;
  width: 256px;
  border-bottom: 1px solid #e6e6e6;
  left: 72px;
}
.show-message {
  /* font-family: Inter; */
  width: 194px;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 18px;
  text-align: center;
  color: #000000;
  margin: 34px auto 0 auto;
}
.funds {
  width: 210px;
  height: 15px;
  margin: 10px auto 0px auto;
  display: flex;
  justify-content: center;

  /* font-family: Inter; */
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 15px;

  color: #ff627e;
}
</style>