<template>
  <div
    v-for="chatListItem in store.state.chatList"
    :key="chatListItem.friendOwnerId"
  >
    <ChatListItemLegacy
      v-if="chatListItem.id === 'legacy'"
      :chatListItem="chatListItem"
      @click="router.push(`/legacy`)"
    >
    </ChatListItemLegacy>
    <ChatListItem
      v-else
      :chatListItem="chatListItem"
      @click="router.push(`/conversation/${chatListItem.friendOwnerId}`)"
    >
    </ChatListItem>
  </div>
</template>

<script lang="ts">
import ChatListItem from "@/components/Chat/ChatListItem.vue";
import ChatListItemLegacy from "@/components/Chat/ChatListItemLegacy.vue";
import { getClient, getClientIdentity } from "@/lib/DashClient";
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import useContacts from "@/composables/contacts";

export default defineComponent({
  components: { ChatListItem, ChatListItemLegacy },
  setup() {
    const store = useStore();

    const router = useRouter();

    const client = getClient();

    const { chatList } = store.state;

    // client?.platform?.documents
    // .get("dashpay.contactRequest", {
    //   where: [["$ownerId", "==", getClientIdentity.getId()]],
    // })
    // .then((result: any) => {
    //   chatList.value = result;

    //   result.forEach((contactRequest: any) =>
    //     store.dispatch(
    //       "fetchDPNSDoc",
    //       contactRequest.data.toUserId.toString()
    //     )
    //   );

    //   chatList.value.push({ id: "legacy" });
    //   console.log("chatList.value :>> ", chatList.value);
    // });

    return {
      chatList,
      router,
      store,
    };
  },
});
</script>
