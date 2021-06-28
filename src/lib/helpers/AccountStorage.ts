import { Storage } from "@capacitor/storage";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { sha256 } = require("@dashevo/dashcore-lib/lib/crypto/hash");

interface LocalAccount {
  wishName?: string;
  encMnemonic: string;
  accountDPNS?: any;
  id: string;
}

interface LocalAccountUpdate {
  accountDPNS: any;
  id: string;
}

const updateAccount = async (accountUpdate: LocalAccountUpdate) => {
  let accounts = [];

  // Read stored accounts
  const readResult = await Storage.get({ key: "accounts" });

  console.log("readResult :>> ", readResult);

  if (readResult.value) accounts = JSON.parse(readResult.value);

  // Update existing account
  let accountUpdated = false;

  accounts.forEach(function(el: LocalAccount, i: number) {
    if (el.id === accountUpdate.id) {
      accounts[i] = {
        encMnemonic: el.encMnemonic, // Keep encMnemonic
        id: el.id,
        accountDPNS: accountUpdate.accountDPNS, // set accountDPNS while dropping wishName
      };
      accountUpdated = true;
    }
  });

  if (!accountUpdated) throw "LocalAccount does not exist in storage.";

  const writeResult = await Storage.set({
    key: "accounts",
    value: JSON.stringify(accounts),
  });

  console.log("result :>> ", writeResult);
  return writeResult;
};
const storeAccount = async (account: LocalAccount) => {
  let accounts = [];

  // Read stored accounts
  const readResult = await Storage.get({ key: "accounts" });

  console.log("readResult :>> ", readResult);

  if (readResult.value) accounts = JSON.parse(readResult.value);

  // Overwrite existing account
  let accountUpdated = false;

  accounts.forEach(function(el: LocalAccount, i: number) {
    if (el.id === account.id) {
      accounts[i] = account;
      accountUpdated = true;
    }
  });

  // Add new account
  if (!accountUpdated) accounts.push(account);

  await Storage.set({
    key: "accounts",
    value: JSON.stringify(accounts),
  });

  return;
};

const getAccounts = async () => {
  const readResult = await Storage.get({ key: "accounts" });

  return readResult.value ? JSON.parse(readResult.value) : null;
};

const createAccountId = (mnemonic: string) => {
  return sha256(Buffer.from(mnemonic)).toString("base64"); // TODO security review required
};

export { getAccounts, storeAccount, createAccountId, updateAccount };
