'use strict';

import Hapi, {Server}    from "@hapi/hapi";
import {routesPlugin}    from "../Plugins/client-rest-routes/routes";
import {socketPlugin}    from "../Plugins/client-socket";
import {restRateLimiter} from "../MiddleWare/RestRateLimiter";
import {healthPlugin}    from "../Plugins/health/healthPlugin";

export let server: Server;

export const init = async function (): Promise<Server> {

	server = Hapi.server({
		port: process.env.PORT,
		host: process.env.HOST,
		routes: {
			cors: true
		}
	});

	await server.register(healthPlugin);
	await server.register(routesPlugin);
	await server.register(socketPlugin);
	await server.register(restRateLimiter);

	return server;
};

export const start = async (): Promise<void> => {
	console.log(`Listening on ${server.settings.host}:${server.settings.port}`);
	return server.start();
};

process.on('unhandledRejection', (err) => {
	console.error("unhandledRejection", err);
	process.exit(1);
});