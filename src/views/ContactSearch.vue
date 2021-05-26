<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-searchbar
          placeholder="Find your friends"
          animated
          debounce="500"
          show-cancel-button="focus"
          enterkeyhint="search"
          @ionChange="searchContacts"
        ></ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-list>
        <ion-list-header>
          All Friends
        </ion-list-header>

        <ion-item v-for="contact in contacts" :key="contact.$id">
          <ion-avatar slot="start">
            <img :src="avatarUrl(contact)" />
          </ion-avatar>
          <ion-label>
            <h2>{{ contact.label }}</h2>
            <h3>{{ displayName(contact) }}</h3>
            <p>
              {{ publicMessage(contact) }}
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
import { onMounted, ref, reactive } from "vue";
import {
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
} from "@ionic/vue";

import { getClientOpts, initClient, getClient } from "@/lib/DashClient";
import { Client } from "dash/dist/src/SDK/Client/index";
import { resolveContacts } from "@/lib/helpers/Contacts";

import { useRouter } from "vue-router";
import { useStore } from "vuex";

import { updateAccount, createAccountId } from "@/lib/helpers/AccountStorage";

const SCROLL_SIZE = 25;

export default {
  name: "ContactSearch",
  components: {
    IonHeader,
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
  },
  setup() {
    const client = getClient();
    // let client: Client;
    // const clientOpts = getClientOpts(
    //   "blanket color tiny word cabbage stem ahead logic veteran either reflect affair" // local
    // "foster venue gather admit fruit mix float guilt broken wash earth order" // testnet
    // );

    const router = useRouter();

    const store = useStore();

    const errorMessage = ref("");

    const contacts = ref<any>([]);

    const mostRecentData = ref(0);

    const profiles = reactive<any>({});

    const scrollPage = ref(0);

    const disableInfiniteScroll = ref(false);

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

      // Newer data was loaded, so don't display stale results
      if (thisData != mostRecentData.value) return;

      const resultJson = result.map((x: any) => x.toJSON());

      resultJson.forEach((el: any) => {
        contacts.value.push(el);
      });

      event?.target?.complete();

      scrollPage.value++;

      (await resolveContacts(client, contacts.value)).forEach(
        (profile: any) => {
          if (profile) profiles[profile.$ownerId] = profile;
        }
      );
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
      loadScrollData("");
    });

    return {
      errorMessage,
      searchContacts,
      contacts,
      profiles,
      avatarUrl,
      displayName,
      publicMessage,
      loadScrollData,
      disableInfiniteScroll,
    };
  },
};
</script>
