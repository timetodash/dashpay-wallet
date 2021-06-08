<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>{{ getUserLabel(ownerId) }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <h1 v-if="!checkedExistingContactRequest">Loading Conversation..</h1>
      <h1 v-if="checkedExistingContactRequest && !existingContactRequest">
        You are not friends yet, when you send your first message you will open
        a friendship connection.
      </h1>
      <ion-list>
        <ion-item v-for="msg in chatMsgs" :key="msg.id.toString()"
          >{{ getUserLabel(msg.ownerId.toString()) }}: {{ msg.data.text }} -
          {{ msg.createdAt.getHours() }}:{{ msg.createdAt.getMinutes() }}
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <ion-input
          :disabled="!checkedExistingContactRequest"
          v-model="chatText"
          placeholder="Say hello.."
          @keyup.enter="sendChat()"
        ></ion-input>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import { onMounted, ref, reactive, watch, computed } from "vue";

import {
  IonPage,
  IonHeader,
  IonBackButton,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonLabel,
  IonInput,
  IonSearchbar,
  IonIcon,
  IonList,
  IonItem,
  IonFooter,
  IonSpinner,
  IonButtons,
} from "@ionic/vue";

import {
  getClientOpts,
  initClient,
  getClient,
  getClientIdentity,
} from "@/lib/DashClient";

import {
  checkmarkOutline,
  banOutline,
  ellipsisHorizontal,
  person,
} from "ionicons/icons";

import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

import { Client } from "dash/dist/src/SDK/Client/index";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dashpaycrypto = require("../lib/crypto/dashpay-crypto");

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
  name: "Conversation",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonBackButton,
    IonButtons,
    IonPage,
    IonFooter,
    // IonButton,
    // IonLabel,
    IonList,
    // IonIcon,
    IonInput,
    // IonSearchbar,
    IonItem,
    // IonSpinner,
  },
  setup() {
    let client: Client;

    let clientIdentity: any; // TODO should be Identity

    const clientOpts = getClientOpts(
      //   "flavor alien feature laugh pen way six pitch nuclear eagle ticket art"
      process.env.VUE_APP_USERMNEMONIC!
    );

    // const client = getClient();

    const router = useRouter();

    const route = useRoute();

    const ownerId = route.params.ownerId; // read parameter id (it is reactive)

    const store = useStore();

    const chatText = ref("");

    const chatMsgsSent = ref<any>([]);

    const chatMsgsReceived = ref<any>([]);

    const checkedExistingContactRequest = ref(false);

    const existingContactRequest = ref({});

    const sendChat = async () => {
      console.log("Sending chat", chatText.value);
      const platform = client.platform;

      const docProperties = {
        text: chatText.value,
        replyToChatId: "",
        txId: "",
        toOwnerId: ownerId,
      };

      const document = await platform?.documents.create(
        "dashpayWallet.chat",
        clientIdentity,
        docProperties
      );

      //
      // start contactRequest
      //

      const senderIdentityId = clientIdentity.getId();

      const senderIdentity = clientIdentity;
      const senderHdPrivateKey = (client?.account as any).identities.getIdentityHDKeyByIndex(
        0,
        0
      );

      const senderPrivateKey = senderHdPrivateKey.privateKey.toString();

      const receiverIdentity = await client?.platform?.identities.get(ownerId);

      const receiverPublicKey = receiverIdentity.toJSON().publicKeys[0].data;

      // ECDH Shared Key / Diffie-Hellman Key Exchange
      // https://github.com/dashpay/dips/blob/feat/dashpay/dip-0015.md#ecdh-shared-key-senderkeyindex-and-recipientkeyindex
      // const sharedSecret = dashpaycrypto.ecdhSharedKey(
      //   senderPrivateKey,
      //   receiverPublicKey
      // );

      const sharedSecret = "0";

      // DashPay Incoming Funds Derivation Path
      // https://github.com/dashpay/dips/blob/feat/dashpay/dip-0015.md#dashpay-incoming-funds-derivation-path
      console.log(
        senderHdPrivateKey,
        clientIdentity.getId().toString(),
        receiverIdentity.id.toString()
      );
      const publicKeyDIP15 = dashpaycrypto.deriveExtendedPublicKeyDIP15(
        senderHdPrivateKey,
        clientIdentity.getId().toString(),
        receiverIdentity.id.toString()
      );

      const contactRequest = {
        toUserId: receiverIdentity.id,
        senderKeyIndex: 0,
        accountReference: 1,
        //dashpaycrypto.createAccountReference(
        // senderPrivateKey,
        // publicKeyDIP15
        // ),
        recipientKeyIndex: 0,
        encryptedPublicKey: Buffer.from(
          dashpaycrypto.encryptPublicKey(publicKeyDIP15, sharedSecret),
          "hex"
        ),
        encryptedAccountLabel: Buffer.from(
          dashpaycrypto.encryptAccountLabel("Default Account", sharedSecret),
          "base64"
        ),
      };

      //
      // end contactRequest
      //

      console.log(contactRequest);

      const contactRequestDocument = await client?.platform?.documents.create(
        "dashpay.contactRequest",
        clientIdentity,
        contactRequest
      );

      const documentBatch = {
        create: [document], // Document(s) to create
        replace: [], // Document(s) to update
        delete: [], // Document(s) to delete
      };

      if (!existingContactRequest.value) {
        documentBatch.create.push(contactRequestDocument);
      }

      // Sign and submit the document(s)
      const result = await platform?.documents.broadcast(
        documentBatch,
        clientIdentity
      );

      if (result.transitions[1])
        existingContactRequest.value = {
          ...result.transitions[1],
          ownerId: result.ownerId,
        };

      console.log("sendChat result :>> ", result);

      console.dir(result.transitions[0].toJSON(), { depth: 100 });

      const chatSent = result.transitions[0];

      chatSent.ownerId = result.ownerId;

      chatMsgsSent.value.push(chatSent);

      chatText.value = "";
    };

    const fetchChatMsgs = async () => {
      chatMsgsSent.value = await client?.platform?.documents.get(
        "dashpayWallet.chat",
        {
          where: [
            ["$ownerId", "==", clientIdentity.getId()],
            ["toOwnerId", "==", ownerId],
          ],
        }
      );

      console.log("chatMsgsSent.value :>> ", chatMsgsSent.value);

      chatMsgsReceived.value = await client?.platform?.documents.get(
        "dashpayWallet.chat",
        {
          where: [
            ["toOwnerId", "==", clientIdentity.getId().toString()],
            ["$ownerId", "==", ownerId],
          ],
        }
      );
      console.log("chatMsgsReceived.value :>> ", chatMsgsReceived.value);
    };

    const loopFetchChatMsgs = async () => {
      await fetchChatMsgs();
      await sleep(2000);
      loopFetchChatMsgs();
    };

    const checkExistingContactRequest = async () => {
      existingContactRequest.value = (
        await client?.platform?.documents.get("dashpay.contactRequest", {
          where: [
            ["$ownerId", "==", clientIdentity.getId()],
            ["toUserId", "==", ownerId],
          ],
        })
      )[0];

      console.log("contactRequest.value :>> ", existingContactRequest.value);
    };

    onMounted(async () => {
      // TODO when done testing move to setup
      // client = await initClient(clientOpts);
      client = getClient();

      clientIdentity = getClientIdentity();

      console.log("clientIdentity :>> ", clientIdentity);

      store.dispatch("fetchDPNSDoc", ownerId);

      await checkExistingContactRequest();

      checkedExistingContactRequest.value = true;

      loopFetchChatMsgs();
    });

    const chatMsgs = computed(() => {
      return [...chatMsgsSent.value, ...chatMsgsReceived.value].sort(
        (a: any, b: any) => a.createdAt - b.createdAt
      );
    });

    return {
      chatText,
      sendChat,
      ownerId,
      chatMsgs,
      checkedExistingContactRequest,
      existingContactRequest,
      getUserLabel: store.getters.getUserLabel,
    };
  },
};
</script>

<style></style>
