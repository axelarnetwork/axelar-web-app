import {ChainInfo}     from "@keplr-wallet/types";
import {Bech32Address} from "@keplr-wallet/cosmos";

/*Terra testnet*/
const TERRA_CHAIN_ID: string = "bombay-12";
const TERRA_RPC: string = "https://bombay-lcd.terra.dev";
const TERRA_REST = "https://bombay-lcd.terra.dev";
const terraChainInfo: ChainInfo = {
	rpc: TERRA_RPC,
	rest: TERRA_REST,
	chainId: TERRA_CHAIN_ID,
	chainName: "Terra",
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

const AXELAR_CHAIN_ID: string = "axelar-testnet-lisbon";
const AXELAR_RPC: string = "http://localhost:26657";
const AXELAR_REST = "http://localhost:1317";
const axelarChainInfo: ChainInfo = {
	rpc: AXELAR_RPC,
	rest: AXELAR_REST,
	chainId: AXELAR_CHAIN_ID,
	chainName: "Axelar",
	stakeCurrency: { coinDenom: "AXL", coinMinimalDenom: "uaxl", coinDecimals: 6 },
	bech32Config: Bech32Address.defaultBech32Config("axelar"),
	walletUrlForStaking: "https://www.testnet.keplr.app/#/axelar/stake",
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
export interface KeplrWalletChainConfig {
	restEndpoint: string;
	chainId: string;
	rpcEndpoint: string;
	chainInfo: ChainInfo;
}
export const axelar: KeplrWalletChainConfig = {
	restEndpoint: AXELAR_REST,
	chainId: AXELAR_CHAIN_ID,
	rpcEndpoint: AXELAR_RPC,
	chainInfo: axelarChainInfo
}

export const terra: KeplrWalletChainConfig = {
	restEndpoint: TERRA_REST,
	rpcEndpoint: TERRA_RPC,
	chainId: TERRA_CHAIN_ID,
	chainInfo: terraChainInfo
}

export const allChains = {
	axelar,
	terra
}
export default allChains;