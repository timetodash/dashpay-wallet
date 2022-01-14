<template>
  <ion-page>
    <ion-content class="ion-padding">
      <!-- <ion-button @click="launch()">Launch</ion-button> -->
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
// import { IonPage, IonContent, IonButton } from "@ionic/vue";
import { IonPage, IonContent } from "@ionic/vue";

import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  components: {
    IonPage,
    IonContent,
    // IonButton,
  },
  setup() {
    const launch = function () {
      const myWindow = window.open(
        "http://127.0.0.1:8100/welcome",
        "DashPay",
        "left=100,top=100,width=360,height=640"
      );
      myWindow?.resizeTo(360, 640);
    };

    return launch;
  },
});
</script>
