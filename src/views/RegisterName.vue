<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Register your Name</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-item class="ion-margin-top">
        <ion-label position="floating">Choose a Name</ion-label>
        <ion-input v-model="formName"></ion-input>
      </ion-item>
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <ion-button expand="block" color="primary" @click="registerName($event)"
          >Register Name</ion-button
        >
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import { onMounted, ref, unref } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonLabel,
  IonInput,
  IonItem,
  IonFooter,
} from "@ionic/vue";

import { getClient } from "@/lib/DashClient";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import { Client } from "dash/dist/src/SDK/Client/index";

export default {
  name: "CreateWallet",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonFooter,
    IonButton,
    IonLabel,
    IonInput,
    IonItem,
  },
  setup() {
    const client = getClient();

    const router = useRouter();
    const store = useStore();

    const formName = ref("");

    // onMounted(async () => {});

    const registerName = async (event: any) => {
      console.log("event :>> ", event);

      // TODO renable identity check, sdk is broken
      let identity: any;

      const [
        identityId,
      ] = await (client.account as any).identities.getIdentityIds();

      console.log("existing identityId :>> ", identityId);

      if (identityId)
        identity = await client.platform?.identities.get(identityId);
      else identity = await client.platform?.identities.register();

      console.log("identity :>> ", identity.toJSON());

      const nameRegistration = await client.platform?.names.register(
        `${formName.value}.dash`,
        { dashUniqueIdentityId: identity.getId() },
        identity
      );

      store.commit("setAccountDPNS", nameRegistration.toJSON());

      console.log("nameRegistration >> ", nameRegistration.toJSON());

      router.push("/home");
    };

    return { formName, registerName };
  },
};
</script>
