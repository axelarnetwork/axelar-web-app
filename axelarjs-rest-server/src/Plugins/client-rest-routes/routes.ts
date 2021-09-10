'use strict';

import {Request, Server} from "@hapi/hapi";
import {transferAsset} from "./post/transferAsset";

export const routes = {
	name: 'routes',
	version: '1.0.0',
	register: async (server: Server, options: any) => {

		server.route({
			method: 'GET',
			path: '/',
			handler: (request: Request): string => {
				console.log("Processing request", request.info.id);
				return "This is working!";
			}
		});

		server.route(transferAsset);

		// etc ...
		// await someAsyncMethods(); what does this do?
	}
};