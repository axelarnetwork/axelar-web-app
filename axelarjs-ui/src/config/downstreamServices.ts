require('dotenv').config()

const GITHUB_LINK: string = "https://github.com/axelarnetwork/axelar-web-app";
const RECAPTCHA_SITE_KEY: string = "6LcxwsocAAAAANQ1t72JEcligfeSr7SSq_pDC9vR"; //this is intentionally public

interface IConfig {
	GITHUB_LINK: string;
	RECAPTCHA_SITE_KEY: string;
	AXELAR_BRIDGE_URL: string;
}

const configs: IConfig = {
	GITHUB_LINK,
	RECAPTCHA_SITE_KEY,
	AXELAR_BRIDGE_URL: process.env.REACT_APP_REST_SERVER_URL as string
}

export default configs;