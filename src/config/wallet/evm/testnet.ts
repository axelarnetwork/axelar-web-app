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
  chainId: "0xA869",
  chainName: "Avalanche Testnet C-Chain",
  nativeCurrency: {
    name: "Avalanche",
    symbol: "AVAX",
    decimals: 18,
  },
  rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
  blockExplorerUrls: ["https://testnet.snowtrace.io/"],
}
export const ethereum: ChainParam = {
  chainId: "0x3",
  chainName: "Ropsten Test Network",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
  blockExplorerUrls: ["https://ropsten.etherscan.io/"],
}

export const fantom: ChainParam = {
  chainId: "0xfa2",
  chainName: "Fantom Testnet",
  nativeCurrency: {
    name: "Fantom",
    symbol: "FTM",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.testnet.fantom.network"],
  blockExplorerUrls: ["https://testnet.ftmscan.com/"],
}

export const moonbeam: ChainParam = {
  chainId: "0x507",
  chainName: "Moonbase Alpha",
  nativeCurrency: {
    name: "DEV",
    symbol: "DEV",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.testnet.moonbeam.network"],
  blockExplorerUrls: ["https://moonbase.moonscan.io/"],
}

export const polygon: ChainParam = {
  chainId: "0x13881",
  chainName: "Polygon Test Network",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
  rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
  blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
}

const walletParamsForChains = {
  avalanche,
  ethereum,
  fantom,
  moonbeam,
  polygon,
}
export default walletParamsForChains
