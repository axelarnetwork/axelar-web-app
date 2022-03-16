import { ChainInfo } from "@keplr-wallet/types"
import { Bech32Address } from "@keplr-wallet/cosmos"
import { KeplrWalletChainConfig } from "./interface"

const OSMOSIS_CHAIN_ID: string = "osmo-test-4"
const OSMOSIS_RPC: string = "https://axelar-cors-redirect-testnet.herokuapp.com/https://rpc.osmo-test.ccvalidators.com"
const OSMOSIS_REST = "https://axelar-cors-redirect-testnet.herokuapp.com/https://lcd.osmo-test.ccvalidators.com"
const OSMOSIS_CHANNEL_MAP = {
  axelar: "channel-184",
}
const OSMOSIS_DENOM_MAP = {
  uusdc: "ibc/68D8E3DC65A940AD5F38D07DE07E6A8F653435FCA226EB458610DCB40513BF8F",
  "wdev-wei": "ibc/D3AF2C7986FA1191157529F68609887103EBBD0B9CAFAD615CF19B419E2F5566",
  "wmatic-wei": "ibc/67D0DAF8D504ED1616A1886CCECB4E366DC81A8EF48BD22AEA1F44BE87ED19AE",
  "wftm-wei": "ibc/033C5FCE2C549920B75CC794D12BC3407F638421C982CE9B48D4E5D986F4EFCE",
  "weth-wei": "ibc/A8C7A5D5767DECBAF96AFDE4C2D99D95BE9FF38CA75BE3A1CD31E3D20264EFF9",
  "wavax-wei": "ibc/9534907D2838E2134F21CC286A4CD0FF3CA96AA032F9F695ABF5621CC98AB17F",
  "uausdc": "ibc/423FB88C7D1D4FCA2F7E67F07473DB4BB14282AE6F7B1A41B220A1AD9A762254"

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
      coinMinimalDenom: "ibc/68D8E3DC65A940AD5F38D07DE07E6A8F653435FCA226EB458610DCB40513BF8F",
      coinDecimals: 6,
    },
    {
      coinDenom: "WDEV",
      coinMinimalDenom: "ibc/D3AF2C7986FA1191157529F68609887103EBBD0B9CAFAD615CF19B419E2F5566",
      coinDecimals: 18,
    },
    {
      coinDenom: "WMATIC",
      coinMinimalDenom: "ibc/67D0DAF8D504ED1616A1886CCECB4E366DC81A8EF48BD22AEA1F44BE87ED19AE",
      coinDecimals: 18,
    },
    {
      coinDenom: "WFTM",
      coinMinimalDenom: "ibc/033C5FCE2C549920B75CC794D12BC3407F638421C982CE9B48D4E5D986F4EFCE",
      coinDecimals: 18,
    },
    {
      coinDenom: "WETH",
      coinMinimalDenom: "ibc/A8C7A5D5767DECBAF96AFDE4C2D99D95BE9FF38CA75BE3A1CD31E3D20264EFF9",
      coinDecimals: 18,
    },
    {
      coinDenom: "WAVAX",
      coinMinimalDenom: "ibc/9534907D2838E2134F21CC286A4CD0FF3CA96AA032F9F695ABF5621CC98AB17F",
      coinDecimals: 18,
    },
    {
      coinDenom: "aUSDC",
      coinMinimalDenom: "ibc/423FB88C7D1D4FCA2F7E67F07473DB4BB14282AE6F7B1A41B220A1AD9A762254",
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
  "wdev-wei": "ibc/12B944E03F3E2197589129CB359E1BD5FA3F06841792FFE46852EAFE31EEB20A",
  "wmatic-wei": "ibc/1BE5BF73F50D2D82C74628C6290834E66C5467F231B7FBC7DD45E217EE1D42A5",
  "wftm-wei": "ibc/947B84E653CBEC9386287883173A40D3C0A284AB554557342C50378219ECE147",
  "weth-wei": "ibc/DEC3B614DEA87E77AFABE3EDA1F95A7E1A429080950AD9B0AF257FE01706CA0B",
  "wavax-wei": "ibc/88C2DE3AE63A443385CDFE54A18B0FC48402DDF3FE5AC532A663F9C3A1144462",
  "uausdc": "ibc/3DC20E9A12C8F19A92CDEBC37116C26EADF4C65E7498193791A3DAAD0B263556"
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
      coinMinimalDenom: "ibc/12B944E03F3E2197589129CB359E1BD5FA3F06841792FFE46852EAFE31EEB20A",
      coinDecimals: 18,
    },
    {
      coinDenom: "WMATIC",
      coinMinimalDenom: "ibc/1BE5BF73F50D2D82C74628C6290834E66C5467F231B7FBC7DD45E217EE1D42A5",
      coinDecimals: 18,
    },
    {
      coinDenom: "WFTM",
      coinMinimalDenom: "ibc/947B84E653CBEC9386287883173A40D3C0A284AB554557342C50378219ECE147",
      coinDecimals: 18,
    },
    {
      coinDenom: "WETH",
      coinMinimalDenom: "ibc/DEC3B614DEA87E77AFABE3EDA1F95A7E1A429080950AD9B0AF257FE01706CA0B",
      coinDecimals: 18,
    },
    {
      coinDenom: "WAVAX",
      coinMinimalDenom: "ibc/88C2DE3AE63A443385CDFE54A18B0FC48402DDF3FE5AC532A663F9C3A1144462",
      coinDecimals: 18,
    },
    {
      coinDenom: "aUSDC",
      coinMinimalDenom: "ibc/3DC20E9A12C8F19A92CDEBC37116C26EADF4C65E7498193791A3DAAD0B263556",
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

export const allChains = {
  axelar,
  cosmoshub,
  osmosis,
  terra,
}
export default allChains
