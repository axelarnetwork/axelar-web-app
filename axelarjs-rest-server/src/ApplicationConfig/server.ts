'use strict';

import Hapi from "@hapi/hapi";
import { Request, Server } from "@hapi/hapi";
import { getPlugin } from "../Routes/getPlugin";
import { socketRegister } from "../Routes/client-socket";

export let server: Server;

export const init = async function(): Promise<Server> {

	server = Hapi.server({
		port: process.env.PORT || 4000,
		host: 'localhost',
		routes: {
			cors: true
		}
	});

	await server.register({
		plugin: getPlugin,
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