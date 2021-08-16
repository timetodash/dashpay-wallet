import { ref, computed } from "vue";
import { strict as assert } from "assert";
import { getClient } from "../lib/DashClient";
import { resolveTransaction, DIRECTION } from "@/lib/helpers/Transactions";
import useRates from "@/composables/rates";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Dashcore = require("@dashevo/dashcore-lib");
const Unit = Dashcore.Unit;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let client: any;

let isRefreshLoopActive = false;

const myBalance = ref(0);

const myTransactionHistory = ref();

export default function useWallet() {
  const { getFiatSymbol, getFiatRate } = useRates();
  const myDashBalance = computed(() =>
    Unit.fromSatoshis(myBalance.value).toBTC()
  );

  const myFiatBalance = computed(() => {
    return (
      Unit.fromSatoshis(myBalance.value).toBTC() *
      parseFloat(getFiatRate.value(getFiatSymbol.value).price)
    ).toFixed(2);
  });

  function refreshBalance() {
    myBalance.value = getClient().account!.getTotalBalance();
    console.log("balance.value :>> ", myBalance.value);
  }

  function refreshTransactionHistory() {
    const transactions = Object.entries(
      getClient().account!.getTransactions()
    ).map((el) => el[1]);

    console.log("transactions :>> ", transactions);

    myTransactionHistory.value = transactions.map((tx: any) =>
      resolveTransaction(getClient(), tx)
    );
    console.log("transactionHistory.value :>> ", myTransactionHistory.value);
  }

  const transactionDisplay = (transaction: any) => {
    console.log("transaction :>> ", transaction);
    let txDisplay = "";
    switch (transaction.transferDirection) {
      case DIRECTION.SENT:
        txDisplay = `Sent ${transaction.transferSatoshis} to ${transaction.remoteAddress}`;

        if (transaction.remoteAddress === "false")
          txDisplay = `Identity TopUp of ${transaction.transferSatoshis}`;
        break;
      case DIRECTION.RECEIVED:
        txDisplay = `Received ${transaction.transferSatoshis} from ${transaction.remoteAddress}`;
        break;
      case DIRECTION.MOVED:
        txDisplay = `Internal transfer of ${transaction.transferSatoshis}`;
        break;

      default:
        break;
    }

    return txDisplay;
  };

  async function refreshWalletDataLoop() {
    if (!isRefreshLoopActive) return;
    console.log("refreshWalletDataLoop");
    refreshBalance();
    refreshTransactionHistory();
    await sleep(10000);
    refreshWalletDataLoop();
  }

  function startRefreshWalletDataLoop() {
    assert(!isRefreshLoopActive, "Error: Wallet refresh loop already running!");

    console.log("startRefreshWalletDataLoop");
    // if (!client) client = getClient(); // TODO deprecated remove
    // console.log("got a client", isRefreshLoopActive);
    isRefreshLoopActive = true;

    refreshWalletDataLoop();
  }

  function stopRefreshWalletDataLoop() {
    isRefreshLoopActive = false;
  }

  return {
    startRefreshWalletDataLoop,
    stopRefreshWalletDataLoop,
    transactionDisplay,
    myTransactionHistory,
    myBalance,
    myDashBalance,
    myFiatBalance,
  };
}
