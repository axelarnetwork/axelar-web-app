interface NativeCurrency {
  name: string
  symbol: string
  decimals: number
}

export interface ChainParam {
  chainId: string
  chainName: string
  nativeCurrency: NativeCurrency
  rpcUrls: string[]
  blockExplorerUrls: string[]
}

export const avalanche: ChainParam = {
  chainId: "0xA86A",
  chainName: "Avalanche Mainnet",
  nativeCurrency: {
    name: "Avalanche",
    symbol: "AVAX",
    decimals: 18,
  },
  rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
  blockExplorerUrls: ["https://.snowtrace.io/"],
}
export const ethereum: ChainParam = {
  chainId: "0x1",
  chainName: "Ethereum Mainnet",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://mainnet.infura.io/v3/10de1265f1234c93acfec19ca8f4afd7"],
  blockExplorerUrls: ["https://etherscan.io/"],
}

export const fantom: ChainParam = {
  chainId: "0xFA",
  chainName: "Fantom Mainnet",
  nativeCurrency: {
    name: "Fantom",
    symbol: "FTM",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.ftm.tools"],
  blockExplorerUrls: ["https://ftmscan.com/"],
}

export const moonbeam: ChainParam = {
  chainId: "0x504",
  chainName: "Moonbeam",
  nativeCurrency: {
    name: "Glimmer",
    symbol: "GLMR",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.api.moonbeam.network"],
  blockExplorerUrls: ["https://moonscan.io/"],
}

export const polygon: ChainParam = {
  chainId: "0x89",
  chainName: "Polygon Mainnet",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
  rpcUrls: ["https://polygon-rpc.com"],
  blockExplorerUrls: ["https://polygonscan.com/"],
}

const walletParamsForChains = {
  avalanche,
  ethereum,
  fantom,
  moonbeam,
  polygon,
}
export default walletParamsForChains
