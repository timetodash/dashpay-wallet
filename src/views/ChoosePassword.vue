<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="flex ion-nowrap ion-padding-bottom">
        <ion-icon
          :icon="closeOutline"
          class="close"
          @click="router.push('choosename')"
        ></ion-icon>
        <div class="unlock">Choose Password</div>
      </div>

      <ion-avatar slot="start" class="avatar">
        <!-- <img :src="store.getters.getUserAvatar(pass in account chosen as prop)" /> -->
      </ion-avatar>

      <ion-item class="ion-margin-top password" lines="none">
        <ion-input
          debounce="500"
          v-model="formPassword"
          enterkeyhint="next"
          placeholder="Enter password"
          show-clear-button="never"
          type="password"
          @keyup.enter="checkPassword()"
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
    <ion-footer class="ion-no-border ion-padding">
      <!-- <ion-toolbar>
        <ion-title>{{ checkMessage }}</ion-title>
      </ion-toolbar> -->
      <ion-toolbar>
        <ion-button
          expand="block"
          class="capitalize"
          color="tertiary"
          @click="checkPassword()"
          >Next</ion-button
        >
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import { ref } from "vue";
import {
  IonPage,
  IonToolbar,
  IonContent,
  IonButton,
  IonAvatar,
  IonInput,
  IonItem,
  IonFooter,
  IonIcon,
  modalController,
} from "@ionic/vue";

import {
  getClient,
  disconnectClient,
  getClientOpts,
  initClient,
} from "@/lib/DashClient";

import { useRouter } from "vue-router";
import { useStore } from "vuex";
import useWallet from "@/composables/wallet";

import { storeAccount, createAccountId } from "@/lib/helpers/AccountStorage";

import { closeOutline } from "ionicons/icons";

export default {
  name: "ChoosePassword",
  components: {
    IonToolbar,
    IonContent,
    IonPage,
    IonFooter,
    IonButton,
    IonInput,
    IonItem,
    IonIcon,
    IonAvatar,
  },
  setup() {
    const router = useRouter();

    const store = useStore();

    const { myBalance } = useWallet();

    const formPassword = ref("");

    const checkMessage = ref("");

    const { getUserLabel, getUserAvatar } = store.getters;

    // onMounted(async () => {});

    const cancel = () => {
      modalController.dismiss();
    };

    const checkPassword = async () => {
      console.log("store.state.wishName :>> ", store.state.wishName);
      console.log("formPassword.value :>> ", formPassword.value);

      try {
        await disconnectClient();
      } catch (e) {
        console.log(e);
      }
      const clientOpts = getClientOpts(null);

      await initClient(clientOpts);

      console.log(
        "getClient().wallet!.exportWallet() :>> ",
        getClient().wallet!.exportWallet()
      );

      const encMnemonic = getClient().account!.encrypt(
        "aes",
        getClient().wallet?.exportWallet(),
        formPassword.value
      );

      const accountId = createAccountId(
        getClient().wallet!.exportWallet().toString()
      );

      await storeAccount({
        wishName: store.state.wishName,
        accountDPNS: store.state.accountDPNS,
        id: accountId,
        encMnemonic,
      });

      checkMessage.value = "Wallet saved on device";

      setTimeout(() => {
        // We recovered a mnemonic, we don't need to backup the mnemonic
        if (store.state.isMnemonicBackedUp) {
          // The recovered mnemonic already has a dpns entry, go straight to home screen
          if (store.getters.myLabel) router.push("/home");
          // The recovered mnemonic is missing an identity or dpns entry, finish registration or redeem invite first
          else if (myBalance.value > 1e5) {
            router.push("/finishregistration");
          } else {
            router.push("/redeeminvite");
          }
        }

        // We registered a new account, we must backup the mnemonic
        else {
          router.push("/backupmnemonic");
        }
      }, 1200);
    };

    return {
      getUserLabel,
      getUserAvatar,
      formPassword,
      checkPassword,
      checkMessage,
      closeOutline,
      cancel,
      router,
    };
  },
};
</script>

<style scoped>
.avatar {
  width: 85px;
  height: 85px;
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
.unlock {
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  position: fixed;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: 14px;
  display: flex;
  align-items: center;
  color: #000000;
}

.close {
  width: 25px;
  height: 25px;
  color: #6c69fc;
}
.lock {
  position: absolute;
  left: 156px;
  top: 394px;
  width: 48px;
  height: 62px;
}
.password {
  margin-top: 150px;
}
</style>
