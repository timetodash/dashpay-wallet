import Dash from "dash";
import { Client } from "dash/dist/src/SDK/Client/index";
import { strict as assert } from "assert";

let client: Client | undefined;

console.log("client import executed, this should only show once");

const disconnectClient = async function() {
  assert(client, "Error: Client is not initialized!");

  await client.disconnect();

  client = undefined;

  return; // TODO handle errors
};

const getClient = function() {
  assert(client, "Error: Client is not initialized!");

  assert(client.wallet, "Error: Client is not initialized without a wallet!");

  return client;
};

const getClientOpts = function(mnemonic: string) {
  return {
    passFakeAssetLockProofForTests: true,
    dapiAddresses: JSON.parse(process.env.VUE_APP_DAPIADDRESSES!),
    wallet: {
      mnemonic: mnemonic,
    },
    apps: {
      dpns: { contractId: process.env.VUE_APP_DPNSCONTRACTID },
    },
  };
};

const initClient = async function(clientOpts: any) {
  // TODO handle errors
  assert(!client, "Error: Client already initialized!");

  assert(clientOpts.wallet, "Error: clientOpts is missing wallet config!");

  client = new Dash.Client(clientOpts);

  console.log("client :>> ", client);
  client.account = await client.getWalletAccount();

  console.log("client.account :>> ", client.account);
  return getClient();
};

export { initClient, getClient, getClientOpts, disconnectClient };
