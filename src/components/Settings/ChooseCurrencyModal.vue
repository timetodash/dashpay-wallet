<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start"
        ><ion-button @click="modalController.dismiss()"
          ><ion-icon :icon="arrowBack"></ion-icon></ion-button
      ></ion-buttons>
      <ion-title
        ><span style=" color:#6A67FB; font-weight:bold">Currency</span>
      </ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-toolbar class="searchbar">
      <ion-searchbar v-model="searchString"></ion-searchbar>
    </ion-toolbar>
    <ion-list>
      <ion-item
        lines="none"
        v-for="pair in filteredPairs"
        :key="pair.pair"
        button
        @click="choose(pair.fiatSymbol)"
        ><ion-label>{{ pair.fiatSymbol }}</ion-label></ion-item
      >
    </ion-list>
  </ion-content>
</template>

<script lang="ts">
import useContacts from "@/composables/contacts";
import useWallet from "@/composables/wallet";

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonIcon,
  modalController,
  IonSearchbar,
  IonButtons,
  IonButton,
  IonList,
} from "@ionic/vue";
import { defineComponent, ref, onMounted, computed } from "vue";
import useRates from "@/composables/rates";
import { arrowBack } from "ionicons/icons";

export default defineComponent({
  name: "ViewRequestModal",
  emits: ["chooseCurrency"],
  components: {
    IonItem,
    IonButtons,
    IonIcon,
    IonLabel,
    IonContent,
    IonButton,
    IonList,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSearchbar,
  },
  setup(props, { emit }) {
    const { fetchPairs, fetchRate } = useRates();

    const pairs = ref([]);

    const choose = async (fiatSymbol: string) => {
      console.log("choose fiatSymbol :>> ", fiatSymbol);
      // const rate = await fetchRate(fiatSymbol);
      // console.log("rate :>> ", rate);
      emit("chooseCurrency", fiatSymbol);
      modalController.dismiss();
    };

    const searchString = ref("");

    const filteredPairs = computed(() =>
      pairs.value.filter((pair: any) => {
        return pair.fiatSymbol
          .toLowerCase()
          .includes(searchString.value.toLowerCase());
      })
    );

    onMounted(async () => {
      pairs.value = await fetchPairs();
      console.log("pairs :>> ", pairs);
    });

    return {
      modalController,
      arrowBack,
      pairs,
      choose,
      searchString,
      filteredPairs,
    };
  },
});
</script>
