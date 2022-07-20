import { Bech32Address } from "@keplr-wallet/cosmos"
import { ChainInfo } from "@keplr-wallet/types"
import { KeplrWalletChainConfig } from "./interface"
import {
  AssetConfig,
  Environment,
  loadAssets,
} from "@axelar-network/axelarjs-sdk"

const environment: Environment = process.env.REACT_APP_STAGE === "local"
? "testnet" as Environment
: (process.env.REACT_APP_STAGE as Environment)
const ALL_ASSETS: AssetConfig[] = loadAssets({ environment })

const TERRA_CHAIN_ID: string = "phoenix-1"
const TERRA_RPC: string = process.env.REACT_APP_TERRA_RPC as string
const TERRA_REST = process.env.REACT_APP_TERRA_LCD as string 
const TERRA_CHANNEL_MAP = {
  axelar: "channel-6",
}

const terraMainnetConfigs: ChainInfo = {
  rpc: TERRA_RPC,
  rest: TERRA_REST,
  chainId: TERRA_CHAIN_ID,
  chainName: "Terra",
  stakeCurrency: {
    coinDenom: "LUNA",
    coinMinimalDenom: "uluna",
    coinDecimals: 6,
    coinGeckoId: "terra-luna-2",
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
      coinGeckoId: "terra-luna-2",
    },
    ...ALL_ASSETS.filter(assetConfig => assetConfig.chain_aliases["terra"]).map(assetConfig => {
      const asset = assetConfig.chain_aliases["terra"]
      return {
        coinDenom: asset.assetSymbol as string,
        coinMinimalDenom: asset.ibcDenom as string,
        coinDecimals: assetConfig.decimals,
        coinGeckoId: asset.assetSymbol as string,
      }
    })
  ],
  feeCurrencies: [
    {
      coinDenom: "LUNA",
      coinMinimalDenom: "uluna",
      coinDecimals: 6,
      coinGeckoId: "terra-luna-2",
    },
  ],
  gasPriceStep: { low: 5.665, average: 5.665, high: 7 },
  features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
}

const AXELAR_CHAIN_ID: string = "axelar-dojo-1"
const AXELAR_RPC: string = process.env.REACT_APP_AXELAR_RPC as string
const AXELAR_REST = process.env.REACT_APP_AXELAR_LCD as string
const AXELAR_CHANNEL_MAP = {
  terra: "channel-0",
}
const axelarChainInfo: ChainInfo = {
  rpc: AXELAR_RPC,
  rest: AXELAR_REST,
  chainId: AXELAR_CHAIN_ID,
  chainName: "Axelar",
  stakeCurrency: {
    coinDenom: "AXL",
    coinMinimalDenom: "uaxl",
    coinDecimals: 6,
  },
  bech32Config: Bech32Address.defaultBech32Config("axelar"),
  bip44: {
    coinType: 118,
  },
  currencies: [{ coinDenom: "AXL", coinMinimalDenom: "uaxl", coinDecimals: 6 }],
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
  chainInfo: terraMainnetConfigs,
  channelMap: TERRA_CHANNEL_MAP
}

export const osmosis: KeplrWalletChainConfig = {
  restEndpoint: "https://osmosis-lcd.quickapi.com",
  rpcEndpoint: "https://rpc-osmosis.blockapsis.com",
  chainId: "osmosis-1",
  chainInfo: {
    feeCurrencies: [
      { coinDenom: "OSMO", coinMinimalDenom: "uosmo", coinDecimals: 6 },
    ],
  } as ChainInfo,
  channelMap: { "axelar": "channel-208" }
}

export const cosmoshub: KeplrWalletChainConfig = {
  restEndpoint: "https://api.cosmos.network",
  rpcEndpoint: "https://cosmoshub-4--rpc--full.datahub.figment.io/apikey/6d8baa3d3e97e427db4bd7ffcfb21be4",
  chainId: "cosmoshub-4",
  chainInfo: {
    feeCurrencies: [
      { coinDenom: "ATOM", coinMinimalDenom: "uatom", coinDecimals: 6 },
    ],
  } as ChainInfo,
  channelMap: { "axelar": "channel-293" }
}

export const juno: KeplrWalletChainConfig = {
  restEndpoint: "https://lcd-juno.itastakers.com",
  rpcEndpoint: "https://rpc.junomint.com",
  chainId: "juno-1",
  chainInfo: {
    feeCurrencies: [
      { coinDenom: "JUNO", coinMinimalDenom: "ujuno", coinDecimals: 6 },
    ],
  } as ChainInfo,
  channelMap: { "axelar": "channel-71" }
}

export const secret: KeplrWalletChainConfig = {
  restEndpoint: "https://secret-4.api.trivium.network:1317",
  rpcEndpoint: "https://secret-4.api.trivium.network:26657",
  chainId: "secret-4",
  chainInfo: {
    feeCurrencies: [
      { coinDenom: "SCRT", coinMinimalDenom: "uscrt", coinDecimals: 6 },
    ],
  } as ChainInfo,
  channelMap: { "axelar": "channel-20" }
}

export const eMoney: KeplrWalletChainConfig = {
  restEndpoint: "https://emoney.validator.network/api",
  rpcEndpoint: "https://emoney.validator.network",
  chainId: "emoney-3",
  chainInfo: {
    feeCurrencies: [
      { coinDenom: "NGM", coinMinimalDenom: "ungm", coinDecimals: 6 },
    ],
  } as ChainInfo,
  channelMap: { "axelar": "channel-26" }
}

const CRESCENT_CHAIN_ID: string = "crescent-1"
const CRESCENT_RPC: string = "https://mainnet.crescent.network:26657"
const CRESCENT_REST = "https://mainnet.crescent.network:1317"
const CRESCENT_CHANNEL_MAP = {
  axelar: "channel-4",
}
const crescentChainInfo: ChainInfo = {
  rpc: CRESCENT_RPC,
  rest: CRESCENT_REST,
  chainId: CRESCENT_CHAIN_ID,
  chainName: "Crescent Network",
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
    ...ALL_ASSETS.filter(assetConfig => assetConfig.chain_aliases["crescent"]).map(assetConfig => {
      const asset = assetConfig.chain_aliases["crescent"]
      return {
        coinDenom: asset.assetSymbol as string,
        coinMinimalDenom: asset.ibcDenom as string,
        coinDecimals: assetConfig.decimals,
        coinGeckoId: asset.assetSymbol as string,
      }
    })
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
  channelMap: CRESCENT_CHANNEL_MAP
}

//******injective */

const INJECTIVE_CHAIN_ID: string = "injective-1"
const INJECTIVE_RPC: string = "https://tm.injective.network"
const INJECTIVE_REST = "https://lcd.injective.network"
const INJECTIVE_CHANNEL_MAP = {
  axelar: "channel-84",
}
const injectiveChainInfo: ChainInfo = {
  rpc: INJECTIVE_RPC,
  rest: INJECTIVE_REST,
  chainId: INJECTIVE_CHAIN_ID,
  chainName: 'Injective',
  stakeCurrency: {
    coinDenom: 'INJ',
    coinMinimalDenom: 'inj',
    coinDecimals: 18,
    coinGeckoId: 'injective-protocol',
  },
  walletUrl: 'https://hub.injective.network/',
  walletUrlForStaking: 'https://hub.injective.network/',
  bip44: {
    coinType: 60,
  },
  bech32Config: Bech32Address.defaultBech32Config('inj'),
  currencies: [
    {
      coinDenom: 'INJ',
      coinMinimalDenom: 'inj',
      coinDecimals: 18,
      coinGeckoId: 'injective-protocol',
    },
    ...ALL_ASSETS.filter(assetConfig => assetConfig.chain_aliases["injective"]).map(assetConfig => {
      const asset = assetConfig.chain_aliases["injective"]
      return {
        coinDenom: asset.assetSymbol as string,
        coinMinimalDenom: asset.ibcDenom as string,
        coinDecimals: assetConfig.decimals,
        coinGeckoId: asset.assetSymbol as string,
      }
    })
  ],
  feeCurrencies: [
    {
      coinDenom: 'INJ',
      coinMinimalDenom: 'inj',
      coinDecimals: 18,
      coinGeckoId: 'injective-protocol',
    },
  ],
  gasPriceStep: {
    low: 5000000000,
    average: 25000000000,
    high: 40000000000,
  },
  features: ['ibc-transfer', 'ibc-go'],
}
export const injective: KeplrWalletChainConfig = {
  restEndpoint: INJECTIVE_REST,
  chainId: INJECTIVE_CHAIN_ID,
  rpcEndpoint: INJECTIVE_RPC,
  chainInfo: injectiveChainInfo,
  channelMap: INJECTIVE_CHANNEL_MAP
}
//****** end injective */

//**kujira */
const KUJIRA_CHAIN_ID: string = "kaiyo-1"
const KUJIRA_RPC: string = "https://rpc.kaiyo.kujira.setten.io"
const KUJIRA_REST = "https://lcd.kaiyo.kujira.setten.io"
const KUJIRA_CHANNEL_MAP = {
  axelar: "channel-9",
}

const kujiraChainInfo: ChainInfo = {
  chainId: KUJIRA_CHAIN_ID,
  chainName: "Kujira Mainnet",
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
    ...ALL_ASSETS.filter(
      (assetConfig) => assetConfig.chain_aliases["kujira"]
    ).map((assetConfig) => {
      const asset = assetConfig.chain_aliases["kujira"]
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
export const kujira: KeplrWalletChainConfig = {
  restEndpoint: KUJIRA_REST,
  rpcEndpoint: KUJIRA_RPC,
  chainId: KUJIRA_CHAIN_ID,
  chainInfo: kujiraChainInfo,
  channelMap: KUJIRA_CHANNEL_MAP,
}
//**end kujira */

export const allChains = {
  axelar,
  terra,
  cosmoshub,
  crescent,
  juno,
  "e-money": eMoney,
  injective,
  osmosis,
  secret,
  kujira
}
export default allChains
