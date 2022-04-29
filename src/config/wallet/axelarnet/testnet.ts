import { ChainInfo } from "@keplr-wallet/types"
import { Bech32Address } from "@keplr-wallet/cosmos"
import { KeplrWalletChainConfig } from "./interface"

const OSMOSIS_CHAIN_ID: string = "osmo-test-4"
const OSMOSIS_RPC: string =
  "https://testnet-rpc.osmosis.zone"
const OSMOSIS_REST =
  "https://testnet-rest.osmosis.zone"
const OSMOSIS_CHANNEL_MAP = {
  axelar: "channel-240",
}
const OSMOSIS_DENOM_MAP = {
  "wdev-wei":
    "ibc/BDEB81D8E81910D832AFCDEE9822923DB84ECD8981D10A2282D202EAAD2A6C0C",
  "wmatic-wei":
    "ibc/4E84944734F09DEAEC84882F5CF6ECD0F48CA9400F07ED355F6502C67930A3DD",
  "wftm-wei":
    "ibc/6625132ACE6721012E7359AF2FF0F20B28E4122FB60673D17D4FC1D8D9D04559",
  "weth-wei":
    "ibc/E3BDEB883AA9A48F52E3677A1167E0C10D8F9FEF4F56CA7D065551BF00B24B84",
  "wavax-wei":
    "ibc/E49693D492828B1ACE243BBEC6FEC3ED036305CA06479DE8273FE9C7A94AADD6",
  uausdc:
    "ibc/DB39478B7315836EB481DE311182D882BEC8E232E9586F1D4FF509079901B27E",
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
    {
      coinDenom: "USDC_fake",
      coinMinimalDenom:
        "ibc/68D8E3DC65A940AD5F38D07DE07E6A8F653435FCA226EB458610DCB40513BF8F",
      coinDecimals: 6,
    },
    {
      coinDenom: "WDEV",
      coinMinimalDenom:
        "ibc/BDEB81D8E81910D832AFCDEE9822923DB84ECD8981D10A2282D202EAAD2A6C0C",
      coinDecimals: 18,
    },
    {
      coinDenom: "WMATIC",
      coinMinimalDenom:
        "ibc/4E84944734F09DEAEC84882F5CF6ECD0F48CA9400F07ED355F6502C67930A3DD",
      coinDecimals: 18,
    },
    {
      coinDenom: "WFTM",
      coinMinimalDenom:
        "ibc/6625132ACE6721012E7359AF2FF0F20B28E4122FB60673D17D4FC1D8D9D04559",
      coinDecimals: 18,
    },
    {
      coinDenom: "WETH",
      coinMinimalDenom:
        "ibc/E3BDEB883AA9A48F52E3677A1167E0C10D8F9FEF4F56CA7D065551BF00B24B84",
      coinDecimals: 18,
    },
    {
      coinDenom: "WAVAX",
      coinMinimalDenom:
        "ibc/E49693D492828B1ACE243BBEC6FEC3ED036305CA06479DE8273FE9C7A94AADD6",
      coinDecimals: 18,
    },
    {
      coinDenom: "aUSDC",
      coinMinimalDenom:
        "ibc/DB39478B7315836EB481DE311182D882BEC8E232E9586F1D4FF509079901B27E",
      coinDecimals: 6,
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
  features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
}

const COSMOS_CHAIN_ID: string = "vega-testnet"
const COSMOS_RPC: string = "https://vega-rpc.interchain.io"
const COSMOS_REST = "https://vega-rest.interchain.io"
const COSMOS_CHANNEL_MAP = {
  axelar: "channel-238",
}
const COSMOS_DENOM_MAP = {
  "wdev-wei":
    "ibc/12B944E03F3E2197589129CB359E1BD5FA3F06841792FFE46852EAFE31EEB20A",
  "wmatic-wei":
    "ibc/1BE5BF73F50D2D82C74628C6290834E66C5467F231B7FBC7DD45E217EE1D42A5",
  "wftm-wei":
    "ibc/947B84E653CBEC9386287883173A40D3C0A284AB554557342C50378219ECE147",
  "weth-wei":
    "ibc/DEC3B614DEA87E77AFABE3EDA1F95A7E1A429080950AD9B0AF257FE01706CA0B",
  "wavax-wei":
    "ibc/88C2DE3AE63A443385CDFE54A18B0FC48402DDF3FE5AC532A663F9C3A1144462",
  uausdc:
    "ibc/3DC20E9A12C8F19A92CDEBC37116C26EADF4C65E7498193791A3DAAD0B263556",
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
    {
      coinDenom: "WDEV",
      coinMinimalDenom:
        "ibc/12B944E03F3E2197589129CB359E1BD5FA3F06841792FFE46852EAFE31EEB20A",
      coinDecimals: 18,
    },
    {
      coinDenom: "WMATIC",
      coinMinimalDenom:
        "ibc/1BE5BF73F50D2D82C74628C6290834E66C5467F231B7FBC7DD45E217EE1D42A5",
      coinDecimals: 18,
    },
    {
      coinDenom: "WFTM",
      coinMinimalDenom:
        "ibc/947B84E653CBEC9386287883173A40D3C0A284AB554557342C50378219ECE147",
      coinDecimals: 18,
    },
    {
      coinDenom: "WETH",
      coinMinimalDenom:
        "ibc/DEC3B614DEA87E77AFABE3EDA1F95A7E1A429080950AD9B0AF257FE01706CA0B",
      coinDecimals: 18,
    },
    {
      coinDenom: "WAVAX",
      coinMinimalDenom:
        "ibc/88C2DE3AE63A443385CDFE54A18B0FC48402DDF3FE5AC532A663F9C3A1144462",
      coinDecimals: 18,
    },
    {
      coinDenom: "aUSDC",
      coinMinimalDenom:
        "ibc/3DC20E9A12C8F19A92CDEBC37116C26EADF4C65E7498193791A3DAAD0B263556",
      coinDecimals: 6,
    },
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
    {
      coinDenom: "USDC_fake",
      coinMinimalDenom: "uusdc",
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
  denomMap: OSMOSIS_DENOM_MAP,
}

export const cosmoshub: KeplrWalletChainConfig = {
  restEndpoint: COSMOS_REST,
  rpcEndpoint: COSMOS_RPC,
  chainId: COSMOS_CHAIN_ID,
  chainInfo: cosmosChainInfo,
  channelMap: COSMOS_CHANNEL_MAP,
  denomMap: COSMOS_DENOM_MAP,
}

const CRESCENT_CHAIN_ID: string = "mooncat-1-1"
const CRESCENT_RPC: string = "https://testnet-endpoint.crescent.network/rpc/crescent"
const CRESCENT_REST = "https://testnet-endpoint.crescent.network/api/crescent"
const CRESCENT_CHANNEL_MAP = {
  axelar: "channel-3",
}
const CRESCENT_DENOM_MAP = {
  "weth-wei":
    "ibc/AAD7136DD626569C3DDE7C5F764968BB2E939875EFC568AE5712B62081850814",
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
    {
      coinDenom: "WETH",
      coinMinimalDenom:
        "ibc/AAD7136DD626569C3DDE7C5F764968BB2E939875EFC568AE5712B62081850814",
      coinDecimals: 18,
    },
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
  denomMap: CRESCENT_DENOM_MAP
}

export const allChains = {
  axelar,
  cosmoshub,
  crescent,
  osmosis,
  terra,
}
export default allChains
