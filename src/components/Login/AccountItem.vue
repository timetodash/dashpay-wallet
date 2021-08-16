<template>
  <ion-item :account="account" class="ion-no-padding" button>
    <ion-avatar slot="start">
      <img :src="getUserAvatar(account.accountDPNS?.$ownerId)" />
    </ion-avatar>
    <ion-label class="ion-nowrap">
      <div style="position: relative">
        <ion-icon
          v-if="loggedInAccount"
          :src="require('/public/assets/icons/account.svg')"
          class="active"
        ></ion-icon>
        <h2 class="accountname">
          {{ accountLabel }}
        </h2>
        <h3 class="displayname">
          {{ accountDisplayName }}
        </h3>
      </div>
    </ion-label>
  </ion-item>
</template>

<script lang="ts">
import { IonLabel, IonItem, IonAvatar, IonIcon } from "@ionic/vue";

import { checkmark } from "ionicons/icons";

import { computed } from "vue";
import { useStore } from "vuex";

import useContacts from "@/composables/contacts";

export default {
  name: "AccountItem",
  props: ["account"],
  components: {
    IonLabel,
    IonItem,
    IonAvatar,
    IonIcon,
  },
  setup(props: any) {
    const store = useStore();
    const { getUserDisplayName, getUserAvatar } = useContacts();

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

    return {
      accountDisplayName,
      accountLabel,
      getUserAvatar,
      loggedInAccount,
      checkmark,
    };
  },
};
</script>

<style scoped>
.accountname {
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;
  color: #000000;
}
.displayname {
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #929598;
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
</style>
