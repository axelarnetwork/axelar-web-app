import {WalletInterface}               from "./WalletInterface";
import {SigningStargateClient, StdFee} from "@cosmjs/stargate";
import {OfflineSigner}                 from "@cosmjs/launchpad";
import {ethers}                        from "ethers";
import {CosmosAccount,}                from '@keplr-wallet/stores';
import { Coin }                        from "cosmjs-types/cosmos/base/v1beta1/coin"
import {ChainInfo}                     from "@keplr-wallet/types";

declare const window: Window &
	typeof globalThis & {
	keplr: any;
}

export class KeplrWallet implements WalletInterface {

	public CHAIN_ID: string;
	public RPC_ENDPOINT: string;
	public CHAIN_INFO: ChainInfo;

	public constructor(chainName: "axelar" | "terra") {
		const configs = require(`config/wallet/axelarnet/${process.env.REACT_APP_STAGE}.ts`).default;
		const configForChain = configs[chainName];


		this.CHAIN_ID = configForChain?.chainId;
		this.RPC_ENDPOINT = configForChain?.rpcEndpoint;
		this.CHAIN_INFO = configForChain?.chainInfo;
		console.log(this.CHAIN_ID, this.RPC_ENDPOINT, this.CHAIN_INFO, chainName, configForChain);

		this.connectToWallet();
		// window.addEventListener("keplr_keystorechange", () => {
		// 	console.log("account changed!");
		// 	this.connectToWallet();
		// });
	}

	public isWalletInstalled(): boolean {
		return !!window.keplr;
	}

	public async connectToWallet(): Promise<any> {

		if (!this.isWalletInstalled()) {
			this.installWallet();
			return;
		}

		try {
			await window.keplr.enable(this.CHAIN_ID);
		} catch (e) {
			console.log("KeplrWallet connectToWallet - unable to connect to wallet natively, so trying experimental chain", e);
			try {
				await window.keplr.experimentalSuggestChain(this.CHAIN_INFO);
				await window.keplr.enable(this.CHAIN_ID);
			} catch(e2: any) {
				console.log("and yet there is a problem in trying to do that too",e2);
			}
		}
		const _signer = await window.keplr.getOfflineSigner(this.CHAIN_ID);
		const [account] = await _signer.getAccounts();
		console.log(account);
	}

	public installWallet(): void {
		alert("TODO: need to install wallet first");
	}

	public async getAddress(): Promise<string> {
		const _signer = await this.getSigner();
		const [account] = await _signer.getAccounts();
		return account.address;
	}

	public async getBalance(denom: string): Promise<number> {
		const cosmjs = await this.getSigningClient();
		const balanceResponse: Coin = await cosmjs.getBalance(await this.getAddress(), denom);
		const balance = ethers.utils.formatUnits(balanceResponse.amount, 6);
		return +balance;
	}

	public async getSigner(): Promise<OfflineSigner> {
		const signer: OfflineSigner = window.keplr?.getOfflineSigner(this.CHAIN_ID);
		return signer;
	}

	public async getSigningClient(): Promise<SigningStargateClient> {
		const cosmjs = await SigningStargateClient.connectWithSigner(this.RPC_ENDPOINT, await this.getSigner());
		return cosmjs;
	}

	public async switchChain(chainId: string) {
		this.CHAIN_ID = chainId;
		await this.connectToWallet();
	}

	public async transferTokens(depositAddress: string, amount: string): Promise<any> {

		const senderAddress = await this.getAddress(),
			cosmjs = await this.getSigningClient();

		const sendCoin = {
			denom: "uaxl",
			amount: ethers.utils.parseUnits(amount, 6).toString()
		};
		const fee: StdFee = {
			gas: "5000000",
			amount: [{denom: "uaxl", amount: "30000"}]
		};
		// const txRaw = await cosmjs.sign(
		// 	senderAddress,
		// 	[
		// 		{
		// 			typeUrl: "/cosmos.bank.v1beta1.MsgSend",
		// 			value: {
		// 				fromAddress: senderAddress,
		// 				toAddress: depositAddress,
		// 				amount: [sendCoin]
		// 			}
		// 		}
		// 	],
		// 	fee,
		// 	"",
		// 	undefined
		// );
		//
		// const txBytes = TxRaw.encode(txRaw).finish();
		//
		// const result = await cosmjs.broadcastTx(txBytes);


		const result = await cosmjs.sendTokens(senderAddress, depositAddress, [sendCoin], fee)

		console.log("results", result);
	}

	// TODO: get this to work
	public async ibcTransfer(recipient: any) {
		const destChannelId: any = "";
		const counterpartyChainId: any = "";
		const amountConfig: any = {
			amount: "1",
			currency: "uusd"
		}
		const cosmosAccount = new CosmosAccount({} as any, {} as any, {} as any, {} as any)
		await cosmosAccount.sendIBCTransferMsg(
			{
				portId: 'transfer',
				channelId: destChannelId,
				counterpartyChainId,
			},
			amountConfig.amount,
			amountConfig.currency,
			recipient,
			'',
			undefined,
			undefined,
			{
				onBroadcasted: (txHash: Uint8Array) => {
					console.log("TODO... whatever we want", txHash);
				},
				onFulfill: tx => {
					if (!tx.code) {
						const events = tx?.events as
							| { type: string; attributes: { key: string; value: string }[] }[]
							| undefined;
						if (events) {
							for (const event of events) {
								if (event.type === 'send_packet') {
									const attributes = event.attributes;
									const sourceChannelAttr = attributes.find(
										attr => attr.key === Buffer.from('packet_src_channel').toString('base64')
									);
									const sourceChannel = sourceChannelAttr
										? Buffer.from(sourceChannelAttr.value, 'base64').toString()
										: undefined;
									const destChannelAttr = attributes.find(
										attr => attr.key === Buffer.from('packet_dst_channel').toString('base64')
									);
									const destChannel = destChannelAttr
										? Buffer.from(destChannelAttr.value, 'base64').toString()
										: undefined;
									const sequenceAttr = attributes.find(
										attr => attr.key === Buffer.from('packet_sequence').toString('base64')
									);
									const sequence = sequenceAttr
										? Buffer.from(sequenceAttr.value, 'base64').toString()
										: undefined;
									const timeoutHeightAttr = attributes.find(
										attr => attr.key === Buffer.from('packet_timeout_height').toString('base64')
									);
									const timeoutHeight = timeoutHeightAttr
										? Buffer.from(timeoutHeightAttr.value, 'base64').toString()
										: undefined;

									if (sourceChannel && destChannel && sequence) {
										console.log("success?", tx, timeoutHeight);
									}
								}
							}
						}
					}
				},
			}
		)

	}

}