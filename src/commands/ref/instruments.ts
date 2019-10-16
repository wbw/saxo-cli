import chalk from "chalk";

const assetTypes = [
  "Bond", //	Bond.
  "Cash", //	Cash. Not tradeable!
  "CfdIndexOption", //	Cfd Index Option.
  "CfdOnFutures", //	Cfd on Futures.
  "CfdOnIndex", //	Cfd on Stock Index.
  "CfdOnStock", //	Cfd on Stock.
  "ContractFutures", // Contract Futures.
  "FuturesOption", // Futures Option.
  "FuturesStrategy", // Futures Strategy.
  "FxBinaryOption", // Forex Binary Option.
  "FxForwards", //	Forex Forward.
  "FxKnockInOption", // Forex Knock In Option.
  "FxKnockOutOption", //	Forex Knock Out Option.
  "FxNoTouchOption", // Forex No Touch Option.
  "FxOneTouchOption", //	Forex One Touch Option.
  "FxSpot", //	Forex Spot.
  "FxVanillaOption", // Forex Vanilla Option.
  "ManagedFund", // Obsolete: Managed Fund.
  "MutualFund", // Mutual Fund.
  "Stock", // Stock.
  "StockIndex", //	Stock Index.
  "StockIndexOption", //	Stock Index Option.
  "StockOption" // Stock Option.
];

export default function instruments(keyword: string, cmd: any): void {
  // param validation
  if (!cmd.assettypes.every((at: string) => assetTypes.includes(at))) {
    console.log(
      chalk.red("Error: invalid assettype(s), valid types are:\n\t") + "-" + chalk.green(`${assetTypes.join("\n\t-")}`)
    );
    return;
  }
  console.log(cmd.assettypes);
  cmd.parent.apiUrl = `ref/v1/instruments/?$top=${cmd.top}`;
  if (cmd.assettypes.length > 0) {
    cmd.parent.apiUrl = `${cmd.parent.apiUrl}&assettypes=${cmd.assettypes.join()}`;
  }
}
