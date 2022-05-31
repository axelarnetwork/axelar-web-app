import { Bech32Address } from "@keplr-wallet/cosmos"
import { ChainInfo } from "@keplr-wallet/types"
import { KeplrWalletChainConfig } from "./interface"

const TERRA_CHAIN_ID: string = "phoenix-1"
const TERRA_RPC: string = "https://rpc.terrav2.ccvalidators.com"
const TERRA_REST = "https://phoenix-lcd.terra.dev"
const TERRA_CHANNEL_MAP = {
  axelar: "channel-XXX",
}
const terraMainnetConfigs: ChainInfo = {
  rpc: TERRA_RPC,
  rest: TERRA_REST,
  chainId: TERRA_CHAIN_ID,
  chainName: "Terra 2.0",
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
    "wbtc-satoshi": "ibc/D1542AA8762DB13087D8364F3EA6509FD6F009A34F00426AF9E4F9FA85CBBF1F",
    "aave-wei": "ibc/384E5DD50BDE042E1AAF51F312B55F08F95BC985C503880189258B4D9374CBBE",
    "ape-wei": "ibc/F83CC6471DA4D4B508F437244F10B9E4C68975344E551A2DEB6B8617AB08F0D4",
    "axs-wei": "ibc/6C0CB8653012DC2BC1820FD0B6B3AFF8A07D18630BDAEE066FEFB2D92F477C24",
    "dot-planck": "ibc/3FF92D26B407FD61AE95D975712A7C319CDE28DE4D80BDC9978D935932B991D7",
    "link-wei": "ibc/D3327A763C23F01EC43D1F0DB3CEFEC390C362569B6FD191F40A5192F8960049",
    "mkr-wei": "ibc/D27DDDF34BB47E5D5A570742CC667DE53277867116CCCA341F27785E899A70F3",
    "shib-wei": "ibc/19305E20681911F14D1FB275E538CDE524C3BF88CF9AE5D5F78F4D4DA05E85B2",
    "steth-wei": "ibc/129F401C84FCD5B0183472ED83745193B0B3A69855635A56B9056EEF8D3C241C",
    "uni-wei": "ibc/AE2719773D6FCDD05AC17B1ED63F672F5F9D84144A61965F348C86C2A83AD161",
    "wmatic-wei": "ibc/AB589511ED0DD5FA56171A39978AFBF1371DB986EC1C3526CE138A16377E39BB",
    "xcn-wei": "ibc/B901BEC1B71D0573E6EE874FEC39E2DF4C2BDB1DB74CB3DA0A9CACC4A435B0EC",
    "rai-wei": "ibc/BD796662F8825327D41C96355DF62045A5BA225BAE31C0A86289B9D88ED3F44E"
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
  rpcEndpoint: "https://rpc.junomint.com",
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
    "weth-wei": "ibc/95A45A81521EAFDBEDAEEB6DA975C02E55B414C95AD3CE50709272366A90CA17",
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

const CRESCENT_CHAIN_ID: string = "crescent-1"
const CRESCENT_RPC: string = "https://mainnet.crescent.network:26657"
const CRESCENT_REST = "https://mainnet.crescent.network:1317"
const CRESCENT_CHANNEL_MAP = {
  axelar: "channel-4",
}
const CRESCENT_DENOM_MAP = {
  uusdc: "ibc/BFF0D3805B50D93E2FA5C0B2DDF7E0B30A631076CD80BC12A48C0E95404B4A41",
  "weth-wei":
    "ibc/F1806958CA98757B91C3FA1573ECECD24F6FA3804F074A6977658914A49E65A3",
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
    {
      coinDenom: "USDC",
      coinMinimalDenom:
        "ibc/BFF0D3805B50D93E2FA5C0B2DDF7E0B30A631076CD80BC12A48C0E95404B4A41",
      coinDecimals: 6,
    },
    {
      coinDenom: "WETH",
      coinMinimalDenom:
        "ibc/F1806958CA98757B91C3FA1573ECECD24F6FA3804F074A6977658914A49E65A3",
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

//******injective */

const INJECTIVE_CHAIN_ID: string = "injective-1"
const INJECTIVE_RPC: string = "https://tm.injective.network"
const INJECTIVE_REST = "https://lcd.injective.network"
const INJECTIVE_CHANNEL_MAP = {
  axelar: "channel-10",
}
const INJECTIVE_DENOM_MAP = {

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
  channelMap: INJECTIVE_CHANNEL_MAP,
  denomMap: INJECTIVE_DENOM_MAP
}
//****** end injective */

export const allChains = {
  axelar,
  terra,
  cosmoshub,
  crescent,
  juno,
  "e-money": eMoney,
  injective,
  osmosis
}
export default allChains
