import {TendermintEventType, TendermintSubscriptionResponse} from "../WebSocketClient";
import {BaseListener}                                        from "../BaseListener";

export default class DepositAddressListener extends BaseListener {

	private static chainAliasMap: { [key: string]: string } = {
		"cosmos": "axelarnet"
	}

	constructor() {
		super();
	}

	public listen(sourceChain: string, destinationChain: string, destinationAddress: string) {

		return new Promise(async (resolve, reject) => {

			await super.initialize();

			// a cosmos link is really an axelarnet link
			if (DepositAddressListener.chainAliasMap[sourceChain])
				sourceChain = DepositAddressListener.chainAliasMap[sourceChain];

			const event: TendermintEventType = "Tx";
			const query: any = {
				'link.module': sourceChain,
				'link.destinationChain': destinationChain,
				'link.destinationAddress': destinationAddress
			};
			const handler = (data: TendermintSubscriptionResponse) => {
				const destinationAddress: any = this.parseDestinationAddress(data);
				console.log("destination address", destinationAddress);
				resolve(destinationAddress);
				// this.client.destroy();
			}

			super.subscribe(event, query, handler);

		});

	}

	private parseDestinationAddress(data: any): string {
		//TODO: ... is there a better (less brittle) way of doing this?
		return JSON.parse(data.value.TxResult.result.log)[0]
		.events[0]
		.attributes
		.find((attribute: any) => attribute.key === 'depositAddress')
		?.value;
	}
}