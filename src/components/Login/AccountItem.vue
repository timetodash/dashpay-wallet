<template>
  <ion-item :account="account" button>
    <ion-avatar slot="start">
      <img :src="getUserAvatar(account.accountDPNS?.$ownerId)" />
    </ion-avatar>
    <ion-label>
      <h2>
        <ion-icon :icon="checkmark" v-if="loggedInAccount"></ion-icon>
        {{ accountLabel }}
      </h2>
      <h3>
        {{ accountDisplayName }}
      </h3>
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
