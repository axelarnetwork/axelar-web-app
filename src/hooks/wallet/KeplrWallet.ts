import {AssetInfo}                     from "@axelar-network/axelarjs-sdk";
import {SigningStargateClient, StdFee} from "@cosmjs/stargate";
import {OfflineSigner}                 from "@cosmjs/launchpad";
import {ethers}                        from "ethers";
import {Coin}                          from "cosmjs-types/cosmos/base/v1beta1/coin"
import {ChainInfo}                     from "@keplr-wallet/types";
import Long                            from "long";
import {Height}                        from "cosmjs-types/ibc/core/client/v1/client";
import {KeplrWalletChainConfig}        from "config/wallet/axelarnet/interface";
import {WalletInterface}               from "./WalletInterface";
import {getKeplrFromWindow}            from "@keplr-wallet/stores";

declare const window: Window &
	typeof globalThis & {
	keplr: any;
}

export class KeplrWallet implements WalletInterface {

	public CHAIN_ID: string;
	public RPC_ENDPOINT: string;
	public CHAIN_INFO: ChainInfo;
	public CONFIG_FOR_CHAIN: KeplrWalletChainConfig;

	public constructor(chainName?: "axelar" | "terra") {
		console.log("instantiating Keplr");
		if (!chainName) chainName = "axelar";
		const configs = require(`config/wallet/axelarnet/${process.env.REACT_APP_STAGE}.ts`).default;
		const configForChain = configs[chainName];
		this.CHAIN_ID = configForChain?.chainId;
		this.RPC_ENDPOINT = configForChain?.rpcEndpoint;
		this.CHAIN_INFO = configForChain?.chainInfo;
		this.CONFIG_FOR_CHAIN = configForChain;
		console.log(process.env.REACT_APP_STAGE, this.CHAIN_ID, this.RPC_ENDPOINT, this.CHAIN_INFO, chainName, configForChain);

		// this.connectToWallet();
		// window.addEventListener("keplr_keystorechange", () => {
		// 	console.log("account changed!");
		// 	this.connectToWallet();
		// });
	}

	public isWalletInstalled(): boolean {
		return !!window.keplr;
	}

	public isWalletConnected(chainName?: string): boolean {
		if (!chainName) chainName = "axelar";
		const configs = require(`config/wallet/axelarnet/${process.env.REACT_APP_STAGE}.ts`).default;
		const configForChain = configs[chainName];
		return this.isWalletInstalled() && this.CHAIN_ID === configForChain?.chainId;
	}

	public async connectToWallet(): Promise<"added" | "exists" | "error" | null> {
		if (!this.isWalletInstalled()) {
			this.installWallet();
			return null;
		}
		await getKeplrFromWindow();
		return "added";

	}
	public async connectToChain(): Promise<"added" | "exists" | "error" | null> {

		let text: "added" | "exists" | "error" | null = "error";

		if (!this.isWalletInstalled()) {
			this.installWallet();
			return null;
		}

		try {
			await window.keplr.enable(this.CHAIN_ID);
			text = "exists";
		} catch (e) {
			console.log("KeplrWallet connectToWallet - unable to connect to wallet natively, so trying experimental chain", e, this.CHAIN_INFO, this.CHAIN_ID);
			try {
				await window.keplr.experimentalSuggestChain(this.CHAIN_INFO);
				await window.keplr.enable(this.CHAIN_ID);
				text = "added";
			} catch (e2: any) {
				console.log("and yet there is a problem in trying to do that too", e2);
				return text;
			}
		}
		const _signer = await window.keplr.getOfflineSigner(this.CHAIN_ID);
		const [account] = await _signer.getAccounts();
		console.log(account);
		return text;
	}

	public installWallet(): void {
		const confirm = window.confirm("Install wallet first here?");
		if (confirm) {
			window.open('https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap?hl=en', '_blank')
		}
	}

	public async getAddress(): Promise<string> {
		const _signer = await this.getSigner();
		const [account] = await _signer.getAccounts();
		return account.address;
	}

	public async getBalance(assetInfo: AssetInfo): Promise<number> {
		const denom: string = assetInfo.common_key as string;
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

	public updateChainConfigs(chainName: string): void {
		const configs = require(`config/wallet/axelarnet/${process.env.REACT_APP_STAGE}.ts`).default;
		const configForChain = configs[chainName];
		this.CHAIN_ID = configForChain?.chainId;
		this.RPC_ENDPOINT = configForChain?.rpcEndpoint;
		this.CHAIN_INFO = configForChain?.chainInfo;
		this.CONFIG_FOR_CHAIN = configForChain;
		console.log(this.CHAIN_ID, this.RPC_ENDPOINT, this.CHAIN_INFO, chainName, configForChain);
	}
	public async switchChain(chainName: string): Promise<"added" | "exists" | "error" | null> {
		this.updateChainConfigs(chainName);
		// const configs = require(`config/wallet/axelarnet/${process.env.REACT_APP_STAGE}.ts`).default;
		// const configForChain = configs[chainName];
		// this.CHAIN_ID = configForChain?.chainId;
		// this.RPC_ENDPOINT = configForChain?.rpcEndpoint;
		// this.CHAIN_INFO = configForChain?.chainInfo;
		// this.CONFIG_FOR_CHAIN = configForChain;
		// console.log(this.CHAIN_ID, this.RPC_ENDPOINT, this.CHAIN_INFO, chainName, configForChain);
		return await this.connectToChain();
	}

	public async transferTokens(depositAddress: string, amount: string): Promise<any> {

		const senderAddress = await this.getAddress(),
			cosmjs = await this.getSigningClient();

		const sendCoin = {
			denom: "uaxl",
			amount: ethers.utils.parseUnits(amount, 6).toString()
		};
		const fee: StdFee = {
			gas: "150000",
			amount: [{denom: "uaxl", amount: "30000"}]
		};

		let result;
		try {
			result = await cosmjs.sendTokens(senderAddress, depositAddress, [sendCoin], fee)
		} catch (error: any) {
			throw new Error(error);
		}

		console.log("results", result);
	}

	public async ibcTransferFromTerra(recipient: any, coinToSend: Coin) {
		const senderAddress = await this.getAddress();
		const cosmjs = await this.getSigningClient();
		const PORT: string = "transfer";
		const AXELAR_CHANNEL_ID: string = this.CONFIG_FOR_CHAIN.channelMap["axelar"];
		const fee: StdFee = {
			gas: "150000",
			amount: [{denom: "uluna", amount: "30000"}]
		};
		const timeoutHeight: Height = {
				revisionHeight: Long.fromNumber(10),
				revisionNumber: Long.fromNumber(10),
			},
			timeoutTimestamp = 0;

		try {
			const res = await cosmjs.sendIbcTokens(
				senderAddress,
				recipient,
				coinToSend,
				PORT,
				AXELAR_CHANNEL_ID,
				timeoutHeight,
				timeoutTimestamp,
				fee);
			console.log(res);
			return res;
		} catch (err: any) {
			console.log("unsuccessful IBC transfer", err);
			throw new Error(err)
		}

	}

	public establishAccountChangeListeners(): Promise<boolean> {
		console.log("Keplr wallet; NEED TO IMPLEMENT establishAccountChangeListeners");
		return new Promise((resolve) => resolve(true));
	}

	public removeAccountChangeListeners(): Promise<boolean> {
		console.log("Keplr wallet; NEED TO IMPLEMENT removeAccountChangeListeners");
		return new Promise((resolve) => resolve(true));
	}

	public getCurrentNetwork() {
		return this.CHAIN_ID;
	}

	public handleTransferRequest() {
		return new Promise((resolve) => resolve(true));
		// throw new Error("todo need to implement");
	}

	public handleTransferResult() {
		// throw new Error("todo need to implement");
	}

}