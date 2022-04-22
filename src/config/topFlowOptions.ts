export const topFlowOptions =
  process.env.REACT_APP_STAGE === "mainnet"
    ? [
        {
          common_key: "uusdt",
          assetSymbol: "USDT",
          sourceChainName: "Ethereum",
          destinationChainName: "Osmosis",
          sourceChainSymbol: "ETH",
          destinationChainSymbol: "OSMO",
        },
        {
          common_key: "frax-wei",
          assetSymbol: "FRAX",
          sourceChainName: "Ethereum",
          destinationChainName: "Osmosis",
          sourceChainSymbol: "ETH",
          destinationChainSymbol: "OSMO",
        },
        {
          common_key: "uusdc",
          assetSymbol: "USDC",
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
    : [
        {
          common_key: "uusd",
          assetSymbol: "UST",
          sourceChainName: "Terra",
          destinationChainName: "Avalanche",
          sourceChainSymbol: "Terra",
          destinationChainSymbol: "AVAX",
        },
        {
          common_key: "weth-wei",
          assetSymbol: "WETH",
          sourceChainName: "Ethereum",
          destinationChainName: "Avalanche",
          sourceChainSymbol: "ETH",
          destinationChainSymbol: "AVAX",
        },
        {
          common_key: "uausdc",
          assetSymbol: "WETH",
          sourceChainName: "Ethereum",
          destinationChainName: "Osmosis",
          sourceChainSymbol: "ETH",
          destinationChainSymbol: "OSMO",
        },
      ]
