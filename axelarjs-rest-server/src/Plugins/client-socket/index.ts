import {Server}               from "@hapi/hapi";
import Boom                   from "@hapi/boom";
import {ISocketListenerTypes} from "@axelar-network/axelarjs-sdk";
import {handleRecaptcha}      from "../helpers";

const Handlers = require('./handlers');

/**
 * This plugin is used for the socket connection between the webapp and rest-server.
 */
export const socketRegister = {
	name: "server-connection",
	version: "1.0.0",
	register: (server: Server, options: any) => {

		handleRecaptcha(options?.auth?.token).then((recaptchaResult: any) => {

			if (!recaptchaResult?.success || recaptchaResult?.score < 0.6) {
				return Boom.forbidden("bad recaptcha verification");
			}

			const io = require('socket.io')(server.listener, {
				cors: {
					origin: "*",
					credentials: true
				}
			});

			io.on('connection', function (socket: any) {
				console.log('New connection!', socket?.id, server.settings.port);
				socket.on(ISocketListenerTypes.WAIT_FOR_AXL_DEPOSIT, Handlers.listenForAXLDeposit);
			});

		}).catch((error: any) => {

			return Boom.boomify(error);

		});

	}
}