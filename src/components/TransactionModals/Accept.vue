<template>
  <div class="flex ion-nowrap wrapper">
    <ion-label class="sending">{{ amount }} Dash</ion-label>
  </div>
  <div class="flex ion-justify-content-center convert">
    {{ fiatAmount.toFixed(2) }} USD
  </div>
</template>

<script>
import { chevronDownOutline } from "ionicons/icons";

export default {
  props: ["amount", "fiatAmount", "direction"],
  components: {},
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
  height: 37px;
  font-style: normal;
  font-size: 28px;
  line-height: 34px;
  margin-bottom: 5px;
  display: flex;
  align-items: flex-start;
}
</style>