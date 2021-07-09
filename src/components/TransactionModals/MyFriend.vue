<template>
  <ion-item lines="none">
    <ion-avatar slot="start">
      <img :src="getUserAvatar(friendOwnerId)" />
    </ion-avatar>
    <ion-label class="ion-align-items-center">
      <h2 class="name">
        {{ getUserLabel(friendOwnerId) }}
      </h2>
      <h3>
        {{ getUserDisplayName(friendOwnerId) }}
      </h3>
    </ion-label>
  </ion-item>
</template>


<script>
import useContacts from "@/composables/contacts";

import { defineComponent } from "vue";
import { IonItem, IonAvatar, IonLabel } from "@ionic/vue";

export default defineComponent({
  props: ["friendOwnerId"],
  components: {
    IonItem,
    IonAvatar,
    IonLabel,
  },
  setup() {
    const { getUserLabel, getUserAvatar, getUserDisplayName } = useContacts();

    return {
      getUserLabel,
      getUserAvatar,
      getUserDisplayName,
    };
  },
});
</script>
<style scoped>
.name {
  /* font-family: Inter; */
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  color: #000000;
}
</style>