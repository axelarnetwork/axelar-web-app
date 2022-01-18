import {AssetInfo} from "@axelar-network/axelarjs-sdk";

export interface WalletInterface {

	isWalletInstalled(): boolean;
	installWallet(): void;

	isWalletConnected(chainName?: string): boolean;
	connectToWallet(): void;

	getAddress(): Promise<string>;

	getBalance(assetInfo: AssetInfo): Promise<any>;

	getSigner(): any;

	switchChain(chain?: string): Promise<boolean>;

	transferTokens(receiver: string, amount: string, asset: string | AssetInfo): void;

	establishAccountChangeListeners(): Promise<boolean>;

	removeAccountChangeListeners(): Promise<boolean>;

	getCurrentNetwork(): string;

}