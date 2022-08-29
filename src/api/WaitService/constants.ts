import { cloneDeep } from "lodash";
import { Network } from "@ethersproject/networks";

const configsMap: { [environment: string]: ConfigsForEnvironment } = {};

export type EthersJsTokenMap = { [tokenKey: string]: string };

export interface EthersJsConfigs {
  tokenAddressMap: EthersJsTokenMap;
  providerOptions: {
    provider: string;
    network?: Network;
  };
}

export interface ConfigsForEnvironment {
  ethersJsConfigs: { [chain: string]: EthersJsConfigs };
  resourceUrl: string;
}

const devnetConfigs: ConfigsForEnvironment = {
  ethersJsConfigs: {
    ethereum: {
      tokenAddressMap: {},
      providerOptions: {
        provider:
          "https://ropsten.infura.io/v3/467477790bfa4b7684be1336e789a068",
        network: { chainId: 3, name: "Ropsten" },
      },
    },
    moonbeam: {
      tokenAddressMap: {},
      providerOptions: {
        provider: "https://rpc.api.moonbase.moonbeam.network",
        network: { chainId: 1287, name: "moonbase-alpha" },
      },
    },
    avalanche: {
      tokenAddressMap: {},
      providerOptions: {
        provider: "https://api.avax-test.network/ext/bc/C/rpc",
        network: { chainId: 43113, name: "Avalanche Testnet C-Chain" },
      },
    },
  },
  resourceUrl: `https://nest-server-devnet.axelar.dev`,
};

const testnetConfigs: ConfigsForEnvironment = {
  ethersJsConfigs: {
    ethereum: {
      tokenAddressMap: {
        uaxl: "0x321C017c08b681b1a34909eb159ed128772a5Bbe",
        uusd: "0x1487F3faefE78792CDC48D87FF32aaC6650fd85f",
        uluna: "0x7Aa125543B9D4a361f58aC1Ff3Bea86eAF6D948B",
        "USDC.fake": "0x772dF70ff68C8dEa1863794824410e90e46Cd433",
      },
      providerOptions: {
        provider:
          "https://ropsten.infura.io/v3/467477790bfa4b7684be1336e789a068",
        network: { chainId: 3, name: "Ropsten" },
      },
    },
    moonbeam: {
      tokenAddressMap: {
      },
      providerOptions: {
        provider: "https://rpc.api.moonbase.moonbeam.network",
        network: { chainId: 1287, name: "moonbase-alpha" },
      },
    },
    avalanche: {
      tokenAddressMap: {
      },
      providerOptions: {
        provider: "https://api.avax-test.network/ext/bc/C/rpc",
        network: { chainId: 43113, name: "Avalanche Testnet C-Chain" },
      },
    },
    fantom: {
      tokenAddressMap: {
      },
      providerOptions: {
        provider: "https://rpc.testnet.fantom.network",
        network: { chainId: 4002, name: "Fantom testnet" },
      },
    },
    polygon: {
      tokenAddressMap: {
      },
      providerOptions: {
        provider:
          "https://polygon-mumbai.infura.io/v3/467477790bfa4b7684be1336e789a068",
        network: { chainId: 80001, name: "polygon-testnet" },
      },
    },
    aurora: {
      tokenAddressMap: {
      },
      providerOptions: {
        provider:
          "https://testnet.aurora.dev",
        network: { chainId: 1313161555, name: "aurora-testnet" },
      },
    },
  },
  resourceUrl: `https://nest-server-testnet.axelar.dev`,
};

const localConfigs: ConfigsForEnvironment = cloneDeep(testnetConfigs);
localConfigs.resourceUrl = "http://localhost:4000";

/* since these tokens are not expected to change, we can set them here so they will not need to be a query*/
const mainnetConfigs: ConfigsForEnvironment = {
  ethersJsConfigs: {
    ethereum: {
      tokenAddressMap: {
      },
      providerOptions: {
        provider:
          "https://mainnet.infura.io/v3/467477790bfa4b7684be1336e789a068",
        network: { chainId: 1, name: "Ethereum Mainnet" },
      },
    },
    moonbeam: {
      tokenAddressMap: {
      },
      providerOptions: {
        provider: "https://rpc.api.moonbeam.network",
        network: { chainId: 1284, name: "Moonbeam" },
      },
    }, //https://docs.moonbeam.network/tokens/connect/metamask/
    avalanche: {
      tokenAddressMap: {
      },
      providerOptions: {
        provider: "https://api.avax.network/ext/bc/C/rpc",
        network: { chainId: 43114, name: "Avalanche Mainnet C-Chain" },
      },
    },
    fantom: {
      tokenAddressMap: {
      },
      providerOptions: {
        provider: "https://withered-divine-waterfall.fantom.quiknode.pro",
        network: { chainId: 250, name: "Fantom Opera" },
      },
    },
    polygon: {
      tokenAddressMap: {
      },
      providerOptions: {
        provider:
          "https://polygon-mainnet.infura.io/v3/467477790bfa4b7684be1336e789a068",
        network: { chainId: 137, name: "polygon-mainnet" },
      },
    },
    binance: {
      tokenAddressMap: {},
      providerOptions: {
        provider:
          "https://bsc-dataseed.binance.org",
        network: { chainId: 56, name: "binance-mainnet" },
      },
    },
  },
  resourceUrl: `https://nest-server-mainnet.axelar.dev`,
};

configsMap["local"] = localConfigs;
configsMap["devnet"] = devnetConfigs;
configsMap["testnet"] = testnetConfigs;
configsMap["mainnet"] = mainnetConfigs;

let configToUse: ConfigsForEnvironment;

export const getConfigs = (environment: string): ConfigsForEnvironment => {
  if (!configToUse) {
    if (!configsMap[environment])
      throw new Error("config environment does not exist");
    configToUse = configsMap[environment];
  }
  return configToUse;
};
