import {AssetInfo} from "@axelar-network/axelarjs-sdk";

export interface TxResult {
	isTxSuccess: boolean;
	txHash: string;
	feedback: string;
}
export interface WalletInterface {

	isWalletInstalled(): boolean;
	installWallet(): void;

	isWalletConnected(chainName?: string): boolean;
	connectToWallet(): Promise<"added" | "exists" | "error" | null>;

	getAddress(): Promise<string>;

	getBalance(assetInfo: AssetInfo): Promise<any>;

	getSigner(): any;

	switchChain(chain?: string): Promise<boolean> | Promise<"added" | "exists" | "error" | null>;

	transferTokens(receiver: string, amount: string, asset: string | AssetInfo): void;

	handleTransferRequest(...args: any[]): Promise<any>;

	handleTransferResult(...args: any[]): any;

	establishAccountChangeListeners(listener: () => void): Promise<boolean>;

	removeAccountChangeListeners(listener: () => void): Promise<boolean>;

	getCurrentNetwork(): string;

}