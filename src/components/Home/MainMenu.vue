<template>
  <ion-list>
    <ion-item>
      <ion-label>Show my QR code</ion-label>
    </ion-item>
    <ion-item>
      <ion-label>Invite a friend</ion-label>
    </ion-item>
    <ion-item>
      <ion-label>Transactions</ion-label>
    </ion-item>
    <ion-item>
      <ion-label>News & Updates</ion-label>
    </ion-item>
    <ion-item
      button
      @click="popoverController.dismiss() && router.push('/settings')"
    >
      <ion-label>Settings</ion-label>
    </ion-item>
  </ion-list>
</template>

<script lang="ts">
import { IonList, IonItem, IonLabel, popoverController } from "@ionic/vue";
// import { ellipsisVertical, eyeOutline } from "ionicons/icons";
// import { useStore } from "vuex";
import { computed } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "MainMenu",
  // props: [walletBalance: { type: string, default: "" }],
  //   props: ["event"],
  components: {
    IonList,
    IonItem,
    IonLabel,
  },

  setup() {
    // const store = useStore();
    const router = useRouter();

    return { router, popoverController };
  },
};
</script>

<style scoped></style>
