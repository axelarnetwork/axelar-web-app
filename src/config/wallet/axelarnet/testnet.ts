import { ChainInfo } from "@keplr-wallet/types"
import { Bech32Address } from "@keplr-wallet/cosmos"
import { KeplrWalletChainConfig } from "./interface"

const OSMOSIS_CHAIN_ID: string = "osmo-test-3"
const OSMOSIS_RPC: string = "https://testnet-rpc.osmosis.zone"
const OSMOSIS_REST = "https://testnet-rest.osmosis.zone"
const OSMOSIS_CHANNEL_MAP = {
  axelar: "channel-198",
}

const osmosisChainInfo: ChainInfo = {
  rpc: OSMOSIS_RPC,
  rest: OSMOSIS_REST,
  chainId: OSMOSIS_CHAIN_ID,
  chainName: "Osmosis",
  stakeCurrency: {
    coinDenom: "OSMO",
    coinMinimalDenom: "uosmo",
    coinDecimals: 6,
    coinGeckoId: "osmosis",
    coinImageUrl: "https://dhj8dql1kzq2v.cloudfront.net/white/osmo.png",
  },
  bip44: {
    coinType: 118,
  },
  bech32Config: Bech32Address.defaultBech32Config("osmo"),
  currencies: [
    {
      coinDenom: "OSMO",
      coinMinimalDenom: "uosmo",
      coinDecimals: 6,
      coinGeckoId: "osmosis",
      coinImageUrl: "https://dhj8dql1kzq2v.cloudfront.net/white/osmo.png",
    },
    {
      coinDenom: "ION",
      coinMinimalDenom: "uion",
      coinDecimals: 6,
      coinGeckoId: "ion",
      coinImageUrl:
        "https://dhj8dql1kzq2v.cloudfront.net/white/osmosis-ion.png",
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "OSMO",
      coinMinimalDenom: "uosmo",
      coinDecimals: 6,
      coinGeckoId: "osmosis",
      coinImageUrl: "https://dhj8dql1kzq2v.cloudfront.net/white/osmo.png",
    },
  ],
  coinType: 118,
  gasPriceStep: {
    low: 0,
    average: 0,
    high: 0.025,
  },
  features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"]
}

const TERRA_CHAIN_ID: string = "bombay-12"
const TERRA_RPC: string = process.env.REACT_APP_TERRA_RPC as string
const TERRA_REST = process.env.REACT_APP_TERRA_LCD as string
const TERRA_CHANNEL_MAP = {
  axelar: "channel-78",
}
const terraChainInfo: ChainInfo = {
  rpc: TERRA_RPC,
  rest: TERRA_REST,
  chainId: TERRA_CHAIN_ID,
  chainName: "Terra Bombay-12",
  stakeCurrency: {
    coinDenom: "LUNA",
    coinMinimalDenom: "uluna",
    coinDecimals: 6,
  },
  bech32Config: Bech32Address.defaultBech32Config("terra"),
  walletUrlForStaking: "https://www.testnet.keplr.app/#/axelar/stake",
  bip44: { coinType: 330 },
  currencies: [
    { coinDenom: "LUNA", coinMinimalDenom: "uluna", coinDecimals: 6 },
    { coinDenom: "UST", coinMinimalDenom: "uusd", coinDecimals: 6 },
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
  gasPriceStep: { low: 0.05, average: 0.125, high: 0.2 },
  features: ["stargate", "no-legacy-stdTx", "ibc-transfer"],
}

const AXELAR_CHAIN_ID: string = "axelar-testnet-lisbon-3"
const AXELAR_RPC: string = process.env.REACT_APP_AXELAR_RPC as string
const AXELAR_REST = process.env.REACT_APP_AXELAR_LCD as string
const AXELAR_CHANNEL_MAP = {
  terra: "channel-0",
}
const axelarChainInfo: ChainInfo = {
  rpc: AXELAR_RPC,
  rest: AXELAR_REST,
  chainId: AXELAR_CHAIN_ID,
  chainName: "Axelar Lisbon 3",
  stakeCurrency: {
    coinDenom: "AXL",
    coinMinimalDenom: "uaxl",
    coinDecimals: 6,
  },
  bech32Config: Bech32Address.defaultBech32Config("axelar"),
  bip44: {
    coinType: 118,
  },
  currencies: [
    { coinDenom: "AXL", coinMinimalDenom: "uaxl", coinDecimals: 6 },
    {
      coinDenom: "UST",
      coinMinimalDenom:
        "ibc/6F4968A73F90CF7DE6394BF937D6DF7C7D162D74D839C13F53B41157D315E05F",
      coinDecimals: 6,
    },
  ],
  feeCurrencies: [
    { coinDenom: "AXL", coinMinimalDenom: "uaxl", coinDecimals: 6 },
  ],
  gasPriceStep: { low: 0.05, average: 0.125, high: 0.2 },
  features: ["stargate", "no-legacy-stdTx", "ibc-transfer"],
}
export const axelar: KeplrWalletChainConfig = {
  restEndpoint: AXELAR_REST,
  chainId: AXELAR_CHAIN_ID,
  rpcEndpoint: AXELAR_RPC,
  chainInfo: axelarChainInfo,
  channelMap: AXELAR_CHANNEL_MAP,
}

export const terra: KeplrWalletChainConfig = {
  restEndpoint: TERRA_REST,
  rpcEndpoint: TERRA_RPC,
  chainId: TERRA_CHAIN_ID,
  chainInfo: terraChainInfo,
  channelMap: TERRA_CHANNEL_MAP,
}

export const osmosis: KeplrWalletChainConfig = {
  restEndpoint: OSMOSIS_REST,
  rpcEndpoint: OSMOSIS_RPC,
  chainId: OSMOSIS_CHAIN_ID,
  chainInfo: osmosisChainInfo,
  channelMap: OSMOSIS_CHANNEL_MAP,
}

export const allChains = {
  axelar,
  osmosis,
  terra,
}
export default allChains
