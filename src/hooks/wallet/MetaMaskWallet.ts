import {AssetInfo, ChainInfo, EthersJsTokenMap, getConfigs} from "@axelar-network/axelarjs-sdk";
import axios                                                from "axios";
import {BigNumber, Contract, ethers}                        from "ethers";
import MetaMaskOnboarding                                   from '@metamask/onboarding';
import {erc20Abi}                                           from "config/wallet/evm/erc20Abi";
import {ChainParam}                                         from "config/wallet/evm/testnet";
import {TxResult, WalletInterface}                          from "./WalletInterface";
import {SendLogsToServer}                                   from "../../api/SendLogsToServer";

declare const window: Window &
	typeof globalThis & {
	ethereum: any;
}
export type TxOption = {
	maxFeePerGas?: BigNumber;
	gasPrice?: BigNumber;
};

export interface MetamaskTransferEvent {
	txHash: string;
	tokenContractAddress: string;
	receiver: string;
	amount: string;
	error: string;
	blockNumber: string;
}

/*
*
TODO: this is a good article on listening to eth balances
https://medium.com/@clashofcoins/how-to-fetch-eth-balance-in-react-with-hooks-89e48ed6e842
*
* */
export class MetaMaskWallet implements WalletInterface {

	private provider: ethers.providers.Web3Provider;
	private signer: ethers.providers.JsonRpcSigner;
	private tokenMap: EthersJsTokenMap;
	private chainName: string;
	private nodeServerUrl: string;

	public constructor(chainName?: string) {
		console.log("instantiating Metamask");
		if (!chainName)
			chainName = "ethereum";
		this.chainName = chainName;
		this.nodeServerUrl = getConfigs(process.env.REACT_APP_STAGE as string).resourceUrl;
		this.provider = new ethers.providers.Web3Provider(window.ethereum, "any"); //2nd param is network type
		this.signer = this.provider.getSigner();
		this.tokenMap = getConfigs(process.env.REACT_APP_STAGE as string).ethersJsConfigs[chainName.toLowerCase()].tokenAddressMap;
		console.log("tokenMap", this.tokenMap);
	}

	public getSigner(): ethers.providers.JsonRpcSigner {
		return this.signer;
	}

	public isWalletInstalled(): boolean {
		const {ethereum} = window;
		return Boolean(ethereum && ethereum.isMetaMask);
	};

	public isWalletConnected(chainName?: string): boolean {
		if (!chainName) chainName = "ethereum";
		const params: ChainParam = require(`config/wallet/evm/${process.env.REACT_APP_STAGE}.ts`).default[chainName];
		// console.log("params",params.chainId,Number(params.chainId) === this.getCurrentNetworkId(),this.getCurrentNetworkId());
		return Number(params.chainId) === this.getCurrentNetworkId();
	}

	public async connectToWallet(): Promise<"added" | "exists" | "error" | null> {
		try {
			await this.provider.send("eth_requestAccounts", []);
			return "added";
		} catch (err: any) {
			console.log("connecting error",err);
			return "error";
		}
	}

	public async connectToChain(): Promise<"added" | "exists" | "error" | null> {

		let text: "added" | "exists" | "error" | null = "error";

		if (!this.isWalletInstalled()) {
			console.log("need to install wallet");
			this.installWallet();
			return null;
		} else {
			const params: ChainParam = require(`config/wallet/evm/${process.env.REACT_APP_STAGE}.ts`).default[this.chainName];

			try {
				await window.ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{chainId: params.chainId}],
				});
				text = "exists";
			} catch (switchError: any) {
				console.warn("error adding chain, so trying wallet_addEthereumChain",params);
				if (switchError.code === 4902) { // This error code indicates that the chain has not been added to MetaMask.
					try {
						await window.ethereum.request({
							method: 'wallet_addEthereumChain',
							params: [params],
						});
						text = "added";
					} catch (addError) {
						// handle "add" error
						console.warn("error adding chain to metamask",addError);
						return text;
					}
				}
				// handle other "switch" errors
			}
			await this.getAddress();
			return text;
		}
	}

	public installWallet(): void {
		new MetaMaskOnboarding({forwarderOrigin: window.location.href}).startOnboarding();
	}

	public getCurrentNetworkId(): Number {
		return Number(window.ethereum?.networkVersion);
	}

	public async switchChain(chainName: string): Promise<boolean> {
		this.chainName = chainName;
		// if (!this.isWalletConnected(chainName))
		await this.connectToChain();
		return true;
	}

	// public async isWalletConnected(): Promise<boolean> {
	// 	return (await this.provider.send("eth_requestAccounts", []))?.length > 0;
	// }

	public async getAddress(): Promise<string> {
		await this.provider.send("eth_requestAccounts", []);
		this.signer = await this.provider.getSigner();
		const address = await this.signer.getAddress();
		console.log("address", address);
		return address;
	}

	public async getBalance(assetInfo: AssetInfo): Promise<number> {

		const tokenContractAddress: string = await this.getOrFetchTokenAddress(assetInfo);
		const signer = await this.getSigner().getAddress()
		const contract: Contract = this.getEthersContract(tokenContractAddress);
		const decimals = await contract.decimals();
		const balance = (await contract.balanceOf(signer)).toString();
		return +ethers.utils.formatUnits(balance, decimals);
	}

	public async getOrFetchTokenAddress(assetInfo: AssetInfo): Promise<string> {

		const tokenSymbol: string = assetInfo.assetSymbol as string;
		let tokenContract: string = "";

		if (this.tokenMap[tokenSymbol]) {
			tokenContract = this.tokenMap[tokenSymbol] as string;
		} else {
			const endpoint = `/getTokenAddress?module=evm&chain=${this.chainName.toLowerCase()}&asset=${assetInfo.common_key}`;
			try {
				const response = await axios.get(this.nodeServerUrl + endpoint);
				tokenContract = response.data.data;
				this.tokenMap[tokenSymbol] = tokenContract;
			} catch (error) {
				console.error(error);
			}
		}
		return tokenContract;
	}

	public async transferTokens(receiver: string, amount: string | BigNumber, asset: AssetInfo): Promise<MetamaskTransferEvent> {

		const response: MetamaskTransferEvent = {
			txHash: "",
			tokenContractAddress: "",
			receiver,
			amount: "",
			error: "",
			blockNumber: ""
		};

		let userAddress = await this.getAddress();
		const tokenContractAddress: string = await this.getOrFetchTokenAddress(asset);
		const ethersContract = this.getEthersContract(tokenContractAddress);

		response.tokenContractAddress = tokenContractAddress;
		try {
			receiver = ethers.utils.getAddress(receiver);
		} catch {
			response.error += `, Invalid address: ${receiver}, `;
		}

		try {
			amount = ethers.utils.parseUnits(amount as string, 6);
			if (amount.isNegative()) {
				throw new Error();
			}
		} catch (e) {
			console.error(`Invalid amount: ${amount}` + e);
			response.error += `, Invalid amount: ${amount}`;
		}

		const balance = await ethersContract.balanceOf(userAddress);

		if (balance.lt(amount)) {
			let amountFormatted = ethers.utils.formatUnits(amount, 6);
			let balanceFormatted = ethers.utils.formatUnits(balance, 6);
			console.error(`Insufficient balance receiver send ${amountFormatted} (You have ${balanceFormatted})`);
			response.error += `, Insufficient balance receiver send ${amountFormatted} (You have ${balanceFormatted})`;
		}

		const txOptions = createFeeTxOption(this.signer);

		const tx = await ethersContract.transfer(receiver, amount, txOptions);
		response.txHash = tx.hash;

		const receipt = await tx.wait();
		response.blockNumber = receipt.blockNumber;

		return response;

	}

	public confirmEtherTransaction(txHash: string, confirmations: number, confirmInterval: number, cb: any) {
		setTimeout(async () => {
			const numConfirmations = (await this.provider.getTransaction(txHash)).confirmations;
			cb({numConfirmations});
			if (numConfirmations >= confirmations)
				return;
			return this.confirmEtherTransaction(txHash, confirmations, confirmInterval, cb);
		}, confirmInterval * 1000);
	}

	private getEthersContract(tokenAddress: string) {
		console.log("token address", tokenAddress);
		return new ethers.Contract(tokenAddress, erc20Abi, this.signer);
	}

	public establishAccountChangeListeners(listener: () => void): Promise<boolean> {
		console.log("MetaMask wallet; NEED TO IMPLEMENT establishAccountChangeListeners");

		/*update balance on fetch*/
		this.provider.on("block",console.log);
		/*update account on change*/

		/*delete this*/
		window.addEventListener("click", listener)
		return new Promise((resolve) => resolve(true));
	}

	public eventListeners(currentAsset?: AssetInfo | null) {
		console.log("i was clicked")

		if (currentAsset)
			return this.getBalance(currentAsset);
	}

	public removeAccountChangeListeners(listener: () => void): Promise<boolean> {
		console.log("MetaMask wallet; NEED TO IMPLEMENT removeAccountChangeListeners");

		/*update balance on fetch*/
		this.provider.off("block",listener);

		/*update account on change*/

		/*delete this*/
		window.removeEventListener("click", listener)
		return new Promise((resolve) => resolve(true));
	}

	public getCurrentNetwork() {
		return "";
	}

	public async handleTransferRequest(sourceChainSelection: ChainInfo, depositAddressInfo: AssetInfo, amountToDeposit: string, selectedSourceAsset: AssetInfo, statusCb: () => void, transactionTraceId: string): Promise<TxResult> {
		const chainName = sourceChainSelection.chainName.toLowerCase() as string;
		await this.switchChain(chainName);
		const tokenAddress = await this.getOrFetchTokenAddress(selectedSourceAsset);
		let results: MetamaskTransferEvent;
		try {
			results= await this.transferTokens(
				depositAddressInfo?.assetAddress as string,
				(amountToDeposit || 0).toString(),
				selectedSourceAsset as AssetInfo
			);
		} catch (error: any) {
			results = error;
		}
		console.log("token address on", sourceChainSelection?.chainName, tokenAddress, results);
		return this.handleTransferResult(sourceChainSelection, results, statusCb, transactionTraceId);
	}

	public handleTransferResult(sourceChainSelection: ChainInfo, results: any, statusCb: () => void, transactionTraceId: string): TxResult {
		const txResult: TxResult = {
			isTxSuccess: false,
			txHash: "",
			feedback: ""
		}
		if (results.txHash && results.blockNumber) {
			txResult.isTxSuccess = true;
			txResult.txHash = results.txHash;
			const confirmInterval: number = sourceChainSelection?.chainName.toLowerCase() === "ethereum" ? 15 : 2;
			this.confirmEtherTransaction(
				results.txHash,
				sourceChainSelection?.confirmLevel as number,
				confirmInterval,
				statusCb
			);
			SendLogsToServer.info("DEPOSIT_CONFIRMATION", "deposit made within app: " + JSON.stringify(results), transactionTraceId);
		} else if (results.error.length > 0) {
			txResult.feedback = "Something went wrong";
			SendLogsToServer.error("DEPOSIT_CONFIRMATION", "user failed to send tx: " + JSON.stringify(results), transactionTraceId);
		}
		return txResult;

	}
}

export async function createFeeTxOption(signer: ethers.providers.JsonRpcSigner): Promise<TxOption> {
	const feeData = await signer.getFeeData();
	const txOptions: TxOption = {};
	if (feeData.maxFeePerGas) {
		txOptions.maxFeePerGas = feeData.maxFeePerGas.mul(12).div(10);
	} else {
		txOptions.gasPrice = feeData?.gasPrice?.mul(2);
	}
	return txOptions;
}