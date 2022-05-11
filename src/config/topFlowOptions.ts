export const topFlowOptions =
  process.env.REACT_APP_STAGE === "mainnet"
    ? [
        {
          common_key: "weth-wei",
          assetSymbol: "WETH",
          sourceChainName: "Ethereum",
          destinationChainName: "Osmosis",
          sourceChainSymbol: "ETH",
          destinationChainSymbol: "OSMO",
        },
        {
          common_key: "uusdt",
          assetSymbol: "USDT",
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
          common_key: "weth-wei",
          assetSymbol: "WETH",
          sourceChainName: "Ethereum",
          destinationChainName: "Osmosis",
          sourceChainSymbol: "ETH",
          destinationChainSymbol: "OSMO",
        },
        {
          common_key: "wavax-wei",
          assetSymbol: "WAVAX",
          sourceChainName: "Avalanche",
          destinationChainName: "Osmosis",
          sourceChainSymbol: "AVAX",
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
