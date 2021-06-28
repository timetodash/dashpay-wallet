<template>
  <ion-item :account="account" button>
    <ion-avatar slot="start">
      <img :src="getUserAvatar(account.accountDPNS?.$ownerId)" />
    </ion-avatar>
    <ion-label>
      <h2>{{ accountLabel }}</h2>
      <h3>
        {{ accountDisplayName }}
      </h3>
    </ion-label>
  </ion-item>
</template>

<script lang="ts">
import { IonLabel, IonItem, IonAvatar } from "@ionic/vue";

import { computed } from "vue";

import useContacts from "@/composables/contacts";

export default {
  name: "AccountItem",
  props: ["account"],
  components: {
    IonLabel,
    IonItem,
    IonAvatar,
  },
  setup(props: any) {
    const { getUserDisplayName, getUserAvatar } = useContacts();

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

    return { accountDisplayName, accountLabel, getUserAvatar };
  },
};
</script>
