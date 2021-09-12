<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <chat-header :friendOwnerId="friendOwnerId"></chat-header>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-avatar><img :src="getUserAvatar(friendOwnerId)"/></ion-avatar>

      <p>
        {{ getUserLabel(friendOwnerId) }}
      </p>
      <p>
        {{ getUserDisplayName(friendOwnerId) }}
      </p>
      <p>
        Status message:
        {{ getUserPublicMessage(friendOwnerId) }}
      </p>
      <ion-button
        color="primary"
        @click="
          router.push({
            path: `/conversation/${friendOwnerId}`,
          })
        "
        shape="round"
        >Chat</ion-button
      >
      <ion-button
        color="primary"
        shape="round"
        @click="
          router.push({
            path: `/conversation/${friendOwnerId}`,
            query: { pay: 'true' },
          })
        "
        >Pay</ion-button
      >
      <ion-button color="primary" shape="round" @click="openQRCodeModal"
        >QR Code</ion-button
      >
      <p>
        Joined {{ new Date().getMonth() + 1 }}/
        {{ new Date().getFullYear() }}
      </p>
      <p>Friends since {{ friendsDate }}</p>

      <ion-toolbar class="searchbar">
        <ion-searchbar v-model="filterInput"></ion-searchbar>
      </ion-toolbar>
      <ion-list>
        <ion-list-header>
          {{ getUserLabel(friendOwnerId) }}'s Friends
        </ion-list-header>
        <ion-item
          v-for="contact in filteredUserFriends"
          :key="contact.id"
          button
        >
          <ion-avatar
            slot="start"
            @click="router.push(`/profile/${contact.data.toUserId.toString()}`)"
          >
            <img :src="getUserAvatar(contact.data.toUserId.toString())" />
          </ion-avatar>
          <ion-label
            @click="
              router.push(`/conversation/${contact.data.toUserId.toString()}`)
            "
          >
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
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { computed, watch, ref } from "vue";
import { search } from "ss-search";

import {
  IonSearchbar,
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonAvatar,
  IonButton,
  IonIcon,
  modalController,
} from "@ionic/vue";

import { getClient, getClientIdentity } from "@/lib/DashClient";

// import {} from "ionicons/icons";

import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import useChats from "@/composables/chats";
import ChatHeader from "@/components/Chat/ChatHeader.vue";
import ContactQRCodeModal from "@/components/Contact/ContactQRCodeModal.vue";
import { people } from "ionicons/icons";

// import { Client } from "dash/dist/src/SDK/Client/index";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const formatDate = (date: Date) => {
  return `${date.getMonth() + 1} / ${date.getFullYear()}`;
};

export default {
  name: "Conversation",
  components: {
    IonHeader,
    IonToolbar,
    IonContent,
    IonPage,
    ChatHeader,
    IonItem,
    IonButton,
    IonLabel,
    IonList,
    IonListHeader,
    IonAvatar,
    IonIcon,
    IonSearchbar,
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

    const friendOwnerId = ref(route.params.friendOwnerId as string);

    const resolveFriend = () => {
      store.dispatch("fetchDPNSDoc", friendOwnerId.value);
      store.dispatch("fetchDashpayProfiles", {
        ownerIds: [friendOwnerId.value],
      });
      store.dispatch("fetchContactRequestsSent", friendOwnerId.value);
    };

    // Resolve friend if still unknown
    resolveFriend();

    watch(
      () => route.params.friendOwnerId,
      () => {
        if (route.params.friendOwnerId) {
          friendOwnerId.value = route.params.friendOwnerId as string;
          // Resolve friend if still unknown
          resolveFriend();
        }
      }
    );

    // onMounted(async () => {});

    const openQRCodeModal = async () => {
      const modal = await modalController.create({
        component: ContactQRCodeModal,
        componentProps: {
          label: getUserLabel.value(friendOwnerId.value)?.toLowerCase(),
        },
      });
      return modal.present();
    };

    const filterInput = ref("");

    const filteredUserFriends = computed(() => {
      if (filterInput.value) {
        console.log("returning filtered list, filterInput", filterInput);
        console.log(
          "fields,",
          store.getters.getUserFriends(friendOwnerId.value)
        );
        // return [store.state.chatList[0]];
        return search(
          store.getters.getUserFriends(friendOwnerId.value),
          ["_searchLabel", "_searchDisplayName"],
          filterInput.value
        );
      } else {
        console.log("returning entire list, filterInput", filterInput);
        console.log(
          "fields,",
          store.getters.getUserFriends(friendOwnerId.value)
        );
        return store.getters.getUserFriends(friendOwnerId.value);
      }
    });

    const friendsDate = computed(() => {
      // TODO consider contactInfo 'banning / hiding' of contact
      const dateA =
        store.state.contactRequests.sent[friendOwnerId.value]?.createdAt;
      const dateB =
        store.state.contactRequests.received[friendOwnerId.value]?.createdAt;

      if (dateA && dateB)
        return dateA > dateB ? formatDate(dateA) : formatDate(dateB);
      else return "'say high to be friends today'";
    });

    return {
      friendsDate,
      filteredUserFriends,
      filterInput,
      openQRCodeModal,
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
.searchbar {
  padding-left: 16px;
  padding-right: 16px;
  --background: white;
}

ion-header {
  padding-top: 16px;
  padding-left: 0px;
  background-color: #f7f7f7;
  border: 1px solid #e3e3e3;
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
ion-searchbar {
  --background: #f3f3f3;
  --border-radius: 8px;
  --box-shadow: 0;
  --icon-color: #9c9c9c;
  --placeholder-color: #9c9c9c;
  width: 100%;
  /* width: 334px; width in mobile with padding */
  height: 31px;
  padding-left: 0px;
  padding-right: 0px;
}
ion-toolbar {
  --background: #f7f7f7;
}
</style>
