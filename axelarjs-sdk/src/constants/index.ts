export interface ISupportedChainType {
	symbol: string;
	name: string;
	assets: IAsset[];
}

export interface IAsset {
	symbol: string;
	name: string;
}

export type ISupportedChainList = ISupportedChainType[];

const bitcoin: ISupportedChainType = {
	symbol: "BTC",
	name: "Bitcoin",
	assets: [
		{ symbol: "BTC", name: "Bitcoin" }
	]
};

const axelar: ISupportedChainType = {
	symbol: "AXL",
	name: "Axelar",
	assets: [
		{ symbol: "AXL", name: "Axelar" }
	]
};

const ethereum: ISupportedChainType = {
	symbol: "ETH",
	name: "Ethereum",
	assets: [
		{ symbol: "axelarBTC", name: "Bitcoin" },
		{ symbol: "axelarPHOTON", name: "Photon" },
	]
};

//TODO: find API for these assets to be retrieved programmatically
const cosmos: ISupportedChainType = {
	symbol: "COS",
	name: "Cosmos",
	assets: [
		{ symbol: "uPHOTON", name: "Cosmos Hub" },
		{ symbol: "BNB", name: "Binance Coin" },
		{ symbol: "LUNA", name: "Terra" },
		{ symbol: "OKB", name: "OKExChain" },
		{ symbol: "CRO", name: "Crypto.com Coin" },
		{ symbol: "UST", name: "TerraUST" },
		{ symbol: "RUNE", name: "Thorchain" },
		{ symbol: "KCS", name: "KuCoin Token" },
		{ symbol: "OSMO", name: "Osmosis" },
		{ symbol: "SCRT", name: "Secret" },
		{ symbol: "KAVA", name: "Kava.io" },
		{ symbol: "FET", name: "Fetch.ai" },
		{ symbol: "INJ", name: "Injective Protocol" },
		{ symbol: "XPRT", name: "Persistence" },
		{ symbol: "MED", name: "Medibloc" },
		{ symbol: "ANC", name: "Anchor Protocol" },
		{ symbol: "BAND", name: "Band Protocol" },
		{ symbol: "AKT", name: "Akash Network" },
		{ symbol: "MIR", name: "Mirror Protocol" },
		{ symbol: "ROSE", name: "Oasis Network" },
		{ symbol: "DAWN", name: "Dawn Protocol" },
		{ symbol: "IRIS", name: "IRIS Network" },
		{ symbol: "CTK", name: "CertiK" },
		{ symbol: "EROWAN", name: "Sifchain" },
		{ symbol: "HARD", name: "Kava Lend" },
		{ symbol: "BLZ", name: "Bluzelle" },
		{ symbol: "ION", name: "Ion" },
		{ symbol: "LIKE", name: "LikeCoin" },
		{ symbol: "NGM", name: "e-Money" },
		{ symbol: "FOAM", name: "FOAM" },
		{ symbol: "SWTH", name: "Switcheo" },
		{ symbol: "SEFI", name: "Secret Finance" },
		{ symbol: "SIENNA", name: "Sienna" },
		{ symbol: "KEX", name: "Kira Network" },
		{ symbol: "ORAI", name: "Oraichain Token" },
		{ symbol: "DVPN", name: "Sentinel" },
		{ symbol: "IOV", name: "Starname" },
		{ symbol: "BTSG", name: "BitSong" },
		{ symbol: "REGEN", name: "Regen" },
		{ symbol: "BCNA", name: "BitCanna" },
	]
};

export const SupportedChains: ISupportedChainList = [
	// axelar,
	// bitcoin,
	cosmos,
	ethereum
]

