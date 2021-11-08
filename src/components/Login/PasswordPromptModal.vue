<template>
  <ion-content class="ion-padding">
    <div class="flex ion-nowrap ion-padding-bottom">
      <ion-icon :icon="closeOutline" class="close" @click="cancel"></ion-icon>
      <div class="unlock">Unlock Account</div>
    </div>
    <div :account="account" class="flex ion-justify-content-center">
      <img class="avatar" :src="getUserAvatar(account.accountDPNS?.$ownerId)" />
    </div>
    <div class="accountname flex ion-justify-content-center">
      {{ accountLabel }}
    </div>
    <div class="displayname flex ion-justify-content-center">
      {{ accountDisplayName }}
    </div>
    <ion-item class="ion-margin-top" lines="none">
      <ion-input
        debounce="500"
        v-model="formPassword"
        enterkeyhint="next"
        placeholder="Enter password"
        show-clear-button="never"
        type="password"
        v-on:input="$emit('update:modelValue', $event.target.value)"
      >
      </ion-input>
    </ion-item>
    <div>
      <ion-icon
        class="lock"
        :src="require('/public/assets/icons/unlock.svg')"
      />
    </div>
  </ion-content>
  <ion-footer class="ion-no-border">
    <!-- <ion-toolbar>
      <ion-title>{{ checkMessage }}</ion-title>
    </ion-toolbar> -->
    <ion-toolbar>
      <ion-chip
        expand="block"
        class="nextbutton next-color"
        @click="$emit('decryptMnemonic')"
        ><span class="next-text">Login</span></ion-chip
      >
    </ion-toolbar>
  </ion-footer>
</template>

<script lang="ts">
import {
  IonChip,
  IonItem,
  IonIcon,
  IonContent,
  IonInput,
  IonFooter,
  IonToolbar,
  modalController,
} from "@ionic/vue";

import { checkmark } from "ionicons/icons";
import { ref, computed } from "vue";

import { useStore } from "vuex";

import useContacts from "@/composables/contacts";
import { closeOutline } from "ionicons/icons";

export default {
  name: "AccountItem",
  props: ["account"],
  emits: ["update:modelValue", "decryptMnemonic"],

  components: {
    IonItem,
    IonIcon,
    IonContent,
    IonInput,
    IonChip,
    IonFooter,
    IonToolbar,
  },
  setup(props: any) {
    const formPassword = ref("");

    const { getUserDisplayName, getUserAvatar } = useContacts();

    const store = useStore();

    const loggedInAccount: any = computed(
      () =>
        props.account.accountDPNS &&
        props.account.accountDPNS?.$ownerId ===
          store.state.accountDPNS?.$ownerId
    );

    const accountLabel: any = computed(() => {
      if (props.account.accountDPNS) {
        return props.account.accountDPNS.label;
      } else {
        return props.account.wishName;
      }
    });

    const accountDisplayName: any = computed(() => {
      if (props.account.accountDPNS) {
        return getUserDisplayName.value(props.account.accountDPNS.$ownerId);
      } else {
        return "(unregistered)";
      }
    });

    // const accountDisplayName: any = computed(() => {
    //   if (props.account.accountDPNS) {
    //     return props.account.accountDPNS.label;
    //   } else {
    //     return props.account.wishName + " (unregistered)";
    //   }
    // });

    const cancel = () => {
      modalController.dismiss();
    };

    return {
      accountDisplayName,
      accountLabel,
      formPassword,
      getUserAvatar,
      loggedInAccount,
      checkmark,
      closeOutline,
      cancel,
    };
  },
};
</script>

<style scoped>
.avatar {
  width: 85px;
  height: 85px;
  margin-top: 10px;
}
ion-input {
  --padding-start: 12px; /* did not work, so used css class below */
  --width: 350px;
  height: 45px;
  --background: #f5f5f7;
  border: 0.5px solid rgba(0, 0, 0, 0.12);
  box-sizing: border-box;
  border-radius: 10px;
}
ion-item.sc-ion-input-md-h:not(.item-label),
ion-item:not(.item-label) .sc-ion-input-md-h {
  --padding-start: 12px;
  --width: 328px;
}

.accountname {
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;
  color: #000000;
  margin: 15px auto 5px;
}
.displayname {
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #929598;
  margin: 0px auto 30px;
}
.active {
  float: right;
  display: flex;
  height: 23px;
  width: 23px;
  position: absolute;
  top: 50%;
  right: 0px;
  transform: translate(0%, -50%);
}
.lock {
  position: absolute;
  left: 156px;
  top: 350px;
  width: 48px;
  height: 62px;
}
</style>
