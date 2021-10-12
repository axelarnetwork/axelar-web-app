import {TendermintEventType, TendermintSubscriptionResponse, WebSocketClient} from "./WebSocketClient";

const connectionString: string = process.env.WEBSOCKET_URL as string;
console.log("websocket connection string: ", connectionString);

const client: WebSocketClient = new WebSocketClient(connectionString);

export const startTendermintSocketForDepositAddress = () => {

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