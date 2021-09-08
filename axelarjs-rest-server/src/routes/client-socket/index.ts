import { Server } from "@hapi/hapi";
const Handlers = require('./handlers');

export const socketRegister = {
	name: "server-connection",
	version: "1.0.0",
	register: (server: Server, options: any) => {

		const io = require('socket.io')(server.listener);

		io.on('connection', function (socket: any) {

			console.log('New connection!');
			socket.on('hello', Handlers.hello);
			socket.on('newMessage', Handlers.newMessage);
			socket.on("/api/link/bitcoin", Handlers.btc2evm);
		});

	}
}