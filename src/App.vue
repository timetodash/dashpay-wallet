<template>
  <ion-app>
    <!-- <iframe
      class="emulator__item"
      device="iphone7Plus"
      src="http://127.0.0.1:8100/welcome"
    ></iframe> -->
    <ion-router-outlet />
    <Toast></Toast>
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent, onErrorCaptured } from "vue";
import Toast from "@/components/Chat/Toast.vue";

import { useStore } from "vuex";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
    Toast,
  },
  setup() {
    // const client = getClient();

    // const clientIdentity = getClientIdentity();

    // const router = useRouter();

    const store = useStore();

    onErrorCaptured((error: any) => {
      console.error(error);
      store.dispatch("showToast", { text: error, color: "danger" });
      return false;
    });

    window.onerror = function (msg, src, linenum, colnum, error) {
      console.error(error);
      store.dispatch("showToast", { text: `${msg} ${error}`, color: "danger" });
      return false;
    };
  },
});
</script>

<style>
/* @media (min-width: 360px) { */
/* ion-app {
  width: 360px;
  height: 640px;
  margin: auto;
  position: absolute;
  border: 1px solid #92a8d138;
}
ion-backdrop {
  background: #121318e7;
} */
/* } */
/* @media (min-width: 360px) { */
/* .emulator__item {
  width: 360px;
  height: 640px;
  margin: auto;
  border-radius: 15px;
  border: 10px solid #333333;
  box-sizing: content-box;
  border-top: 80px solid #333333;
  border-bottom: 80px solid #333333;
  overflow-x: hidden;
  transform-origin: left bottom;
  will-change: transform;
} */
/* } */
</style>
