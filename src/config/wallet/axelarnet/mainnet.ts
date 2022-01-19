import {Bech32Address}          from "@keplr-wallet/cosmos";
import {ChainInfo}              from "@keplr-wallet/types";
import {KeplrWalletChainConfig} from "./interface";

const TERRA_CHAIN_ID: string = "columbus-5";
const TERRA_RPC: string = `https://axelar-cors-redirect.herokuapp.com/https://columbus-5--rpc--full.datahub.figment.io`;
const TERRA_REST = `https://axelar-cors-redirect.herokuapp.com/https://columbus-5--lcd--full.datahub.figment.io`;
const TERRA_CHANNEL_MAP = {
	"axelar": "channel-19"
}
const terraMainnetConfigs: ChainInfo = {
	rpc: TERRA_RPC + `/apikey/${process.env.REACT_APP_FIGMENT_API_KEY}`,
	rest: TERRA_REST + `/apikey/${process.env.REACT_APP_FIGMENT_API_KEY}`,
	chainId: TERRA_CHAIN_ID,
	chainName: "Terra",
	stakeCurrency: {coinDenom: "LUNA", coinMinimalDenom: "uluna", coinDecimals: 6, coinGeckoId: "terra-luna",},
	bip44: {
		coinType: 330,
	},
	bech32Config: Bech32Address.defaultBech32Config("terra"),
	currencies: [
		{coinDenom: "LUNA", coinMinimalDenom: "uluna", coinDecimals: 6, coinGeckoId: "terra-luna",},
		{coinDenom: "UST", coinMinimalDenom: "uusd", coinDecimals: 6, coinGeckoId: "terrausd",},
		{coinDenom: "KRT", coinMinimalDenom: "ukrw", coinDecimals: 6, coinGeckoId: "terrakrw",},
	],
	feeCurrencies: [
		{coinDenom: "LUNA", coinMinimalDenom: "uluna", coinDecimals: 6, coinGeckoId: "terra-luna",},
		{coinDenom: "UST", coinMinimalDenom: "uusd", coinDecimals: 6, coinGeckoId: "terrausd",},
	],
	gasPriceStep: {low: 0.015, average: 0.015, high: 0.015},
	features: ["stargate", "ibc-transfer", "no-legacy-stdTx"]
}


const AXELAR_CHAIN_ID: string = "axelar-dojo-1";
const AXELAR_RPC: string = process.env.REACT_APP_AXELAR_RPC as string;
const AXELAR_REST = process.env.REACT_APP_AXELAR_LCD as string;
const AXELAR_CHANNEL_MAP = {
	"terra": "channel-0"
}
const axelarChainInfo: ChainInfo = {
	rpc: AXELAR_RPC,
	rest: AXELAR_REST,
	chainId: AXELAR_CHAIN_ID,
	chainName: "Axelar",
	stakeCurrency: {coinDenom: "AXL", coinMinimalDenom: "uaxl", coinDecimals: 6},
	bech32Config: Bech32Address.defaultBech32Config("axelar"),
	bip44: {
		coinType: 118
	},
	currencies: [
		{coinDenom: "AXL", coinMinimalDenom: "uaxl", coinDecimals: 6}
	],
	feeCurrencies: [
		{coinDenom: "AXL", coinMinimalDenom: "uaxl", coinDecimals: 6}
	],
	gasPriceStep: {low: 0.05, average: 0.125, high: 0.2},
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
	chainInfo: terraMainnetConfigs,
	channelMap: TERRA_CHANNEL_MAP
}

export const allChains = {
	axelar,
	terra
}
export default allChains;