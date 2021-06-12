<template>
  <div v-for="contact in chatList" :key="contact.id.toString()">
    <ChatListItemLegacy
      v-if="contact.id === 'legacy'"
      :contact="contact"
      @click="router.push(`/legacy`)"
    >
    </ChatListItemLegacy>
    <ChatListItem
      v-else
      :contact="contact"
      @click="router.push(`/conversation/${contact.data.toUserId.toString()}`)"
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

    const clientIdentity = getClientIdentity();

    const { chatList } = useContacts();

    // client?.platform?.documents
    // .get("dashpay.contactRequest", {
    //   where: [["$ownerId", "==", clientIdentity.getId()]],
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
    };
  },
});
</script>
