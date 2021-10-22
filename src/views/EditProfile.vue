<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="app-header headername">
        <ion-buttons slot="start"
          ><ion-back-button
            default-href="/home"
            :icon="arrowBack"
            color="tertiary"
          ></ion-back-button
        ></ion-buttons>
        Edit my Profile</ion-toolbar
      >
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-avatar class="profileavatar"><img :src="myAvatar" /></ion-avatar>

      <ion-button
        fill="clear"
        class="statusmessage addphoto ion-text-capitalize"
        >Add Photo</ion-button
      >

      <ion-list>
        <ion-item lines="none">
          <ion-label position="floating" class="label">Avatar URL</ion-label>
          <ion-input v-model="formAvatarUrl" debounce="500"> </ion-input>
        </ion-item>
        <ion-item lines="none"
          ><ion-label position="floating" class="label">Display Name</ion-label
          ><ion-input v-model="formDisplayName"></ion-input></ion-item
        ><ion-item lines="none"
          ><ion-label position="floating" class="label"
            >Status Message</ion-label
          ><ion-textarea
            v-model="formPublicMessage"
            auto-grow
            rows="1"
          ></ion-textarea></ion-item
      ></ion-list>
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <ion-chip
          expand="block"
          shape="round"
          class="nextbutton next-color"
          @click="saveProfile"
          ><span class="next-text"> Save</span></ion-chip
        >
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import useContacts from "@/composables/contacts";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonAvatar,
  IonContent,
  IonButton,
  IonButtons,
  IonBackButton,
  IonFooter,
  IonItem,
  IonInput,
  IonList,
  IonLabel,
  IonTextarea,
  IonChip,
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
    IonContent,
    IonPage,
    IonButton,
    IonFooter,
    IonItem,
    IonInput,
    IonList,
    IonLabel,
    IonTextarea,
    IonChip,
  },
  setup() {
    const router = useRouter();

    const { myDisplayName, myPublicMessage, myAvatar, storeDashpayProfile } =
      useContacts();

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

<style scoped>
.profileavatar {
  height: 80px;
  width: 80px;
  margin: auto;
}
.addphoto {
  color: #6c69fc;
}
.label {
  color: #818c99;
}
ion-input {
  --background: #f5f5f7;
  margin-top: 10px;
  border: 0.5px solid rgba(0, 0, 0, 0.12);
  box-sizing: border-box;
  border-radius: 10px;
}
ion-item .sc-ion-input-md-h {
  --padding-start: 7px;
}
ion-textarea {
  --background: #f5f5f7;
  margin-top: 10px;
  border: 0.5px solid rgba(0, 0, 0, 0.12);
  box-sizing: border-box;
  border-radius: 10px;
}
ion-item .sc-ion-textarea-md-h {
  --padding-start: 7px;
}
</style>
