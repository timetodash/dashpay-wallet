<template>
  <div class="flex ion-nowrap wrapper">
    <ion-input
      class="enter-dash"
      v-on:input="$emit('update:amount', $event.target.value)"
      :value="amount"
      type="number"
      min="0"
      autofocus
    ></ion-input>
    <span class="dash-label"> Dash</span>
  </div>
  <div class="flex ion-justify-content-center convert">
    {{ fiatAmount?.toFixed(2) }} {{ fiatSymbol || "USD" }}
    <ion-icon
      :icon="chevronDownOutline"
      class="fiat-icon"
      @click="showChooseCurrencyModal(true)"
    ></ion-icon>
  </div>
  <ion-modal
    :is-open="isChooseCurrencyModalOpen"
    @didDismiss="showChooseCurrencyModal(false)"
  >
    <ChooseCurrencyModal @chooseCurrency="chooseCurrency"></ChooseCurrencyModal>
  </ion-modal>
</template>

<script lang="ts">
import ChooseCurrencyModal from "@/components/Settings/ChooseCurrencyModal.vue";
import useRates from "@/composables/rates";
import { IonInput, IonIcon, IonModal } from "@ionic/vue";
import { chevronDownOutline } from "ionicons/icons";

import { defineComponent, ref } from "vue";

export default defineComponent({
  props: ["amount", "fiatAmount", "fiatSymbol"],
  emits: ["update:amount", "newFiatRate", "newFiatSymbol"],
  components: {
    IonInput,
    IonIcon,
    IonModal,
    ChooseCurrencyModal,
  },
  setup(props: any, context: any) {
    const isChooseCurrencyModalOpen = ref(false);

    const { fetchRate, getFiatRate } = useRates();
    const { duffsInDash } = useRates();

    const fiatRate = ref(getFiatRate.value(props.fiatSymbol).price);
    console.log("fiatRate.value :>> ", fiatRate.value);

    const chooseCurrency = async (symbol: string) => {
      context.emit("newFiatSymbol", symbol);
      // console.log("getFiatSymbol.value :>> ", getFiatSymbol.value);
      fiatRate.value = parseFloat((await fetchRate(symbol)).price);
      context.emit("newFiatRate", fiatRate.value);
    };

    const showChooseCurrencyModal = (state: boolean) => {
      isChooseCurrencyModalOpen.value = state;
    };

    return {
      chevronDownOutline,
      emit: context.emit,
      isChooseCurrencyModalOpen,
      fiatRate,
      chooseCurrency,
      showChooseCurrencyModal,
      duffsInDash,
    };
  },
});
</script>

<style scoped>
.fiat-icon {
  order: 1;
  margin-left: 2px;
}
</style>