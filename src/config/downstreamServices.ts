require("dotenv").config()

const GITHUB_LINK: string = "https://github.com/axelarnetwork/axelar-web-app"
const RECAPTCHA_V3_SITE_KEY: string = "6LcxwsocAAAAANQ1t72JEcligfeSr7SSq_pDC9vR" //this is intentionally public
const RECAPTCHA_V2_SITE_KEY: string = "6LfjBv0dAAAAABkAG9sq3XK94F3GEHHOcJcag156" //this is intentionally public

interface IConfig {
  GITHUB_LINK: string
  RECAPTCHA_V3_SITE_KEY: string
  RECAPTCHA_V2_SITE_KEY: string
  blockExplorers: {
    [environment: string]: { [chain: string]: { name: string; url: string } }
  }
  tokenContracts: { [environment: string]: string }
  txConfirmationTool: { [environment: string]: string }
}

const blockExplorers = {
  devnet: {
    ethereum: { name: "Etherscan", url: "https://ropsten.etherscan.io/tx/" },
    moonbeam: { name: "Moonscan", url: "https://moonbase.moonscan.io/tx/" },
    avalanche: { name: "Snowtrace", url: "https://testnet.snowtrace.io/tx/" },
    polygon: { name: "Polygonscan", url: "https://mumbai.polygonscan.com/tx/" },
    fantom: { name: "FTMScan", url: "https://testnet.ftmscan.com/tx/" },
    terra: {
      name: "Terra's testnet block explorer",
      url: "https://finder.terra.money/testnet/tx/",
    },
    axelar: {
      name: "Coinhippo's testnet block explorer",
      url: "https://axelar-testnet.coinhippo.io/tx/",
    },
  },
  testnet: {},
  local: {},
  mainnet: {
    ethereum: { name: "Etherscan", url: "https://etherscan.io/tx/" },
    moonbeam: { name: "Moonscan", url: "https://moonbeam.moonscan.io/tx/" },
    avalanche: { name: "Snowtrace", url: "https://snowtrace.io/tx/" },
    polygon: { name: "Polygonscan", url: "https://polygonscan.com/tx/" },
    fantom: { name: "FTMScan", url: "https://ftmscan.com/tx/" },
    terra: {
      name: "Terra's block explorer",
      url: "https://finder.terra.money/mainnet/tx/",
    },
    axelar: {
      name: "Coinhippo's block explorer",
      url: "https://axelar.coinhippo.io/tx/",
    },
  },
}
blockExplorers.testnet = blockExplorers.devnet
blockExplorers.local = blockExplorers.devnet

const tokenContracts = {
  local: "https://docs.axelar.dev/releases/testnet",
  devnet: "https://docs.axelar.dev/releases/testnet",
  testnet: "https://docs.axelar.dev/releases/testnet",
  mainnet: "https://docs.axelar.dev/releases/mainnet",
}

const txConfirmationTool = {
  local: "https://transaction-confirmation.axelar.dev",
  devnet: "https://transaction-confirmation.axelar.dev",
  testnet: "https://transaction-confirmation.axelar.dev",
  mainnet: "https://transaction-confirmation.axelar.dev",
}

const configs: IConfig = {
  GITHUB_LINK,
  RECAPTCHA_V3_SITE_KEY: RECAPTCHA_V3_SITE_KEY,
  RECAPTCHA_V2_SITE_KEY: RECAPTCHA_V2_SITE_KEY,
  blockExplorers,
  tokenContracts,
  txConfirmationTool
}

export default configs
