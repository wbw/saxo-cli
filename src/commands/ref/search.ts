import axios from 'axios';
const config = require("../../../saxoAppDetails.json");

export default function search(keyword: string, cmd: any): void {
	axios
		.get(`${config.OpenApiBaseUrl}ref/v1/instruments?keywords=${keyword}&$top=${cmd.top}`)
		.then(response => {
			console.log(JSON.stringify(response.data.Data, null, " "));
			process.exit();
		})
		.catch(error => {
			console.log(error);
		});
}
