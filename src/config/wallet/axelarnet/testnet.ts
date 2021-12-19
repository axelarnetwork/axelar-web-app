import {ChainInfo}              from "@keplr-wallet/types";
import {Bech32Address}          from "@keplr-wallet/cosmos";
import {KeplrWalletChainConfig} from "./interface";

const TERRA_CHAIN_ID: string = "bombay-12";
const TERRA_RPC: string = `https://axelar-cors-redirect.herokuapp.com/https://bombay-12--rpc--full.datahub.figment.io`;
const TERRA_REST = `https://axelar-cors-redirect.herokuapp.com/https://bombay-12--lcd--full.datahub.figment.io`;
const TERRA_CHANNEL_MAP = {
	"axelar": "channel-55"
}
const terraChainInfo: ChainInfo = {
	rpc: TERRA_RPC + `/apikey/${process.env.REACT_APP_FIGMENT_API_KEY}`,
	rest: TERRA_REST + `/apikey/${process.env.REACT_APP_FIGMENT_API_KEY}`,
	chainId: TERRA_CHAIN_ID,
	chainName: "Terra Bombay-12",
	stakeCurrency: { coinDenom: "LUNA", coinMinimalDenom: "uluna", coinDecimals: 6 },
	bech32Config: Bech32Address.defaultBech32Config("terra"),
	walletUrlForStaking: "https://www.testnet.keplr.app/#/axelar/stake",
	bip44: { coinType: 118 },
	currencies: [
		{ coinDenom: "LUNA", coinMinimalDenom: "uluna", coinDecimals: 6 },
		{ coinDenom: "UST", coinMinimalDenom: "uusd", coinDecimals: 6 }
	],
	feeCurrencies: [
		{ coinDenom: "LUNA", coinMinimalDenom: "uluna", coinDecimals: 6 }
	],
	gasPriceStep: { low: 0.05, average: 0.125, high: 0.2 },
	features: ["stargate", "no-legacy-stdTx", "ibc-transfer"]
};

const AXELAR_CHAIN_ID: string = "axelar-testnet-lisbon-2";
const AXELAR_RPC: string = process.env.REACT_APP_AXELAR_RPC as string;
const AXELAR_REST = process.env.REACT_APP_AXELAR_LCD as string;
const AXELAR_CHANNEL_MAP = {
	"terra": "channel-0"
}
const axelarChainInfo: ChainInfo = {
	rpc: AXELAR_RPC,
	rest: AXELAR_REST,
	chainId: AXELAR_CHAIN_ID,
	chainName: "Axelar Lisbon-2",
	stakeCurrency: { coinDenom: "AXL", coinMinimalDenom: "uaxl", coinDecimals: 6 },
	bech32Config: Bech32Address.defaultBech32Config("axelar"),
	bip44: {
		coinType: 118
	},
	currencies: [
		{ coinDenom: "AXL", coinMinimalDenom: "uaxl", coinDecimals: 6 }
	],
	feeCurrencies: [
		{ coinDenom: "AXL", coinMinimalDenom: "uaxl", coinDecimals: 6}
	],
	gasPriceStep: { low: 0.05, average: 0.125, high: 0.2 },
	features: ["stargate", "no-legacy-stdTx", "ibc-transfer"]
};
export const axelar: KeplrWalletChainConfig = {
	restEndpoint: AXELAR_REST,
	chainId: AXELAR_CHAIN_ID,
	rpcEndpoint: AXELAR_RPC,
	chainInfo: axelarChainInfo,
	channelMap: AXELAR_CHANNEL_MAP
}

export const terra: KeplrWalletChainConfig = {
	restEndpoint: TERRA_REST,
	rpcEndpoint: TERRA_RPC,
	chainId: TERRA_CHAIN_ID,
	chainInfo: terraChainInfo,
	channelMap: TERRA_CHANNEL_MAP
}

export const allChains = {
	axelar,
	terra
}
export default allChains;