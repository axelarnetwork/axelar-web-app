import {TendermintEventType, TendermintSubscriptionResponse, WebSocketClient} from "./WebSocketClient";

const client: WebSocketClient = new WebSocketClient("ws://localhost:26667/websocket");

export const startTendermintSocketForDestinationAddress = () => {

	return new Promise(async (resolve, reject) => {

		await client.initialize();

		const event: TendermintEventType = "Tx";
		const query: any = {
			'link.module': 'bitcoin',
			// 'link.module': ['bitcoin'],
			// 'link.chain': 'bitcoin',
			'link.destinationChain': 'Ethereum',
		};
		const handler = (data: TendermintSubscriptionResponse) => {
			resolve(parseForDestinationAddress(data));
			client.destroy();
		}

		client.subscribe(event, query, handler);

	});

};

const parseForDestinationAddress = (data: any) => {
	//TODO: WTH.... is there a better (less brittle) way of doing this?
	return JSON.parse(data.value.TxResult.result.log)[0].events[0].attributes.find((attribute: any) => attribute.key === 'depositAddress')?.value;
}