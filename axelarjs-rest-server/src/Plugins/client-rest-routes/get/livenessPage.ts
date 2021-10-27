import {Request} from "@hapi/hapi";
const package_json = require("../../../../package.json");

export const livenessPage = {
	method: 'GET',
		path: '/',
	handler: (request: Request): string => {
	console.log("Processing request", request.info.id);
	return `This is working! version: ${package_json.version}`;
}
}