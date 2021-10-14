'use strict';

import Hapi, {Server}    from "@hapi/hapi";
import {routes}          from "../Plugins/client-rest-routes/routes";
import {socketRegister}  from "../Plugins/client-socket";
import {HealthPlugin}    from "hapi-k8s-health";
import {WebSocketClient} from "../services/DepositAddressListener/WebSocketClient";

export let server: Server;

export const init = async function (): Promise<Server> {

	server = Hapi.server({
		port: process.env.PORT,
		routes: {
			cors: true
		}
	});

	await server.register({
		plugin: routes,
		options: {
			message: 'hello'
		}
	});

	await server.register({
		plugin: socketRegister,
		options: {
			message: 'helloSocket'
		}
	});

	await server.register({
		plugin: HealthPlugin,
		options: {
			livenessProbes: {
				status: () => Promise.resolve('Yeah !')
			},
			readinessProbes: {
				health: () => Promise.resolve('ready TODO')
			}
		}
	});

	return server;
};

export const start = async (): Promise<void> => {

	console.log(`Listening on ${server.settings.host}:${server.settings.port}`);

	return server.start();

};

process.on('unhandledRejection', (err) => {

	console.error("unhandledRejection");
	console.error(err);
	process.exit(1);

});