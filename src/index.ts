// Node
import http, { IncomingMessage, ServerResponse } from "http";
import urlParser from "url";
import querystring from "querystring";
import fs from "fs";
import events from "events";
// NPM
import axios from "axios";
import open from "open";
// Local
import commander from "./commands";
const config = require("../saxoAppDetails.json");

let accessTokenData: any;
try {
  accessTokenData = require("../accessToken.json");
} catch {
  accessTokenData = {};
}

const port = 3333;
const hostname = "127.0.0.1";

const eventEmitter = new events.EventEmitter();
const server = http.createServer();

function filterItems(cmd: any, items: any) {
  if (cmd.properties) {
    if (Array.isArray(items)) {
      items = items.map((item: any) => filterItem(item));
    } else return filterItem(items);
  }

  return items;

  function filterItem(item: any) {
    let filteredItem: any = {};
    cmd.properties.forEach((property: string) => (filteredItem[property] = item[property]));
    return filteredItem;
  }
}

eventEmitter
  .on("Authenticated", (accessToken: any) => {
    console.log("authenticated!");
    if (!accessToken.activation_timestamp) {
      // Add activation date/time, if missing
      accessToken.activation_timestamp = Date.now();
    }
    fs.writeFileSync("accessToken.json", JSON.stringify(accessToken));

    axios.defaults.headers.common["Authorization"] = `${accessTokenData.token_type} ${accessTokenData.access_token}`;

    let cmd = commander.parse(process.argv);
    console.log(`apiUrl=${cmd.apiUrl}`);
    if (cmd.apiUrl) {
      axios
        .get(`${config.OpenApiBaseUrl}${cmd.apiUrl}`)
        .then(response => {
          let items = response.data.Data ? response.data.Data : response.data;
          items = filterItems(cmd, items);
          console.log(JSON.stringify(items, null, " "));
          process.exit();
        })
        .catch(error => {
          if (error.response.data) {
            console.log(error.response.data.Message);
          } else {
            console.log(`${error.response.status}-${error.response.statusText}`);
          }
          process.exit(0);
        });
    }
  })
  .on("AuthenticationFailed", () => {
    fs.writeFileSync("accessToken.json", JSON.stringify({}));
    console.log("Failed to authenticate, please try again!");
  });

// Is there a previous token?
// Is our token still valid?
// If not, is our refresk token still valid?
// If not, do a new logon
if (accessTokenData.access_token) {
  const deltaSeconds = Math.ceil((Date.now() - accessTokenData.activation_timestamp) / 1000);
  if (deltaSeconds < accessTokenData.expires_in) {
    // should have valid token
    eventEmitter.emit("Authenticated", accessTokenData);
  } else if (deltaSeconds < accessTokenData.refresh_token_expires_in) {
    // need to refresh
    refreshToken();
  } else {
    // need to authenticate again
    authenticate();
  }
} else {
  // No old token, need to authenticate again
  authenticate();
}

function authenticate() {
  // No token, so start a local server to receive auth-code and fireup a browser with the logon page
  server.on("request", onRequest);
  server.on("close", () => {
    console.log("server closed");
  });
  server.listen(port, hostname, () => {
    console.log(`Server up and running at http://${hostname}:${port}`);
    open(`http://${hostname}:${port}`);
  });
}

function refreshToken() {
  console.log("refreshToken");
  axios
    .post(
      config.TokenEndpoint,
      querystring.stringify({
        grant_type: "refresh_token", //config.GrantType,
        refresh_token: accessTokenData.refresh_token,
        redirect_uri: config.RedirectUrls[0]
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${config.AppKey}:${config.AppSecret}`).toString("base64")}`
        }
      }
    )
    .then(response => {
      console.log("refreshedToken");
      accessTokenData = response.data;
      eventEmitter.emit("Authenticated", accessTokenData);
    })
    .catch(error => {
      console.log(error.response.status);
      console.log(error.response.statusText);
      eventEmitter.emit("AuthenticationFailed");
    });
}

function onRequest(serverRequest: IncomingMessage, serverResponse: ServerResponse) {
  const { method, url, headers } = serverRequest;
  let body: any = [];
  serverRequest
    .on("error", error => {
      console.error(error);
    })
    .on("data", chunk => {
      body.push(chunk);
    })
    .on("end", () => {
      body = Buffer.concat(body).toString();
      const parsedUrl = urlParser.parse(url!);
      // Only 1 url allowed
      if (parsedUrl.pathname === "/") {
        serverResponse.writeHead(302, {
          Location: `${config.AuthorizationEndpoint}?response_type=code&client_id=${config.AppKey}&redirect_uri=${config.RedirectUrls[0]}`
        });
        serverResponse.end();
      } else if (parsedUrl.pathname === "/ssocallback") {
        const params = new URLSearchParams(parsedUrl.search);
        // Use the AuthorizationCode to get an AccessToken
        const code = params.get("code");
        axios
          .post(
            config.TokenEndpoint,
            querystring.stringify({
              grant_type: "authorization_code",
              code,
              redirect_uri: config.RedirectUrls[0]
            }),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(`${config.AppKey}:${config.AppSecret}`).toString("base64")}`
              }
            }
          )
          .then(response => {
            accessTokenData = response.data;
            serverResponse.statusCode = 200;
            serverResponse.setHeader("Content-Type", "text/html");
            serverResponse.end("<script>close();</script>");
            server.close();
            eventEmitter.emit("Authenticated", accessTokenData);
          })
          .catch(error => {
            console.log(error);
            serverResponse.statusCode = 200;
            serverResponse.setHeader("Content-Type", "text/html");
            serverResponse.end(
              `<h1>${error}</h1>Click <a href='${config.AuthorizationEndpoint}?response_type=code&client_id=${config.AppKey}&redirect_uri=${config.RedirectUrls[0]}'>here</a> to try again...`
            );
          });
      }
    });
}
// const server = http.createServer((serverRequest, serverResponse) => {
// 	const { method, url, headers } = serverRequest;

// 	let body:any = [];
// 	serverRequest
// 		.on("error", error => {
// 			console.error(error);
// 		})
// 		.on("data", chunk => {
// 			body.push(chunk);
// 		})
// 		.on("end", () => {
// 			body = Buffer.concat(body).toString();

// 			const parsedUrl = urlParser.parse(url!);
// 			const params = new URLSearchParams(parsedUrl.search);

//       switch (parsedUrl.pathname) {
// 				case "/":
//           if (!accessTokenData.access_token) {
//             console.log("NO TOKEN");
//             serverResponse.writeHead(302, { Location: `${config.AuthorizationEndpoint}?response_type=code&client_id=${config.AppKey}&redirect_uri=${config.RedirectUrls[0]}`});
//             serverResponse.end();
//           }
//           else {
//             console.log("OLD TOKEN");
//             // We have a saved token, attempt to 'refresh' the token, if we fail, clear the token and redirect home
//             axios
//               .post(
//                 config.TokenEndpoint,
//                 querystring.stringify({
//                   grant_type: "refresh_token",//config.GrantType,
//                   refresh_token: accessTokenData.refresh_token,
//                   redirect_uri: config.RedirectUrls[0]
//                 }),
//                 {
//                   headers: {
//                     "Content-Type": "application/x-www-form-urlencoded",
//                     Authorization: `Basic ${Buffer.from(`${config.AppKey}:${config.AppSecret}`).toString("base64")}`
//                   }
//                 }
//               )
//               .then(response => {
//                 accessTokenData = response.data;
//                 fs.writeFileSync("../accessToken.json", JSON.stringify(accessTokenData));
//                 serverResponse.writeHead(302, { Location: "/instrument" });
//                 serverResponse.end();
//               })
//               .catch(error => {
//                 console.log(error);
//                 accessTokenData = {};
//                 serverResponse.writeHead(302, { Location: "/" });
//                 serverResponse.end();
//               });
//           }
// 					break;
// 				case "/ssocallback":
//             // Use the AuthorizationCode to get an AccessToken
// 					const code = params.get("code");
// 					axios
// 						.post(
// 							config.TokenEndpoint,
// 							querystring.stringify({
// 								grant_type: "authorization_code",//config.GrantType,
// 								code,
// 								redirect_uri: config.RedirectUrls[0]
// 							}),
// 							{
// 								headers: {
// 									"Content-Type": "application/x-www-form-urlencoded",
// 									Authorization: `Basic ${Buffer.from(`${config.AppKey}:${config.AppSecret}`).toString("base64")}`
// 								}
// 							}
// 						)
// 						.then(response => {
//               accessTokenData = response.data;
//               fs.writeFileSync("../accessToken.json", JSON.stringify(accessTokenData));
//               serverResponse.writeHead(302, { Location: "/instrument" });
//               serverResponse.end();
//             })
// 						.catch(error => {
//               console.log(error);
//               serverResponse.statusCode = 200;
//               serverResponse.setHeader("Content-Type", "text/html");
//               serverResponse.end(`<h1>${error}</h1>Click <a href='/'>here</a> to try again...`);
//             });
//           break;
//         case "/instrument":
//           axios.get(`${config.OpenApiBaseUrl}ref/v1/instruments?keywords=air`, {
//             headers: {
//               Authorization: `${accessTokenData.token_type} ${accessTokenData.access_token}`
//             }
//           })
//           .then(response => {
//             serverResponse.statusCode = 200;
//             serverResponse.setHeader("Content-Type", "text/plain");
//             serverResponse.end(JSON.stringify(response.data));
//           })
//           .catch(error => {
//             console.log(error);
//             if (error.response.status === 401) {
//               serverResponse.writeHead(302, { Location: "/" });
//               serverResponse.end();
//             }
//             else {
//               console.log(error);
//               serverResponse.statusCode = 200;
//               serverResponse.setHeader("Content-Type", "text/plain");
//               serverResponse.end(error);
//             }
//           });
//           break;
// 			}
// 		});
// });

// server.listen(port, hostname, () => {
// 	console.log(`Server up and running at http://${hostname}:${port}`);
// });
