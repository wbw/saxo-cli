import axios from 'axios';
const config = require("../../../saxoAppDetails.json");

export default function instrument(uic: string, assetType: string): void {
  assetType = assetType || "stock";
  console.log(`instrument ${uic} ${assetType}`);
  axios
    .get(`${config.OpenApiBaseUrl}ref/v1/instruments/details/${uic}/${assetType}`)
    .then(response => {
      console.log(JSON.stringify(response.data, null, " "));
      process.exit();
    })
    .catch(error => {
      console.log(error);
    });
}
