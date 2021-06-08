<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Finish Registration</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content
      v-if="errorMessage.length > 0"
      :fullscreen="true"
      class="ion-padding"
    >
      <ion-item class="ion-margin-top">
        <ion-label position="floating">Choose a Name</ion-label>
        <ion-input v-model="formName"></ion-input>
      </ion-item>
      <ion-grid>
        <ion-row class="ion-align-items-center">
          <ion-col>
            <h1 no-padding no-margin>Try again:</h1>
            <h3 no-padding no-margin>
              {{ errorMessage }}
            </h3>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <ion-button expand="block" color="tertiary" @click="registerName()"
          >Register Name</ion-button
        >
      </ion-toolbar>
    </ion-footer>
    <ion-loading :is-open="showLoader" :message="registrationMessage">
    </ion-loading>
  </ion-page>
</template>

<script lang="ts">
import { ref } from "vue";
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
  IonGrid,
  IonRow,
  IonCol,
  IonLoading,
} from "@ionic/vue";

import { getClient, setClientIdentity } from "@/lib/DashClient";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import { updateAccount, createAccountId } from "@/lib/helpers/AccountStorage";

export default {
  name: "CreateWallet",
  components: {
    IonHeader,
    IonToolbar,
    IonGrid,
    IonRow,
    IonCol,
    IonTitle,
    IonContent,
    IonPage,
    IonFooter,
    IonButton,
    IonLabel,
    IonInput,
    IonItem,
    IonLoading,
  },
  setup() {
    const client = getClient();

    const router = useRouter();

    const store = useStore();

    const formName = ref(store.state.wishName);

    const registrationMessage = ref("Starting to Finish!");

    const showLoader = ref(true);

    const errorMessage = ref("");

    const registerName = async () => {
      showLoader.value = true;
      try {
        console.log("event :>> ", event);

        let identity: any;

        registrationMessage.value = "Many Duffs make a Dash";

        const [
          identityId,
        ] = await (client.account as any).identities.getIdentityIds();

        console.log("existing identityId :>> ", identityId);

        if (identityId) {
          registrationMessage.value = "Fetching existing identity";
          identity = await client.platform?.identities.get(identityId);
        } else {
          registrationMessage.value = "Creating new identity";

          identity = await client.platform?.identities.register();
          setClientIdentity(identity);
        }

        console.log("identity :>> ", identity.toJSON());

        registrationMessage.value = "Registering name";

        const nameRegistration = await client.platform?.names.register(
          `${formName.value}.dash`,
          { dashUniqueIdentityId: identity.getId() },
          identity
        );

        store.commit("setAccountDPNS", nameRegistration.toJSON());
        store.commit("setDPNS", nameRegistration);

        const accountId = createAccountId(
          client.wallet!.exportWallet().toString()
        );

        await updateAccount({
          accountDPNS: nameRegistration.toJSON(),
          id: accountId,
        });

        console.log("nameRegistration >> ", nameRegistration.toJSON());

        router.push("/home");
      } catch (e) {
        console.error(e);
        errorMessage.value = e.message;
      } finally {
        showLoader.value = false;
      }
    };

    registerName();

    return {
      formName,
      registerName,
      showLoader,
      registrationMessage,
      errorMessage,
    };
  },
};
</script>
