export enum SupportedTokenSymbols {
	BTC = "BTC",
	AXL = "AXL",
	EVM = "EVM"
}
export enum SupportedTokenNames {
	BTC = "Bitcoin",
	AXL = "Axelar",
	EVM = "EVM"
}
export interface ISupportedChainType {
	symbol: SupportedTokenSymbols;
	name: SupportedTokenNames;
	assets: IAsset[];
}

export interface IAsset {
	symbol: string;
	name: string;
}

export type ISupportedChainList = ISupportedChainType[];

const bitcoin: ISupportedChainType = {
	symbol: SupportedTokenSymbols.BTC,
	name: SupportedTokenNames.BTC,
	assets: [
		{ symbol: "BTC", name: "Bitcoin" }
	]
};

const axelar: ISupportedChainType = {
	symbol: SupportedTokenSymbols.AXL,
	name: SupportedTokenNames.AXL,
	assets: [
		{ symbol: "AXL", name: "Axelar" }
	]
};

const ethereum: ISupportedChainType = {
	symbol: SupportedTokenSymbols.EVM,
	name: SupportedTokenNames.EVM,
	assets: [
		{ symbol: "ETH", name: "Ether" },
		{ symbol: "axelarBTC", name: "Wrapped Bitcoin" },
		{ symbol: "axelarPHOTON", name: "Wrapped Photon" },
	]
};

export const SupportedChains: ISupportedChainList = [
	axelar,
	bitcoin,
	ethereum
]

