<template>
  <ion-page> </ion-page>
</template>

<script lang="ts">
import { onMounted, ref, computed } from "vue";

import { IonPage } from "@ionic/vue";

import {
  initClient,
  getClient,
  getClientOpts,
  getClientIdentity,
} from "@/lib/DashClient";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  name: "Home",
  components: {
    IonPage,
  },
  setup() {
    const router = useRouter();

    const store = useStore();

    onMounted(async () => {
      const clientOpts = getClientOpts(process.env.VUE_APP_USERMNEMONIC!);

      const client = await initClient(clientOpts);

      const account = client.account as any;

      const [identityId] = await account.identities.getIdentityIds();

      const [dpnsDoc] = await client.platform?.names.resolveByRecord(
        "dashUniqueIdentityId",
        identityId
      );

      console.log("dpnsDoc :>> ", dpnsDoc?.toJSON());

      store.commit("setAccountDPNS", dpnsDoc.toJSON());

      store.commit("setDPNS", dpnsDoc);

      router.push("/home");
    });

    return {};
  },
};
</script>
