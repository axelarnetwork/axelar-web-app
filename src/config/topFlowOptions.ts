export const topFlowOptions =
  process.env.REACT_APP_STAGE === "mainnet"
    ? [
      {
        common_key: "uusdc",
        assetSymbol: "USDC",
        sourceChainName: "Ethereum",
        destinationChainName: "Osmosis",
        sourceChainSymbol: "ETH",
        destinationChainSymbol: "OSMO",
      },
      {
          common_key: "weth-wei",
          assetSymbol: "WETH",
          sourceChainName: "Ethereum",
          destinationChainName: "Osmosis",
          sourceChainSymbol: "ETH",
          destinationChainSymbol: "OSMO",
        },
        {
          common_key: "dot-planck",
          assetSymbol: "DOT",
          sourceChainName: "Moonbeam",
          destinationChainName: "Osmosis",
          sourceChainSymbol: "MOONBEAM",
          destinationChainSymbol: "OSMO",
        },
        {
          common_key: "wmatic-wei",
          assetSymbol: "MATIC",
          sourceChainName: "Polygon",
          destinationChainName: "Osmosis",
          sourceChainSymbol: "POLYGON",
          destinationChainSymbol: "OSMO",
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
        // {
        //   common_key: "uusd",
        //   assetSymbol: "UST",
        //   sourceChainName: "Terra",
        //   destinationChainName: "Avalanche",
        //   sourceChainSymbol: "Terra",
        //   destinationChainSymbol: "AVAX",
        // },
      ]
