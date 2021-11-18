import Dash from "dash";
import { Client } from "dash/dist/src/SDK/Client/index";
import { strict as assert } from "assert";

let client: Client | undefined;
let identityId: string | undefined; // TODO replace string with Identifier
let identity: any | undefined; // TODO replace any with Identity

console.log("client import executed, this should only show once");

const disconnectClient = async function() {
  assert(client, "Error: Client is not initialized!");

  await client.disconnect();

  client = undefined;
  identity = undefined;
  identityId = undefined;

  return; // TODO handle errors
};

const getClient = function() {
  assert(client, "Error: Client is not initialized!");

  // assert(client.wallet, "Error: Client is initialized without a wallet!");

  return client;
};

const getClientOpts = function(mnemonic: string | null | undefined) {
  const clientOpts: any = {
    network: "testnet",
    apps: {
      dashpayWallet: {
        contractId:
          process.env.VUE_APP_DASHPAY_WALLET_CONTRACT_ID_local ||
          process.env.VUE_APP_DASHPAY_WALLET_CONTRACT_ID_testnet ||
          process.env.VUE_APP_DASHPAY_WALLET_CONTRACT_ID_build_testnet,
      },
    },
  };

  if (process.env.VUE_APP_ENV_RUN !== "testnet") {
    clientOpts.dapiAddresses = JSON.parse(process.env.VUE_APP_DAPIADDRESSES!);

    clientOpts.apps.dpns = { contractId: process.env.VUE_APP_DPNS_CONTRACT_ID };

    clientOpts.apps.dashpay = {
      contractId: process.env.VUE_APP_DASHPAY_CONTRACT_ID,
    };
  }

  if (mnemonic || mnemonic === null) {
    (clientOpts as any).wallet = {
      mnemonic,
      // unsafeOptions: {
      //   skipSynchronizationBeforeHeight: 506776,
      // },
    };
  }

  return clientOpts;
};

const setClientIdentity = function(newIdentity: any): void {
  identity = newIdentity;
  identityId = newIdentity.getId();
};

const fetchClientIdentity = async function() {
  console.log("identity :>> ", identity);
  if (identity) return identity;

  identityId = (client?.account as any).identities.getIdentityIds()[0];

  console.log("identityId :>> ", identityId);

  if (identityId) identity = await client?.platform?.identities.get(identityId);
  console.log("identity :>> ", identity);

  return identity;
};

const initClient = async function(clientOpts: any) {
  // TODO handle errors
  assert(!client, "Error: Client already initialized!");

  // assert(clientOpts.wallet, "Error: clientOpts is missing wallet config!");

  console.log("clientOpts :>> ", clientOpts);

  client = new Dash.Client(clientOpts);

  console.log("client :>> ", client);

  Object.entries((client.getApps() as any).apps).forEach(([name, entry]) =>
    console.log(name, (entry as any).contractId.toString())
  );

  if (client.wallet) {
    client.account = await client.getWalletAccount();

    await fetchClientIdentity();

    console.log("client.account :>> ", client.account);
  }

  return getClient();
};

const getClientIdentity = function() {
  console.log("identity :>> ", identity);
  console.log("identity.getId() :>> ", identity.getId());
  return identity;
};

export {
  initClient,
  getClient,
  getClientOpts,
  fetchClientIdentity,
  setClientIdentity,
  getClientIdentity,
  disconnectClient,
};
