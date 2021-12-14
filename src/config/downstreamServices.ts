require('dotenv').config()

const GITHUB_LINK: string = "https://github.com/axelarnetwork/axelar-web-app";
const RECAPTCHA_SITE_KEY: string = "6LcxwsocAAAAANQ1t72JEcligfeSr7SSq_pDC9vR"; //this is intentionally public

interface IConfig {
	GITHUB_LINK: string;
	RECAPTCHA_SITE_KEY: string;
	AXELAR_BRIDGE_URL: string;
	blockExplorers: { [environment: string]: { [chain: string]: string } }
}

const blockExplorers = {
	devnet: {
		ethereum: "https://ropsten.etherscan.io/tx/",
		moonbeam: "https://moonbase.moonscan.io/tx/"
	},
	testnet: {},
	mainnet: {}
}
blockExplorers.testnet = blockExplorers.devnet;

const configs: IConfig = {
	GITHUB_LINK,
	RECAPTCHA_SITE_KEY,
	AXELAR_BRIDGE_URL: process.env.REACT_APP_REST_SERVER_URL as string,
	blockExplorers
}

export default configs;