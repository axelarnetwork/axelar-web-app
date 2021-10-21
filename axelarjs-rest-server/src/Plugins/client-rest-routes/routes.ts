'use strict';

import {Request, Server} from "@hapi/hapi";
import {transferAsset}   from "./post/transferAsset";
const package_json = require("../../../package.json");

export const routes = {
	name: 'routes',
	version: '1.0.0',
	register: async (server: Server, options: any) => {

		server.route({
			method: 'GET',
			path: '/',
			handler: (request: Request): string => {
				console.log("Processing request", request.info.id);
				return `This is working! version: ${package_json.version}`;
			}
		});

		server.route(transferAsset);

		// etc ...
		// await someAsyncMethods(); what does this do?
	}
};