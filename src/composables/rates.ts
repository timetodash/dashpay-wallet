import { ref } from "vue";
import axios from "axios";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const pairs = ref<any>([]);

export default function useRates() {
  async function fetchPairs() {
    const result = await axios.get("https://rates2.dashretail.org/symbols");
    const pairs = result.data
      .filter((pair: string) => pair.substr(0, 4) === "DASH")
      .map((pair: string) => {
        return { pair, fiatSymbol: pair.substr(5, pair.length) };
      })
      .sort((a: any, b: any) => {
        return a.fiatSymbol > b.fiatSymbol;
      });

    console.log("pairs :>> ", pairs);
    return pairs;
  }

  async function fetchRate(fiatSymbol: string) {
    const result = await axios.get(
      `https://rates2.dashretail.org/rates?source=dashretail&symbol=dash${fiatSymbol}`
    );
    const rate = result.data[0];
    console.log("rate :>> ", rate);
    return rate;
  }

  return {
    fetchPairs,
    fetchRate,
  };
}
