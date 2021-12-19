import {Bech32Address} from "@keplr-wallet/cosmos";

const test = {};

https://github.com/chainapsis/keplr-wallet/blob/master/packages/mobile/src/config.ts#L995
const terraConfigs = {
	rpc: "https://rpc-columbus.keplr.app",
		rest: "https://lcd-columbus.keplr.app",
	chainId: "columbus-5",
	chainName: "Terra",
	stakeCurrency: {
	coinDenom: "LUNA",
		coinMinimalDenom: "uluna",
		coinDecimals: 6,
		coinGeckoId: "terra-luna",
},
	bip44: {
		coinType: 330,
	},
	bech32Config: Bech32Address.defaultBech32Config("terra"),
		currencies: [
	{
		coinDenom: "LUNA",
		coinMinimalDenom: "uluna",
		coinDecimals: 6,
		coinGeckoId: "terra-luna",
	},
	{
		coinDenom: "UST",
		coinMinimalDenom: "uusd",
		coinDecimals: 6,
		coinGeckoId: "terrausd",
	},
	{
		coinDenom: "KRT",
		coinMinimalDenom: "ukrw",
		coinDecimals: 6,
		coinGeckoId: "terrakrw",
	},
],
	feeCurrencies: [
	{
		coinDenom: "LUNA",
		coinMinimalDenom: "uluna",
		coinDecimals: 6,
		coinGeckoId: "terra-luna",
	},
	{
		coinDenom: "UST",
		coinMinimalDenom: "uusd",
		coinDecimals: 6,
		coinGeckoId: "terrausd",
	},
],
	gasPriceStep: {
	low: 0.015,
		average: 0.015,
		high: 0.015,
},
	features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
		hideInUI: true,
}

export default test;