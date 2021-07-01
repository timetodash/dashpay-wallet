<template>
  <div class="flex ion-nowrap wrapper">
    <ion-label class="sending">{{ amount }} Dash</ion-label>
  </div>
  <div class="flex ion-justify-content-center convert">
    {{ fiatAmount.toFixed(2) }} USD
    <ion-icon :icon="chevronDownOutline" class="fiat-icon"></ion-icon>
  </div>
</template>

<script>
import { IonIcon } from "@ionic/vue";
import { chevronDownOutline } from "ionicons/icons";

export default {
  props: ["amount", "fiatAmount"],
  components: {
    IonIcon,
  },
  setup() {
    return {
      chevronDownOutline,
    };
  },
};
</script>

<style scoped>
.fiat-icon {
  order: 1;
  margin-left: 2px;
}
.sending {
  /* font-family: Inter; */
  height: 37px;
  font-style: normal;
  font-size: 28px;
  line-height: 34px;
  margin-bottom: 5px;
  display: flex;
  align-items: flex-start;
}
</style>