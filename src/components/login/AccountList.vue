<template>
  <ion-list>
    <ion-list-header>Accounts</ion-list-header>
    <AccountItem
      v-for="account in accounts"
      :key="account.encMnemonic"
      :account="account"
      @click="$emit('selectAccount', account)"
    />
  </ion-list>
</template>

<script lang="ts">
import { onMounted, ref } from "vue";

import { IonList } from "@ionic/vue";

import { getAccounts } from "@/lib/helpers/AccountStorage";

import AccountItem from "./AccountItem.vue";

export default {
  name: "AccountList",
  components: {
    IonList,
    AccountItem,
  },
  setup() {
    const accounts = ref([]);

    onMounted(async () => {
      accounts.value = await getAccounts();
    });

    return {
      accounts,
    };
  },
};
</script>
