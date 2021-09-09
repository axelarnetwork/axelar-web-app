import { Server } from "@hapi/hapi";
import {TransferAssetTypes} from "@axelar-network/axelarjs-sdk";
const Handlers = require('./handlers');

export const socketRegister = {
	name: "server-connection",
	version: "1.0.0",
	register: (server: Server, options: any) => {

		const io = require('socket.io')(server.listener, {
			cors: {
				origin: "http://localhost:3000", // TODO: expand to all web ui access points
				methods: ["GET", "POST"],
				credentials: true
			}
		});

		io.on('connection', function (socket: any) {

			console.log('New connection!');
			socket.on('hello', Handlers.hello);
			socket.on('newMessage', Handlers.newMessage);
			socket.on(TransferAssetTypes.BTC_TO_EVM, Handlers.btc2evm);
			socket.on(TransferAssetTypes.EVM_TO_BTC, Handlers.btc2evm);
		});

	}
}