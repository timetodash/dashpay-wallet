<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-searchbar
          placeholder="Find your friends"
          animated
          debounce="500"
          show-cancel-button="focus"
          enterkeyhint="search"
          v-model="searchText"
          @ionChange="searchContacts"
        ></ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-list>
        <div v-if="searchText === ''">
          <ion-list-header>
            My Friends
          </ion-list-header>

          <ion-item
            v-for="contact in getMyFriends"
            :key="contact.id.toString()"
            button
            @click="
              router.push(`/conversation/${contact.data.toUserId.toString()}`)
            "
          >
            <ion-avatar slot="start">
              <img :src="getUserAvatar(contact.data.toUserId.toString())" />
            </ion-avatar>
            <ion-label>
              <h2>{{ getUserLabel(contact.data.toUserId.toString()) }}</h2>
              <h3>
                {{ getUserDisplayName(contact.data.toUserId.toString()) }}
              </h3>
              <p>
                {{ getUserPublicMessage(contact.data.toUserId.toString()) }}
              </p>
            </ion-label>
          </ion-item>
        </div>
        <div v-if="searchText === ''">
          <ion-list-header>
            Suggested Friends
          </ion-list-header>
          <ion-item
            v-for="contact in getSuggestedFriends"
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
                </div>
              </h2>
              <h3>
                {{ getUserDisplayName(contact.data.toUserId.toString()) }}
              </h3>
              <p>
                {{ getUserPublicMessage(contact.data.toUserId.toString()) }}
              </p>
            </ion-label>
          </ion-item>
        </div>
        <ion-list-header>
          Everyone
        </ion-list-header>

        <ion-item
          v-for="contact in contacts"
          :key="contact.$id"
          button
          @click="router.push(`/conversation/${contact.$ownerId}`)"
        >
          <ion-avatar slot="start">
            <img :src="getUserAvatar(contact.$ownerId)" />
          </ion-avatar>
          <ion-label>
            <h2>{{ getUserLabel(contact.$ownerId) }}</h2>
            <h3>
              {{ getUserDisplayName(contact.$ownerId) }}
            </h3>
            <p>
              {{ getUserPublicMessage(contact.$ownerId) }}
            </p>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-infinite-scroll
        @ionInfinite="loadScrollData($event)"
        threshold="100px"
        id="infinite-scroll"
        :disabled="disableInfiniteScroll"
      >
        <ion-infinite-scroll-content
          loading-spinner="bubbles"
          loading-text="Finding more Friends..."
        >
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { onMounted, ref, reactive, computed } from "vue";
import { people } from "ionicons/icons";
import {
  IonIcon,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonLabel,
  IonInput,
  IonItem,
  IonFooter,
  IonGrid,
  IonRow,
  IonCol,
  IonLoading,
  IonSearchbar,
  IonAvatar,
  IonList,
  IonListHeader,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonButtons,
  IonBackButton,
} from "@ionic/vue";

import {
  getClientOpts,
  initClient,
  getClient,
  getClientIdentity,
} from "@/lib/DashClient";
import { Client } from "dash/dist/src/SDK/Client/index";
import { resolveContacts } from "@/lib/helpers/Contacts";

import { useRouter } from "vue-router";
import { useStore } from "vuex";

import { updateAccount, createAccountId } from "@/lib/helpers/AccountStorage";
import useContacts from "@/composables/contacts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const SCROLL_SIZE = 25;

export default {
  name: "ContactSearch",
  components: {
    IonHeader,
    IonIcon,
    IonToolbar,
    // IonGrid,
    // IonRow,
    // IonCol,
    // IonTitle,
    IonContent,
    IonPage,
    // IonFooter,
    // IonButton,
    IonLabel,
    // IonInput,
    IonItem,
    // IonLoading,
    IonSearchbar,
    IonAvatar,
    IonList,
    IonListHeader,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonButtons,
    IonBackButton,
  },
  setup() {
    const client = getClient();
    const clientIdentity = getClientIdentity();
    // let client: Client;
    // const clientOpts = getClientOpts(
    //   "blanket color tiny word cabbage stem ahead logic veteran either reflect affair" // local
    // "foster venue gather admit fruit mix float guilt broken wash earth order" // testnet
    // );

    const router = useRouter();

    const store = useStore();

    const errorMessage = ref("");

    const searchText = ref("");

    const contacts = ref<any>([]);

    const mostRecentData = ref(0);

    const profiles = reactive<any>({});

    const scrollPage = ref(0);

    const disableInfiniteScroll = ref(false);

    const {
      getUserLabel,
      getUserAvatar,
      getUserDisplayName,
      getUserPublicMessage,
      getMyFriends,
      getSuggestedFriends,
      myOwnerId,
    } = useContacts();

    const filteredFriendIds = computed(() => {
      const myFriendIds = getMyFriends.value.map((x: any) =>
        x.data.toUserId.toString()
      );
      const suggestedFriendIds = getSuggestedFriends.value.map((x: any) =>
        x.data.toUserId.toString()
      );
      return [myOwnerId.value, ...myFriendIds, ...suggestedFriendIds]; // TODO add blocked ownerIds
    });

    const loadScrollData = async (event: any) => {
      const queryOpts = {
        where: [["normalizedParentDomainName", "==", "dash"]],
        orderBy: [["normalizedLabel", "asc"]],
        startAt: 1 + scrollPage.value * SCROLL_SIZE,
        limit: SCROLL_SIZE,
      };

      const thisData = Date.now();

      mostRecentData.value = thisData;

      const result = await client!.platform!.documents.get(
        "dpns.domain",
        queryOpts
      );

      result.forEach((dpnsDoc: any) => {
        store.commit("setDPNS", dpnsDoc);
      });

      console.log("store.state.dpns :>> ", store.state.dpns);

      // Newer data was loaded, so don't display stale results
      if (thisData != mostRecentData.value) return;

      console.log("filteredFriendIds :>> ", filteredFriendIds);

      const resultJson = result
        .map((x: any) => x.toJSON())
        .filter((x: any) => !filteredFriendIds.value.includes(x.$ownerId));

      resultJson.forEach((el: any) => {
        contacts.value.push(el);
      });

      event?.target?.complete();

      scrollPage.value++;

      console.log("contacts.value :>> ", contacts.value);

      console.log(
        "          contacts.value.map((x: any) => x.$ownerId) :>> ",
        contacts.value.map((x: any) => x.$ownerId)
      );
      (
        await store.dispatch("fetchDashpayProfiles", {
          ownerIds: contacts.value.map((x: any) => x.$ownerId),
        })
      ).forEach((profile: any) => {
        if (profile) profiles[profile.ownerId.toString()] = profile.toJSON();
      });
      // TODO use getter for dashpayprofile information
    };

    const searchContacts = async (event: any) => {
      console.log("event :>> ", event.detail.value);
      console.log("scrollPage.value :>> ", scrollPage.value);

      const searchVal = event.detail.value;

      if (searchVal === "") {
        scrollPage.value = 0;
        contacts.value = [];
        disableInfiniteScroll.value = false;

        loadScrollData("");
        return;
      }

      const thisData = Date.now();

      mostRecentData.value = thisData;

      disableInfiniteScroll.value = true;

      console.log("disableInfiniteScroll :>> ", disableInfiniteScroll);

      const searchResults = (
        await client!.platform!.names.search(searchVal, "dash")
      ).map((x: any) => x.toJSON());

      // A newer search was started, so don't display stale results
      if (thisData != mostRecentData.value) return;

      contacts.value = searchResults;

      console.log("searchResult :>> ", searchResults);

      console.log("contacts.value :>> ", contacts.value);

      (await resolveContacts(client, contacts.value)).forEach(
        (profile: any) => {
          if (profile) profiles[profile.$ownerId] = profile;
        }
      );

      console.log("profile :>> ", profiles);
    };

    const avatarUrl = (contact: any) => {
      return (
        profiles[contact.$ownerId]?.avatarUrl || "/assets/defaults/avataaar.png"
      );
    };

    const displayName = (contact: any) => {
      return profiles[contact.$ownerId]?.displayName;
    };

    const publicMessage = (contact: any) => {
      return profiles[contact.$ownerId]?.publicMessage;
    };
    onMounted(async () => {
      // client = await initClient(clientOpts);
      await sleep(150); // Don't block the viewport
      loadScrollData("");
    });

    return {
      searchText,
      errorMessage,
      searchContacts,
      contacts,
      profiles,
      avatarUrl,
      displayName,
      publicMessage,
      loadScrollData,
      disableInfiniteScroll,
      router,
      getMyFriends,
      getSuggestedFriends,
      getUserLabel,
      getUserAvatar,
      getUserDisplayName,
      getUserPublicMessage,
      people,
    };
  },
};
</script>
<style scoped>
.social-count {
  display: flex;
  color: #7d6cfd;
  align-items: center;
  font-weight: 800;
  margin-top: 2px;
}
</style>
