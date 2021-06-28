<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <chat-header :friendOwnerId="friendOwnerId"></chat-header>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      Status message:
      {{ getUserPublicMessage(friendOwnerId) }}
      <ion-list>
        <ion-list-header>
          {{ getUserLabel(friendOwnerId) }}'s Friends
        </ion-list-header>
        <ion-item
          v-for="contact in store.getters.getUserFriends(friendOwnerId)"
          :key="contact.id"
          button
          @click="
            router.push(`/conversation/${contact.data.toUserId.toString()}`)
          "
        >
          <ion-avatar slot="start">
            <img :src="getUserAvatar(contact.data.toUserId.toString())" />
          </ion-avatar>
          <ion-label>
            <h2
              class="
                flex
                ion-align-items-center ion-justify-content-between ion-nowrap
              "
            >
              {{ getUserLabel(contact.data.toUserId.toString()) }}
              <div class="flex ion-nowrap ion-align-items-center">
                <span class="social-count">
                  {{ contact._socialMetrics.count }}
                  <ion-icon
                    :icon="people"
                    color="tertiary"
                    class="social-icon"
                  ></ion-icon>
                </span>
                <ion-icon
                  :src="
                    contact._socialMetrics.isMyFriend
                      ? require('/public/assets/icons/dashd-purple.svg')
                      : require('/public/assets/icons/dashd-grey.svg')
                  "
                  color="tertiary"
                  class="dash-icon"
                ></ion-icon>
              </div>
            </h2>
            <h3>{{ getUserDisplayName(contact.data.toUserId.toString()) }}</h3>
            <p>
              {{ getUserPublicMessage(contact.data.toUserId.toString()) }}
            </p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { computed } from "vue";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonAvatar,
  IonIcon,
} from "@ionic/vue";

import { getClient, getClientIdentity } from "@/lib/DashClient";

// import {} from "ionicons/icons";

import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import useChats from "@/composables/chats";
import ChatHeader from "@/components/Chat/ChatHeader.vue";
import { people } from "ionicons/icons";

// import { Client } from "dash/dist/src/SDK/Client/index";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
  name: "Conversation",
  components: {
    IonHeader,
    IonToolbar,
    IonContent,
    IonPage,
    ChatHeader,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonAvatar,
    IonIcon,
  },
  setup() {
    // const client = getClient();

    // const clientIdentity = getClientIdentity();

    const router = useRouter();

    const route = useRoute();

    const store = useStore();

    const getUserPublicMessage = computed(
      () => store.getters.getUserPublicMessage
    );

    const getUserDisplayName = computed(() => store.getters.getUserDisplayName);

    const getUserLabel = computed(() => store.getters.getUserLabel);

    const getUserAvatar = computed(() => store.getters.getUserAvatar);

    const friendOwnerId = route.params.friendOwnerId as string;

    // Resolve friend if still unknown
    store.dispatch("fetchDPNSDoc", friendOwnerId);
    store.dispatch("fetchDashpayProfiles", { ownerIds: [friendOwnerId] });
    store.dispatch("fetchContactRequestsSent", friendOwnerId);

    // onMounted(async () => {});

    return {
      friendOwnerId,
      getUserPublicMessage,
      getUserDisplayName,
      getUserLabel,
      getUserAvatar,
      store,
      people,
      router,
    };
  },
};
</script>

<style scoped>
ion-header {
  padding-top: 16px;
  padding-left: 0px;
  background-color: #f7f7f7;
  border: 1px solid #e3e3e3;
}

ion-toolbar {
  --background: primary;
}
/* removes the shadow below the header */
.header-md::after {
  height: 0px;
  border-style: solid 2px;
}
ion-footer {
  padding: 0px 0px 8px 16px;
}
.item-inner {
  padding-inline-end: 0px;
}
.social-count {
  display: flex;
  color: #7d6cfd;
  align-items: center;
  font-weight: 800;
  margin-top: 2px;
}
.social-icon {
  width: 17px;
  height: 17px;
  display: flex;
  margin-left: 2px;
  margin-right: 12px;
  margin-bottom: 1px;
}
.dash-icon {
  width: 17px;
  height: 17px;
  margin: auto;
}
</style>
