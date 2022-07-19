import { ChainInfo } from "@keplr-wallet/types"
import { Bech32Address } from "@keplr-wallet/cosmos"
import { KeplrWalletChainConfig } from "./interface"
import { AssetConfig, loadAssets } from "@axelar-network/axelarjs-sdk"

const environment: string =
  process.env.REACT_APP_STAGE === "local"
    ? "testnet"
    : (process.env.REACT_APP_STAGE as string)
const ALL_ASSETS: AssetConfig[] = loadAssets({ environment })

const SEI_CHAIN_ID: string = "atlantic-1"
const SEI_RPC: string = "https://sei-testnet-rpc.polkachu.com"
const SEI_REST = "https://sei-testnet-api.polkachu.com"
const SEI_CHANNEL_MAP = {
  axelar: "channel-29",
}
const seiChainInfo: ChainInfo = {
  chainId: SEI_CHAIN_ID,
  chainName: "SEI Testnet",
  rpc: SEI_RPC,
  rest: SEI_REST,
  bip44: { coinType: 118 },
  bech32Config: {
    bech32PrefixAccAddr: "sei",
    bech32PrefixAccPub: "seipub",
    bech32PrefixValAddr: "seivaloper",
    bech32PrefixValPub: "seivaloperpub",
    bech32PrefixConsAddr: "seivalcons",
    bech32PrefixConsPub: "seivalconspub",
  },
  currencies: [
    { coinDenom: "SEI", coinMinimalDenom: "usei", coinDecimals: 6 },
    ...ALL_ASSETS.filter(
      (assetConfig) => assetConfig.chain_aliases["osmosis"]
    ).map((assetConfig) => {
      const asset = assetConfig.chain_aliases["osmosis"]
      return {
        coinDenom: asset.assetSymbol as string,
        coinMinimalDenom: asset.ibcDenom as string,
        coinDecimals: assetConfig.decimals,
        coinGeckoId: asset.assetSymbol as string,
      }
    }),
  ],
  feeCurrencies: [
    { coinDenom: "SEI", coinMinimalDenom: "usei", coinDecimals: 6 },
  ],
  stakeCurrency: {
    coinDenom: "SEI",
    coinMinimalDenom: "usei",
    coinDecimals: 6,
  },
  coinType: 118,
}

const KUJIRA_CHAIN_ID: string = "harpoon-4"
const KUJIRA_RPC: string = "https://rpc-harpoon.kujira.app"
const KUJIRA_REST = "https://lcd-harpoon.kujira.app"
const KUJIRA_CHANNEL_MAP = {
  axelar: "channel-8",
}

const kujiraChainInfo: ChainInfo = {
  chainId: KUJIRA_CHAIN_ID,
  chainName: "Kujira Testnet",
  rpc: KUJIRA_RPC,
  rest: KUJIRA_REST,
  bip44: { coinType: 118 },
  bech32Config: {
    bech32PrefixAccAddr: "kujira",
    bech32PrefixAccPub: "kujirapub",
    bech32PrefixValAddr: "kujiravaloper",
    bech32PrefixValPub: "kujiravaloperpub",
    bech32PrefixConsAddr: "kujiravalcons",
    bech32PrefixConsPub: "kujiravalconspub",
  },
  currencies: [
    {
      coinDenom: "KUJI",
      coinMinimalDenom: "ukuji",
      coinDecimals: 6,
      coinGeckoId: "kujira",
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "KUJI",
      coinMinimalDenom: "ukuji",
      coinDecimals: 6,
      coinGeckoId: "kujira",
    },
  ],
  stakeCurrency: {
    coinDenom: "KUJI",
    coinMinimalDenom: "ukuji",
    coinDecimals: 6,
    coinGeckoId: "kujira",
  },
  coinType: 118,
  gasPriceStep: { low: 0.01, average: 0.025, high: 0.03 },
}

const OSMOSIS_CHAIN_ID: string = "osmo-test-4"
const OSMOSIS_RPC: string = "https://testnet-rpc.osmosis.zone"
const OSMOSIS_REST = "https://testnet-rest.osmosis.zone"
const OSMOSIS_CHANNEL_MAP = {
  axelar: "channel-312",
}

const osmosisChainInfo: ChainInfo = {
  rpc: OSMOSIS_RPC,
  rest: OSMOSIS_REST,
  chainId: OSMOSIS_CHAIN_ID,
  chainName: "Osmosis Testnet",
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
    ...ALL_ASSETS.filter(
      (assetConfig) => assetConfig.chain_aliases["osmosis"]
    ).map((assetConfig) => {
      const asset = assetConfig.chain_aliases["osmosis"]
      return {
        coinDenom: asset.assetSymbol as string,
        coinMinimalDenom: asset.ibcDenom as string,
        coinDecimals: assetConfig.decimals,
        coinGeckoId: asset.assetSymbol as string,
      }
    }),
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
  features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
}

const COSMOS_CHAIN_ID: string = "vega-testnet"
const COSMOS_RPC: string = "https://vega-rpc.interchain.io"
const COSMOS_REST = "https://vega-rest.interchain.io"
const COSMOS_CHANNEL_MAP = {
  axelar: "channel-238",
}
const cosmosChainInfo: ChainInfo = {
  rpc: COSMOS_RPC,
  rest: COSMOS_REST,
  chainId: COSMOS_CHAIN_ID,
  chainName: "Cosmos Testnet",
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: "cosmos",
    bech32PrefixAccPub: "cosmospub",
    bech32PrefixValAddr: "cosmosvaloper",
    bech32PrefixValPub: "cosmosvaloperpub",
    bech32PrefixConsAddr: "cosmosvalcons",
    bech32PrefixConsPub: "cosmosvalconspub",
  },
  currencies: [
    {
      coinDenom: "ATOM",
      coinMinimalDenom: "uatom",
      coinDecimals: 6,
      coinGeckoId: "cosmos",
    },
    ...ALL_ASSETS.filter(
      (assetConfig) => assetConfig.chain_aliases["cosmoshub"]
    ).map((assetConfig) => {
      const asset = assetConfig.chain_aliases["cosmoshub"]
      return {
        coinDenom: asset.assetSymbol as string,
        coinMinimalDenom: asset.ibcDenom as string,
        coinDecimals: assetConfig.decimals,
        coinGeckoId: asset.assetSymbol as string,
      }
    }),
  ],
  feeCurrencies: [
    {
      coinDenom: "ATOM",
      coinMinimalDenom: "uatom",
      coinDecimals: 6,
      coinGeckoId: "cosmos",
    },
  ],
  stakeCurrency: {
    coinDenom: "ATOM",
    coinMinimalDenom: "uatom",
    coinDecimals: 6,
    coinGeckoId: "cosmos",
  },
  coinType: 118,
  features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
}

const TERRA_CHAIN_ID: string = "pisco-1"
const TERRA_RPC: string = process.env.REACT_APP_TERRA_RPC as string
const TERRA_REST = "https://pisco-lcd.terra.dev"
const TERRA_CHANNEL_MAP = {
  axelar: "channel-8",
}
const terraChainInfo: ChainInfo = {
  rpc: TERRA_RPC,
  rest: TERRA_REST,
  chainId: TERRA_CHAIN_ID,
  chainName: "Terra Pisco-1",
  stakeCurrency: {
    coinDenom: "LUNA",
    coinMinimalDenom: "uluna",
    coinDecimals: 6,
  },
  bech32Config: Bech32Address.defaultBech32Config("terra"),
  bip44: { coinType: 330 },
  currencies: [
    { coinDenom: "LUNA", coinMinimalDenom: "uluna", coinDecimals: 6 },
    ...ALL_ASSETS.filter(
      (assetConfig) => assetConfig.chain_aliases["terra"]
    ).map((assetConfig) => {
      const asset = assetConfig.chain_aliases["terra"]
      return {
        coinDenom: asset.assetSymbol as string,
        coinMinimalDenom: asset.ibcDenom as string,
        coinDecimals: assetConfig.decimals,
        coinGeckoId: asset.assetSymbol as string,
      }
    }),
  ],
  feeCurrencies: [
    {
      coinDenom: "LUNA",
      coinMinimalDenom: "uluna",
      coinDecimals: 6,
      coinGeckoId: "terra-luna-2",
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
  walletUrlForStaking: "https://www.testnet.keplr.app/#/axelar/stake",
  bech32Config: Bech32Address.defaultBech32Config("axelar"),
  bip44: {
    coinType: 118,
  },
  currencies: [
    { coinDenom: "AXL", coinMinimalDenom: "uaxl", coinDecimals: 6 },
    ...ALL_ASSETS.filter(
      (assetConfig) => assetConfig.chain_aliases["axelar"]
    ).map((assetConfig) => {
      const asset = assetConfig.chain_aliases["axelar"]
      return {
        coinDenom: asset.assetSymbol as string,
        coinMinimalDenom: asset.ibcDenom as string,
        coinDecimals: assetConfig.decimals,
        coinGeckoId: asset.assetSymbol as string,
      }
    }),
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

export const cosmoshub: KeplrWalletChainConfig = {
  restEndpoint: COSMOS_REST,
  rpcEndpoint: COSMOS_RPC,
  chainId: COSMOS_CHAIN_ID,
  chainInfo: cosmosChainInfo,
  channelMap: COSMOS_CHANNEL_MAP,
}

export const sei: KeplrWalletChainConfig = {
  restEndpoint: SEI_REST,
  rpcEndpoint: SEI_RPC,
  chainId: SEI_CHAIN_ID,
  chainInfo: seiChainInfo,
  channelMap: SEI_CHANNEL_MAP,
}

export const kujira: KeplrWalletChainConfig = {
  restEndpoint: KUJIRA_REST,
  rpcEndpoint: KUJIRA_RPC,
  chainId: KUJIRA_CHAIN_ID,
  chainInfo: kujiraChainInfo,
  channelMap: KUJIRA_CHANNEL_MAP,
}

const CRESCENT_CHAIN_ID: string = "mooncat-1-1"
const CRESCENT_RPC: string =
  "https://testnet-endpoint.crescent.network/rpc/crescent"
const CRESCENT_REST = "https://testnet-endpoint.crescent.network/api/crescent"
const CRESCENT_CHANNEL_MAP = {
  axelar: "channel-3",
}
const crescentChainInfo: ChainInfo = {
  rpc: CRESCENT_RPC,
  rest: CRESCENT_REST,
  chainId: CRESCENT_CHAIN_ID,
  chainName: "Crescent Testnet",
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: "cre",
    bech32PrefixAccPub: "crepub",
    bech32PrefixValAddr: "crevaloper",
    bech32PrefixValPub: "crevaloperpub",
    bech32PrefixConsAddr: "crevalcons",
    bech32PrefixConsPub: "crevalconspub",
  },
  currencies: [
    {
      coinDenom: "CRE",
      coinMinimalDenom: "ucre",
      coinDecimals: 6,
      coinGeckoId: "crescent",
    },
    ...ALL_ASSETS.filter(
      (assetConfig) => assetConfig.chain_aliases["crescent"]
    ).map((assetConfig) => {
      const asset = assetConfig.chain_aliases["crescent"]
      return {
        coinDenom: asset.assetSymbol as string,
        coinMinimalDenom: asset.ibcDenom as string,
        coinDecimals: assetConfig.decimals,
        coinGeckoId: asset.assetSymbol as string,
      }
    }),
  ],
  feeCurrencies: [
    {
      coinDenom: "CRE",
      coinMinimalDenom: "ucre",
      coinDecimals: 6,
      coinGeckoId: "crescent",
    },
  ],
  stakeCurrency: {
    coinDenom: "CRE",
    coinMinimalDenom: "ucre",
    coinDecimals: 6,
    coinGeckoId: "crescent",
  },
  coinType: 118,
  gasPriceStep: {
    low: 1,
    average: 1,
    high: 1,
  },
  features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
}
export const crescent: KeplrWalletChainConfig = {
  restEndpoint: CRESCENT_REST,
  chainId: CRESCENT_CHAIN_ID,
  rpcEndpoint: CRESCENT_RPC,
  chainInfo: crescentChainInfo,
  channelMap: CRESCENT_CHANNEL_MAP,
}

export const allChains = {
  axelar,
  cosmoshub,
  crescent,
  kujira,
  osmosis,
  sei,
  terra,
}
export default allChains
