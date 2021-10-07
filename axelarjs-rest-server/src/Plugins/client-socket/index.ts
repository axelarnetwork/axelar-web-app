//TODO: I think this won't be needed so we can delete?
import {Server}             from "@hapi/hapi";
import {TransferAssetTypes} from "@axelar-network/axelarjs-sdk";

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
				origin: "http://localhost:3000", // TODO: expand to all web ui access points
				credentials: true
			}
		});

		io.on('connection', function (socket: any) {
			console.log('New connection!', socket?.id, server.settings.port);
			socket.on(TransferAssetTypes.BTC_TO_EVM, Handlers.btc2evm);
			socket.on(TransferAssetTypes.EVM_TO_BTC, Handlers.btc2evm);
		});

	}
}