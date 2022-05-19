import { Bech32Address } from "@keplr-wallet/cosmos"
import { ChainInfo } from "@keplr-wallet/types"
import { KeplrWalletChainConfig } from "./interface"

const TERRA_CHAIN_ID: string = "columbus-5"
const TERRA_RPC: string = process.env.REACT_APP_TERRA_RPC as string
const TERRA_REST = process.env.REACT_APP_TERRA_LCD as string
const TERRA_CHANNEL_MAP = {
  axelar: "channel-19",
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
  channelMap: TERRA_CHANNEL_MAP,
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
  channelMap: { "axelar": "channel-208" },
  denomMap: {
    uusdc: "ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858",
    "frax-wei": "ibc/0E43EDE2E2A3AFA36D0CD38BDDC0B49FECA64FA426A82E102F304E430ECF46EE",
    uusdt: "ibc/8242AD24008032E457D2E12D46588FD39FB54FB29680C6C7663D296B383C37C4",
    "dai-wei": "ibc/0CD3A0285E1341859B5E86B6AB7682F023D03E97607CCC1DC95706411D866DF7",
    "weth-wei": "ibc/EA1D43981D5C9A1C4AAEA9C23BB1D4FA126BA9BC7020A25E0AE4AA841EA25DC5",
    "wbtc-satoshi": "ibc/D1542AA8762DB13087D8364F3EA6509FD6F009A34F00426AF9E4F9FA85CBBF1F"
  },
}

export const cosmoshub: KeplrWalletChainConfig = {
  restEndpoint: "https://api.cosmos.network",
  rpcEndpoint: "https://cosmoshub.validator.network",
  chainId: "cosmoshub-4",
  chainInfo: {
    feeCurrencies: [
      { coinDenom: "ATOM", coinMinimalDenom: "uatom", coinDecimals: 6 },
    ],
  } as ChainInfo,
  channelMap: { "axelar": "channel-293" },
  denomMap: {
    uusdc: "ibc/932D6003DA334ECBC5B23A071B4287D0A5CC97331197FE9F1C0689BA002A8421",
    "frax-wei": "ibc/3792246C7C422C037C603C955F8383B4E32E7555D693344F9A029A67FE221C57",
    uusdt: "ibc/5662412372381F56C5F83A0404DC7209E5143ABD32EF67B5705DBE8D9C2BF001",
    "dai-wei": "ibc/4A98C8AC2C35498162346F28EEBF3206CBEF81F44725FE62A3DB0CC10E88E695"
  },
}

export const juno: KeplrWalletChainConfig = {
  restEndpoint: "https://lcd-juno.itastakers.com",
  rpcEndpoint: "https://rpc-juno.ecostake.com",
  chainId: "juno-1",
  chainInfo: {
    feeCurrencies: [
      { coinDenom: "JUNO", coinMinimalDenom: "ujuno", coinDecimals: 6 },
    ],
  } as ChainInfo,
  channelMap: { "axelar": "channel-71" },
  denomMap: {
    uusdc: "ibc/EAC38D55372F38F1AFD68DF7FE9EF762DCF69F26520643CF3F9D292A738D8034",
    "frax-wei": "ibc/1CE15165C83F70C7DB18B19C417321B02512A85BCB9FB8E553FC10070D122036",
    uusdt: "ibc/B22D08F0E3D08968FB3CBEE2C1E993581A99AAAA60D0490C1AF7DCE567D5FDDA",
    "dai-wei": "ibc/171E8F6687D290D378678310F9F15D367DCD245BF06184532B703A92054A8A4F",
    "weth-wei": "95A45A81521EAFDBEDAEEB6DA975C02E55B414C95AD3CE50709272366A90CA17",
    "wbtc-satoshi": "ibc/5EF597EA4E863132BFD3E051AC6BAA0175F00913D3256A41F11DC425C39527D6"
  },
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
  channelMap: { "axelar": "channel-26" },
  denomMap: {},
}

export const allChains = {
  axelar,
  terra,
  cosmoshub,
  juno,
  "e-money": eMoney,
  osmosis
}
export default allChains
