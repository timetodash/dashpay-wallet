<template>
  <ion-item lines="none">
    <ion-avatar slot="start">
      <img :src="myAvatar" />
    </ion-avatar>
    <ion-label class="ion-align-items-center">
      <h2 class="name">
        {{ myLabel }}
      </h2>
      <h3 class="new-balance">
        New balance:
        <span
          :class="{
            purple: sendRequestDirection === 'send',
            green: sendRequestDirection === 'request',
            red: newDashBalance < 0,
          }"
        >
          {{ newDashBalance }} Dash
        </span>
      </h3>
    </ion-label>
  </ion-item>
</template>

<script>
import useContacts from "@/composables/contacts";
import useWallet from "@/composables/wallet";
import useRates from "@/composables/rates";

import { defineComponent, computed } from "vue";
import { IonItem, IonAvatar, IonLabel } from "@ionic/vue";

export default defineComponent({
  props: ["amount", "sendRequestDirection"],
  emits: ["newDashBalance"],
  components: {
    IonItem,
    IonAvatar,
    IonLabel,
  },
  setup(props) {
    const { myLabel, myAvatar } = useContacts();
    const { myBalance } = useWallet();

    const { duffsInDash, dashInDuffs } = useRates();

    const newDashBalance = computed(() => {
      let balance;
      if (props.sendRequestDirection === "send") {
        balance = myBalance.value - dashInDuffs.value(props.amount);
      }
      if (props.sendRequestDirection === "request") {
        balance = myBalance.value + dashInDuffs.value(props.amount);
      }
      return duffsInDash.value(balance);
    });

    return {
      myLabel,
      myAvatar,
      myBalance,
      newDashBalance,
      duffsInDash,
    };
  },
});
</script>


<style scoped>
.name {
  /* font-family: Inter; */
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  color: #000000;
}
.new-balance {
  /* font-family: Inter; */
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #a3a3a3;
}
.red {
  color: #ff627e;
}
</style>