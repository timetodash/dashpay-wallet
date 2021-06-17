<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Choose a Dash Name</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-item class="ion-margin-top">
        <ion-searchbar
          debounce="500"
          v-model="formName"
          enterkeyhint="next"
          placeholder="username"
          :searchIcon="person"
          show-clear-button="never"
          @ionChange="checkIsNameAvailable"
        ></ion-searchbar>
      </ion-item>
      <ion-list>
        <ion-item>
          <ion-icon
            slot="start"
            :icon="nameConstraintIcons.isThreeCharsLong"
            :color="constraintColor(nameConstraints.isThreeCharsLong)"
          ></ion-icon>
          <ion-label
            :color="constraintColor(nameConstraints.isThreeCharsLong)"
            >{{ nameIsCorrectLengthText }}</ion-label
          >
        </ion-item>
        <ion-item>
          <ion-icon
            slot="start"
            :icon="nameConstraintIcons.isValidRegexp"
            :color="constraintColor(nameConstraints.isValidRegexp)"
          ></ion-icon>
          <ion-label :color="constraintColor(nameConstraints.isValidRegexp)"
            >Letters, numbers and hyphen only</ion-label
          >
        </ion-item>
        <ion-item>
          <ion-icon
            v-if="!isCheckingName"
            slot="start"
            :icon="nameConstraintIcons.isAvailable"
            :color="constraintColor(nameConstraints.isAvailable)"
          ></ion-icon>
          <ion-spinner v-else name="dots" color="tertiary"></ion-spinner>
          <ion-label
            :color="
              isCheckingName
                ? 'tertiary'
                : constraintColor(nameConstraints.isAvailable)
            "
            >Username available</ion-label
          >
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <ion-button
          :disabled="
            !(hasClient && nameConstraints.isAvailable && !isCheckingName)
          "
          expand="block"
          color="tertiary"
          @click="pickName()"
          >Pick name</ion-button
        >
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import { onMounted, ref, reactive, watch, computed } from "vue";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonLabel,
  // IonInput,
  IonSearchbar,
  IonIcon,
  IonList,
  IonItem,
  IonFooter,
  IonSpinner,
} from "@ionic/vue";

import { getClientOpts, initClient } from "@/lib/DashClient";

import {
  checkmarkOutline,
  banOutline,
  ellipsisHorizontal,
  person,
} from "ionicons/icons";

import { useRouter } from "vue-router";
import { useStore } from "vuex";

import { Client } from "dash/dist/src/SDK/Client/index";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface NameConstraint {
  isAvailable: undefined | boolean;
  isThreeCharsLong: undefined | boolean;
  isValidRegexp: undefined | boolean;
}

export default {
  name: "CreateWallet",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonFooter,
    IonButton,
    IonLabel,
    IonList,
    IonIcon,
    // IonInput,
    IonSearchbar,
    IonItem,
    IonSpinner,
  },
  setup() {
    let client: Client;

    const clientOpts = getClientOpts(null);

    const router = useRouter();

    const store = useStore();

    const formName = ref("");

    const isCheckingName = ref(false);

    const mostRecentCheckTimestamp = ref(0);

    const pickName = () => {
      router.push("/choosepassword");
    };

    const constraintColor = (value: boolean | undefined) => {
      let color = "";

      if (value === true) color = "success";

      if (value === false) color = "danger";

      return color;
    };

    const nameConstraints = reactive({
      isAvailable: undefined,
      isThreeCharsLong: undefined,
      isValidRegexp: undefined,
    } as NameConstraint);

    const nameConstraintIcons = reactive({
      isAvailable: ellipsisHorizontal,
      isThreeCharsLong: ellipsisHorizontal,
      isValidRegexp: ellipsisHorizontal,
    });

    const hasClient = ref(false);

    const nameIsCorrectLengthText = computed(() => {
      return formName.value.length < 64
        ? "Minimum 3 characters"
        : "Maximum 63 characters";
    });

    const checkIsNameThreeCharsLong = () => {
      // Nothing to check without a username present
      if (formName.value === "") {
        nameConstraints.isThreeCharsLong = undefined;
        nameConstraintIcons.isThreeCharsLong = ellipsisHorizontal;
        return nameConstraints.isThreeCharsLong;
      }

      if (formName.value.length >= 3 && formName.value.length <= 64) {
        nameConstraints.isThreeCharsLong = true;
        nameConstraintIcons.isThreeCharsLong = checkmarkOutline;
      } else {
        nameConstraints.isThreeCharsLong = false;
        nameConstraintIcons.isThreeCharsLong = banOutline;
      }

      return nameConstraints.isThreeCharsLong;
    };

    const checkIsNameValidRegexp = () => {
      // Nothing to check with no or too short username
      if (formName.value === "" || !nameConstraints.isThreeCharsLong) {
        nameConstraints.isValidRegexp = undefined;
        nameConstraintIcons.isValidRegexp = ellipsisHorizontal;
        return nameConstraints.isValidRegexp;
      }

      const pattern = new RegExp("^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9])$");
      if (pattern.test(formName.value)) {
        nameConstraints.isValidRegexp = true;
        nameConstraintIcons.isValidRegexp = checkmarkOutline;
      } else {
        nameConstraints.isValidRegexp = false;
        nameConstraintIcons.isValidRegexp = banOutline;
      }

      return nameConstraints.isValidRegexp;
    };

    watch(formName, () => {
      console.log("checking", formName.value);
      checkIsNameThreeCharsLong();
      checkIsNameValidRegexp();
    });

    async function checkIsNameAvailable() {
      console.log("chechIsNameAvailable");

      console.log("nameConstraints :>> ", nameConstraints);
      nameConstraintIcons.isAvailable = ellipsisHorizontal;
      nameConstraints.isAvailable = undefined;

      // Don't check dpns if the name fails regexp tests
      if (!(checkIsNameThreeCharsLong() && checkIsNameValidRegexp())) return;

      // Start checking name against dpns
      isCheckingName.value = true;

      console.log("Check if username exists", formName.value);

      const thisCheckTimestamp = Date.now();

      mostRecentCheckTimestamp.value = thisCheckTimestamp;

      const dpnsDoc = await client.platform?.names.resolve(
        `${formName.value}.dash`
      );

      // Newer check fired, return early to not display stale results (avoid async race conditions)
      if (thisCheckTimestamp != mostRecentCheckTimestamp.value) return;

      console.log("Check dpns result: ", dpnsDoc);

      if (dpnsDoc === null) {
        store.commit("setWishName", formName.value);
        nameConstraints.isAvailable = true;
        nameConstraintIcons.isAvailable = checkmarkOutline;
      } else {
        nameConstraints.isAvailable = false;
        nameConstraintIcons.isAvailable = banOutline;
        console.log("formName is taken:>> ", formName.value);
      }
      await sleep(450);
      isCheckingName.value = false;
    }

    onMounted(async () => {
      await sleep(150); // Don't block the viewport
      client = await initClient(clientOpts);
      console.log("client :>> ", client);
      hasClient.value = true;
      console.log("hasClient.value :>> ", hasClient.value);
    });

    return {
      person,
      checkmarkOutline,
      constraintColor,
      banOutline,
      ellipsisHorizontal,
      formName,
      checkIsNameAvailable,
      nameConstraintIcons,
      nameConstraints,
      hasClient,
      isCheckingName,
      pickName,
      nameIsCorrectLengthText,
    };
  },
};
</script>
<style scoped>
ion-spinner {
  width: 24px;
  height: 24px;
  margin-right: 32px;
}
</style>
