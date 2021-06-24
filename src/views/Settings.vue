<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="app-header">
        <ion-buttons slot="start"
          ><ion-back-button
            default-href="/home"
            :icon="arrowBack"
          ></ion-back-button
        ></ion-buttons>
        Settings
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list>
        <ion-list-header>
          <ion-label>Account</ion-label>
        </ion-list-header>
        <ion-item>
          <ion-label>Payment Currency</ion-label>
          <ion-button fill="clear" @click="showChooseCurrencyModal(true)">{{
            fiatSymbol
          }}</ion-button>
        </ion-item>
        <ion-item>
          <ion-label>Language</ion-label>
          <ion-button fill="clear">English</ion-button>
        </ion-item>
        <ion-item>
          <ion-label>Theme</ion-label>
          <ion-button fill="clear">light</ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-modal
      :is-open="isChooseCurrencyModalOpen"
      @didDismiss="showChooseCurrencyModal(false)"
    >
      <ChooseCurrencyModal
        @chooseCurrency="chooseCurrency"
      ></ChooseCurrencyModal>
    </ion-modal>
  </ion-page>
</template>

<script lang="ts">
import {
  IonList,
  IonItem,
  IonLabel,
  IonListHeader,
  IonHeader,
  IonContent,
  IonPage,
  IonButtons,
  IonBackButton,
  IonToolbar,
  IonButton,
  IonModal,
} from "@ionic/vue";
import { arrowBack } from "ionicons/icons";
// import { useStore } from "vuex";
import { ref } from "vue";

import ChooseCurrencyModal from "@/components/Settings/ChooseCurrency.vue";

export default {
  name: "Settings",
  components: {
    IonList,
    IonItem,
    IonLabel,
    IonButtons,
    IonBackButton,
    IonToolbar,
    IonListHeader,
    IonButton,
    IonHeader,
    IonContent,
    IonPage,
    ChooseCurrencyModal,
    IonModal,
  },

  setup() {
    // const store = useStore();
    const isChooseCurrencyModalOpen = ref(false);

    const fiatSymbol = ref("USD");

    const chooseCurrency = (symbol: string) => {
      fiatSymbol.value = symbol;
    };

    const showChooseCurrencyModal = (state: boolean) => {
      isChooseCurrencyModalOpen.value = state;
    };

    return {
      arrowBack,
      isChooseCurrencyModalOpen,
      showChooseCurrencyModal,
      chooseCurrency,
      fiatSymbol,
    };
  },
};
</script>

<style scoped></style>
