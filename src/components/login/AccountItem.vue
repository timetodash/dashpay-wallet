<template>
  <ion-item :account="account" button>
    <ion-label>
      {{ accountDisplayName }}
    </ion-label>
  </ion-item>
</template>

<script lang="ts">
import { IonLabel, IonItem } from "@ionic/vue";

import { computed } from "vue";

export default {
  name: "AccountItem",
  props: ["account"],
  components: {
    IonLabel,
    IonItem,
  },
  setup(props: any) {
    const accountDisplayName: any = computed(() => {
      if (props.account.accountDPNS) {
        return props.account.accountDPNS.label;
      } else {
        return props.account.wishName + " (unregistered)";
      }
    });

    return { accountDisplayName };
  },
};
</script>
