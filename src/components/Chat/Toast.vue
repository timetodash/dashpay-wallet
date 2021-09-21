<template>
  <ion-toast
    css-class="toastbox"
    class="toastbox"
    position="top"
    :is-open="store.state.toast.isOpen"
    :message="store.state.toast.text"
    :duration="1500"
    @didDismiss="closeToast"
    :icon="copy"
    :color="toastColor"
  >
    <ion-icon slot="start" :icon="copy"> </ion-icon>
  </ion-toast>
</template>

<script lang="ts">
import { watch, computed } from "vue";
import { useStore } from "vuex";
import { IonToast, IonIcon } from "@ionic/vue";
import { defineComponent } from "vue";
import { copy } from "ionicons/icons";

export default defineComponent({
  components: {
    IonToast,
    IonIcon,
  },
  setup() {
    const store = useStore();

    const toastColor = computed(() => store.state.toast.color || "medium");

    watch(
      () => store.state.toast.timestamp,
      () => {
        store.commit("setToastOpenState", true);
        console.log("copy toast state", store.state.toast.isOpen);
      }
    );

    const closeToast = function() {
      store.commit("setToastOpenState", false);
      console.log("copy toast state closed", store.state.toast.isOpen);
    };

    return {
      copy,
      store,
      toastColor,
      closeToast,
    };
  },
});
</script>

<style scoped>
.toastbox {
  --background: #818c99;
  --border-radius: 10px;
  --color: #ffffff;
  --width: 170px;
  display: flex;
  justify-content: center;

  width: 170px;
  height: 35px;
  background: #818c99;
  border-radius: 10px;
}
ion-toast ion-toast-content .toast-content {
  --background: #818c99;
  --border-radius: 10px;
  --color: #ffffff;
}
</style>
