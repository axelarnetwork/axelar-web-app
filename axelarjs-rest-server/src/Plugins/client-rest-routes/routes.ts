'use strict';

import {Server} from "@hapi/hapi";
import {transferAsset}   from "./post/transferAsset";
import {livenessPage}    from "./get/livenessPage";

const routes = {
	name: 'routes',
	version: '1.0.0',
	register: async (server: Server, options: any) => {
		server.route(livenessPage);
		server.route(transferAsset);
	}
};

export const routesPlugin = {
	plugin: routes,
	options: {
		message: 'routes plugin'
	}
}