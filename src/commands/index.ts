import commander from "commander";

// ClientServices
import activities from "./cs/activities";
// Platform
import articles from "./platform/articles";
// Portfolio
import positions from "./port/positions";
import netPositions from "./port/netPositions";
import closedPositions from "./port/closedPositions";
import orders from "./port/orders";
import balances from "./port/balances";
import accounts from "./port/accounts";
import accountGroups from "./port/accountGroups";
import clientDetails from "./port/clientDetails";
import exposure from "./port/exposure";
import users from "./port/users";
// Reference
import search from "./ref/search";
import instrument from "./ref/instrument";
import exchanges from "./ref/exchanges";
import currencies from "./ref/currencies";
import cultures from "./ref/cultures";
import languages from "./ref/languages";
import timezones from "./ref/timezones";
import algostrategies from "./ref/algostrategies";
// RootServices
import features from "./root/features";
import sessions from "./root/sessions";
import user from "./root/user";

export default commander;

const commaSeparatedList = (value: string, dummyPrevious: any): string[] => value.split(",");

commander
  .name("saxo-cli")
  .version(require("../../package").version)
  .usage("[global-options] <command> [cmd-options]")
  .option(
    "-p --properties <propertynames>",
    "comma separated list of properties to output from the command",
    commaSeparatedList
  );

// ClientServices

commander
  .command("activities <clientKey>")
  .description("Get activities")
  .action(activities);

// Reference

commander
  .command("search <keyword>")
  .description("search for instruments")
  .option("-t, --top <number>", "return top <number> of matching instruments", 10)
  .action(search);

commander
  .command("instrument <uic> [assetType]")
  .description("show instrument details")
  .action(instrument);

commander
  .command("exchanges [exchangeId]")
  .description("show all exchanges or a specific exchange")
  .action(exchanges);

commander
  .command("currencies")
  .description("show all currencies")
  .action(currencies);

commander
  .command("cultures")
  .description("show all cultures")
  .action(cultures);

commander
  .command("languages")
  .description("show all languages")
  .action(languages);

commander
  .command("timezones")
  .description("show all timezones")
  .action(timezones);

commander
  .command("algostrategies [strategy]")
  .description("show all strategies supported by Saxo Bank or details on given strategy")
  .action(algostrategies);

// Portfolio

commander
  .command("positions")
  .description("show positions")
  .action(positions);

commander
  .command("netpositions")
  .description("show net positions")
  .action(netPositions);

commander
  .command("closedpositions")
  .description("show closed positions")
  .action(closedPositions);

commander
  .command("orders")
  .description("show all open orders")
  .action(orders);

commander
  .command("balances")
  .description("show balances")
  .action(balances);

commander
  .command("accounts")
  .description("show all accounts")
  .action(accounts);

commander
  .command("accountgroups")
  .description("show all account groups")
  .action(accountGroups);

commander
  .command("clients")
  .description("show client details")
  .action(clientDetails);

commander
  .command("exposure")
  .description("show net instrument exposure")
  .action(exposure);

commander
  .command("users")
  .description("show user details")
  .action(users);

// Root

commander
  .command("features")
  .description("Get the availability of all features")
  .action(features);

commander
  .command("sessions")
  .description("Get the session capabilities")
  .action(sessions);

commander
  .command("user")
  .description("Get information of current user")
  .action(user);

// Platform

commander
  .command("articles")
  .description("Get list of articles from Sitecore based on provided filters")
  .action(articles);

if (!process.argv.slice(2).length) {
  commander.outputHelp();
  process.exit(0);
}

// commander.on("command:currencies", listener => {
//   console.log("here");
//   console.dir(listener);
// });
