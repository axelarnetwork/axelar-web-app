require('dotenv').config()

const GITHUB_LINK: string = "https://github.com/axelarnetwork/axelar-web-app";
const RECAPTCHA_V3_SITE_KEY: string = "6LcxwsocAAAAANQ1t72JEcligfeSr7SSq_pDC9vR"; //this is intentionally public
const RECAPTCHA_V2_SITE_KEY: string = "6LfjBv0dAAAAABkAG9sq3XK94F3GEHHOcJcag156"; //this is intentionally public

interface IConfig {
	GITHUB_LINK: string;
	RECAPTCHA_V3_SITE_KEY: string;
	RECAPTCHA_V2_SITE_KEY: string;
	blockExplorers: { [environment: string]: { [chain: string]: { name: string; url: string; } } }
}

const blockExplorers = {
	devnet: {
		ethereum: {name: "Etherscan", url: "https://ropsten.etherscan.io/tx/"},
		moonbeam: {name: "Moonscan", url: "https://moonbase.moonscan.io/tx/"},
		avalanche: {name: "Snowtrace", url: "https://testnet.snowtrace.io/tx/"},
		polygon: {name: "Polygonscan", url: "https://mumbai.polygonscan.com/tx/"},
		fantom: {name: "FTMScan", url: "https://testnet.ftmscan.com/tx/"}
	},
	testnet: {},
	local: {},
	mainnet: {
		ethereum: {name: "Etherscan", url: "https://etherscan.io/tx/"},
		moonbeam: {name: "Moonscan", url: "https://moonriver.moonscan.io/tx/"},
		avalanche: {name: "Snowtrace", url: "https://snowtrace.io/tx/"},
		polygon: {name: "Polygonscan", url: "https://polygonscan.com/tx/"},
		fantom: {name: "FTMScan", url: "https://ftmscan.com/tx/"}
	}
}
blockExplorers.testnet = blockExplorers.devnet;
blockExplorers.local = blockExplorers.devnet;

const configs: IConfig = {
	GITHUB_LINK,
	RECAPTCHA_V3_SITE_KEY: RECAPTCHA_V3_SITE_KEY,
	RECAPTCHA_V2_SITE_KEY: RECAPTCHA_V2_SITE_KEY,
	blockExplorers
}

export default configs;