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
    </ion-item>
    <ion-item
      button
      @click="popoverController.dismiss() && copyToClipboard()"
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
  // IonToast,
  popoverController,
} from "@ionic/vue";
// import { ellipsisVertical, eyeOutline } from "ionicons/icons";
// import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
// import { ref } from "vue";
// import { convertToSearchableStrings } from "ss-search";

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

    function copyToClipboard() {
      navigator.clipboard.writeText(props.msg.data.text).then(
        function () {
          store.dispatch("showToast", { text: "Copied message text" });
          console.log(
            "Copying to clipboard was successful! Message: ",
            props.msg.data.text
          );
        },
        function (err) {
          console.error("Could not copy text: ", err);
        }
      );
    }

    return {
      router,
      store,
      popoverController,
      setReplyToId,
      copyToClipboard,
    };
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
