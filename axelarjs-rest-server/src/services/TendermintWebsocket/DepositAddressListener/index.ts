import {TendermintEventType, TendermintSubscriptionResponse} from "../WebSocketClient";
import {BaseListener}                                        from "../BaseListener";

export default class DepositAddressListener extends BaseListener {

	private static chainAliasMap: { [key: string]: string } = {
		"cosmos": "axelarnet",
		"ethereum": "evm"
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
			// a cosmos link is really an axelarnet link
			if (destinationChain?.toLowerCase() === "cosmos" && DepositAddressListener.chainAliasMap[destinationChain?.toLowerCase()])
				destinationChain = DepositAddressListener.chainAliasMap[destinationChain.toLowerCase()];

			const event: TendermintEventType = "Tx";

			let query: any;

			//TODO: I don't know why these are the events... this is madness.
			if (destinationChain === "axelarnet") {
				query = {
					'message.module': sourceChain,
					'message.destinationChain': destinationChain,
					'message.address': destinationAddress
				}
			} else {
				query = {
					'link.module': sourceChain,
					'link.destinationChain': destinationChain,
					'link.destinationAddress': destinationAddress
				}
			}

			const handler = (data: TendermintSubscriptionResponse) => {
				const destinationAddress: any = this.parseDestinationAddress(data, sourceChain);
				console.log("destination address", destinationAddress);
				if (destinationAddress)
					resolve(destinationAddress);
				else
					reject("could not resolve destination address");
				// this.client.destroy();
			}

			super.subscribe(event, query, handler);

		});

	}

	private parseDestinationAddress(data: any, sourceChain: string): string {

		const field: string = sourceChain === "evm" ? "burnAddress" : "depositAddress";

		console.log(JSON.stringify(data));
		//TODO: ... is there a better (less brittle) way of doing this?
		return JSON.parse(data.value.TxResult.result.log)[0].events[0].attributes
		.find((attribute: any) => attribute.key === field)?.value;
	}
}

/*
NOTES:

Query for mint Cosmos >> Ethereum:
~~~~~SUBSCRIBING tm.event='Tx' AND link.module='axelarnet' AND link.destinationChain='Ethereum' AND link.destinationAddress='0x74Ccd7d9F1F40417C6F7fD1151429a2c44c34e6d'

Query needed for Ethereum >> Axelarnet:
0: {key: 'action', value: 'Link'}
1: {key: 'module', value: 'evm'}
2: {key: 'chain', value: 'ethereum'}
3: {key: 'burnAddress', value: '0x937Dc9AFD82342F1E5F82Dd444c1199322fCf7B7'}
4: {key: 'address', value: 'axelar1vacnefnxhxyt3slarl2rtwaq3xrcd7v2slelqe'}
5: {key: 'destinationChain', value: 'axelarnet'}
6: {key: 'tokenAddress', value: '0xb1bfDBcd65292792f8fB4036a718e1b5C01fec0C'},
so link.module='evm' AND link.destinationChain='axelarnet' AND link.address='axelar1vacnefnxhxyt3slarl2rtwaq3xrcd7v2slelqe'
*
* */