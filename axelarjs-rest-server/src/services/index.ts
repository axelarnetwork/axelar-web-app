import {TendermintSubscriptionResponse, WebSocketClient} from "./WebSocketClient";

const client: WebSocketClient = new WebSocketClient("ws://localhost:26667/websocket");

const startSocker = async () => {

	await client.initialize();

	const handler = (data: TendermintSubscriptionResponse) => {

		console.log(data.value);

		client.destroy();

	};

	client.subscribe(
		'Tx',
		{
			'message.action': 'send',
			'message.sender': ['CONTAINS', 'terra1...'],
		},
		handler
	);

};