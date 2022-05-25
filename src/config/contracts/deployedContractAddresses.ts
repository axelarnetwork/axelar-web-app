export const convertAndDepositContractAddress: {
  [env: string]: { [chainName: string]: string }
} = {
  testnet: {
    ethereum: "0xcA646d14fF0890301E8503dC090c288857f9d60e", //for weth at 0xc778417E063141139Fce010982780140Aa0cD5Ab
    avalanche: "0x4F2F869E7D056FBe883C79dA7C32A3f8c005749e", //for wavax at 0xd00ae08403B9bbb9124bB305C09058E32C39A48c
    polygon: "0x4d6324B09C96BdA450cc70D673fb30654Ffd281B", // for wmatic at 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889
    fantom: "0x5ebcc2611c01e2b18836e70c4ed7714192094cb1", // for wftm at 0x812666209b90344Ec8e528375298ab9045c2Bd08
    moonbeam: "0xb0B5591704f84e5e298b59CC0bBC2E2EeD080917", // for wdev at 0x1436aE0dF0A8663F18c0Ec51d7e2E46591730715
  },
  mainnet: {},
}

export const nativeAssetMap: {
  [env: string]: { [chainName: string]: string }
} = {
  testnet: {
    // ethereum: "weth-wei",
    // avalanche: "wavax-wei",
    // polygon: "wmatic-wei",
    // fantom: "wftm-wei",
    // moonbeam: "wdev-wei",
  },
  mainnet: {
    // ethereum: "weth-wei",
    // avalanche: "wavax-wei",
    // polygon: "wmatic-wei",
    // fantom: "wftm-wei",
    // moonbeam: "wglmr-wei",
  },
}

export const wrappedAssetMap: {
  [env: string]: { [chainName: string]: string }
} = {
  testnet: {
    ethereum: "weth-wei",
    avalanche: "wavax-wei",
    polygon: "wmatic-wei",
    fantom: "wftm-wei",
    moonbeam: "wdev-wei",
  },
  mainnet: {
    ethereum: "weth-wei",
    avalanche: "wavax-wei",
    polygon: "wmatic-wei",
    fantom: "wftm-wei",
    moonbeam: "wglmr-wei",
  },
}

export const nativeAsset: { [key: string]: string} = {
  ethereum: "ETH",
  avalanche: "AVAX",
  polygon: "MATIC",
  fantom: "FTM",
  moonbeam: "GLMR"
}
