<template>
  <ion-app>
    <ion-router-outlet />
    <Toast></Toast>
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent } from "vue";
import Toast from "@/components/Chat/Toast.vue";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
    Toast,
  },
});
</script>