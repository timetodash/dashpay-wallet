<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"
          ><ion-back-button
            default-href="/home"
            :icon="arrowBack"
          ></ion-back-button
        ></ion-buttons>
        <ion-title>Edit Profile</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-list>
        <ion-avatar slot="start" class="userAvatar"
          ><img :src="myAvatar"
        /></ion-avatar>
        <ion-item
          ><ion-label position="floating">Avatar URL</ion-label
          ><ion-input v-model="formAvatarUrl"></ion-input></ion-item
        ><ion-item
          ><ion-label position="floating">Display Name</ion-label
          ><ion-input v-model="formDisplayName"></ion-input></ion-item
        ><ion-item
          ><ion-label position="floating">Status Message</ion-label
          ><ion-input v-model="formPublicMessage"></ion-input></ion-item
      ></ion-list>
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <ion-button color="tertiary" @click="saveProfile" expand="block"
          >Save</ion-button
        >
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import useContacts from "@/composables/contacts";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonAvatar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonBackButton,
  IonFooter,
  IonItem,
  IonInput,
  IonList,
  IonLabel,
} from "@ionic/vue";

import { arrowBack } from "ionicons/icons";

export default {
  name: "EditProfile",
  components: {
    IonButtons,
    IonBackButton,
    IonAvatar,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonButton,
    IonFooter,
    IonItem,
    IonInput,
    IonList,
    IonLabel,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const {
      myDisplayName,
      myPublicMessage,
      myAvatar,
      storeDashpayProfile,
    } = useContacts();

    const formDisplayName = ref(myDisplayName.value);

    const formPublicMessage = ref(myPublicMessage.value);

    const formAvatarUrl = ref(myAvatar.value);

    const saveProfile = async () => {
      console.log("formDisplayName :>> ", formDisplayName);
      console.log("formPublicMessage :>> ", formPublicMessage);
      const profile = {
        avatarUrl: formAvatarUrl.value,
        publicMessage: formPublicMessage.value,
        displayName: formDisplayName.value,
      };

      router.push("/home");
      const result = await storeDashpayProfile(profile);
      console.log("result :>> ", result);
    };

    return {
      arrowBack,
      formDisplayName,
      formPublicMessage,
      formAvatarUrl,
      myAvatar,
      saveProfile,
    };
  },
};
</script>
