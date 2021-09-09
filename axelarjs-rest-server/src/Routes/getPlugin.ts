'use strict';

import { Request, Server } from "@hapi/hapi";

const simpleGet = (request: Request): string => {

	console.log("Processing request", request.info.id);
	return "This is working!";

}

export const getPlugin = {
	name: 'getPlugin',
	version: '1.0.0',
	register: async (server: Server, options: any) => {

		server.route({
			method: 'GET',
			path: '/',
			handler: simpleGet
		});

		// etc ...
		// await someAsyncMethods(); what does this do?
	}
};