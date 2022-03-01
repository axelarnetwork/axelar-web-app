export const topFlowOptions =
  process.env.REACT_APP_STAGE === "mainnet"
    ? [
        {
          common_key: "uusd",
          assetSymbol: "UST",
          sourceChainName: "Terra",
          destinationChainName: "Avalanche",
          sourceChainSymbol: "Terra",
          destinationChainSymbol: "AVAX",
        },
        {
          common_key: "uusd",
          assetSymbol: "UST",
          sourceChainName: "Terra",
          destinationChainName: "Fantom",
          sourceChainSymbol: "Terra",
          destinationChainSymbol: "FTM",
        },
        {
          common_key: "uusd",
          assetSymbol: "UST",
          sourceChainName: "Avalanche",
          destinationChainName: "Fantom",
          sourceChainSymbol: "AVAX",
          destinationChainSymbol: "FTM",
        },
      ]
    : [
        {
          common_key: "uusdc",
          assetSymbol: "USDC.fake",
          sourceChainName: "Avalanche",
          destinationChainName: "Osmosis",
          sourceChainSymbol: "AVAX",
          destinationChainSymbol: "OSMO",
        },
        {
          common_key: "uusdc",
          assetSymbol: "USDC.fake",
          sourceChainName: "Ethereum",
          destinationChainName: "Osmosis",
          sourceChainSymbol: "ETH",
          destinationChainSymbol: "OSMO",
        },
        {
          common_key: "uusd",
          assetSymbol: "UST",
          sourceChainName: "Terra",
          destinationChainName: "Avalanche",
          sourceChainSymbol: "Terra",
          destinationChainSymbol: "AVAX",
        },
      ]
