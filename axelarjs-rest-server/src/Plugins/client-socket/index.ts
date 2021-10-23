import {Server}               from "@hapi/hapi";
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

		const io = require('socket.io')(server.listener, {
			cors: {
				origin: "*",
				credentials: true
			}
		});

		io.use(async (socket: any, next: any) => {
			const recaptchaResult = await handleRecaptcha(socket.handshake.auth.token);
			if (!recaptchaResult?.success || recaptchaResult?.score < 0.8) {
				console.log("invalid captcha authentication");
				next(new Error("invalid captcha authentication"));
			} else {
				console.log("good to go");
				next();
			}
		})

		io.on('connection', function (socket: any) {
			console.log('New connection!', socket?.id, server.settings.port);
			socket.on(ISocketListenerTypes.WAIT_FOR_AXL_DEPOSIT, Handlers.listenForAXLDeposit);
		});

	}
}