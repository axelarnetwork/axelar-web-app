import {TendermintEventType, TendermintSubscriptionResponse} from "../WebSocketClient";
import {BaseListener}                                        from "../BaseListener";

export default class DepositAddressListener extends BaseListener {

	constructor() {
		super();
	}

	public listen(sourceChain: string, destinationChain: string, destinationAddress: string) {

		return new Promise(async (resolve, reject) => {

			await super.initialize();

			const event: TendermintEventType = "Tx";

			super.subscribe(event,
				getQuery(sourceChain, destinationChain, destinationAddress),
				(data: TendermintSubscriptionResponse) => {
					const destinationAddress: any = this.parseDestinationAddress(data, sourceChain);
					console.log("destination address", destinationAddress);
					if (destinationAddress)
						resolve(destinationAddress);
					else
						reject("could not resolve destination address");
				}
			);

		});

	}

	private parseDestinationAddress(data: any, sourceChain: string): string {

		const field: string = sourceChain === "ethereum" ? "burnAddress" : "depositAddress";
		return JSON.parse(data.value.TxResult.result.log)[0]?.events[0]?.attributes
		?.find((attribute: any) => attribute.key === field)?.value;
	}
}

/*
@Jackson, this is the helper method I mentioned in the earlier call. 
The queries are constructed on line 66 and 72, and the notes show the "working" queries in either direction (and how this was derived)
*/
const getQuery = (sourceChain: string, destinationChain: string, destinationAddress: string) => {
	const AXELAR_NET = "axelarnet";
	const sourceMap: { [key: string]: string } = {
		"cosmos": AXELAR_NET, // a cosmos link is really an axelarnet link
		"axelar": AXELAR_NET, // a cosmos link is really an axelarnet link
		"ethereum": "evm"     // ethereum is part of the evm module
	}
	const destinationMap: { [key: string]: string } = {
		"cosmos": AXELAR_NET, // a cosmos link is really an axelarnet link
		"axelar": AXELAR_NET  // a cosmos link is really an axelarnet link
	}

	let query: any;

	if (sourceMap[sourceChain?.toLowerCase()])
		sourceChain = sourceMap[sourceChain.toLowerCase()];
	if (destinationMap[destinationChain?.toLowerCase()])
		destinationChain = destinationMap[destinationChain.toLowerCase()];

	if (AXELAR_NET.includes(destinationChain)) {
		query = { // note 'message' module vs 'link' module
			'message.module': sourceChain,
			'message.destinationChain': AXELAR_NET,
			'message.address': destinationAddress // NOTE 'address' vs destinationAddress
		}
	} else {
		query = { // note 'link' module vs 'message' module
			'link.module': sourceChain,
			'link.destinationChain': destinationChain,
			'link.destinationAddress': destinationAddress // / NOTE 'destinationAddress' vs address
		}
	}
	return query;
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
