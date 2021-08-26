<template>
  <ion-list>
    <ion-item
      button
      @click="popoverController.dismiss() && setReplyToId()"
      lines="none"
      class="height"
    >
      <ion-icon
        slot="start"
        :src="require('/public/assets/icons/reply.svg')"
        class="reply"
      ></ion-icon>
      <ion-label>Reply</ion-label>
      <div v-if="msg.data.replyToChatId">
        {{
          store.getters.getChatMsgById(msg.data.replyToChatId, friendOwnerId)
            ?.data.text
        }}
      </div>
    </ion-item>
    <ion-item
      button
      @click="popoverController.dismiss()"
      lines="none"
      class="height"
    >
      <ion-icon
        slot="start"
        :src="require('/public/assets/icons/copy.svg')"
        class="copy"
      ></ion-icon>
      <ion-label>Copy</ion-label>
    </ion-item>
  </ion-list>
</template>

<script lang="ts">
import {
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  popoverController,
} from "@ionic/vue";
// import { ellipsisVertical, eyeOutline } from "ionicons/icons";
// import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  name: "ReplyMenu",
  props: ["msg", "friendOwnerId"],
  // props: [walletBalance: { type: string, default: "" }],
  //   props: ["event"],
  components: {
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
  },

  setup(props: any) {
    const store = useStore();
    const router = useRouter();

    const setReplyToId = () => {
      store.commit("setActiveReplyToId", {
        friendOwnerId: props.friendOwnerId,
        replyToId: props.msg.id.toString(),
      });
    };

    return { router, store, popoverController, setReplyToId };
  },
};
</script>

<style scoped>
.reply {
  width: 28px;
  height: 28px;
}
.copy {
  width: 28px;
  height: 28px;
}
.height {
  height: 40px;
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
}
</style>
