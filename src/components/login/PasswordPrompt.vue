<template>
  <ion-card>
    <ion-card-header>
      <ion-card-subtitle>Account</ion-card-subtitle>
      <ion-card-title>{{ accountDisplayName }}</ion-card-title>
    </ion-card-header>
    <ion-card-header>
      <ion-card-subtitle>Password</ion-card-subtitle>
      <ion-input
        placeholder="Password"
        type="password"
        v-on:input="$emit('update:modelValue', $event.target.value)"
      ></ion-input>
    </ion-card-header>
  </ion-card>
</template>

<script lang="ts">
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonInput,
} from "@ionic/vue";

import { computed } from "vue";

export default {
  name: "PasswordPrompt",
  props: ["account"],
  emits: ["update:modelValue"],

  components: {
    IonInput,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
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
