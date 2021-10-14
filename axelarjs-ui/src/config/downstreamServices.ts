const GITHUB_LINK: string = "https://github.com/axelarnetwork/axelar-web-app";

// eslint-disable-next-line
const AXELAR_BRIDGE_URL: string = "AXELAR_BRIDGE_URL";

interface IDownstreamServicesConfigs {
	AXELAR_BRIDGE_URL: string;
}

const setConfigs = (AXELAR_BRIDGE_URL: string): IDownstreamServicesConfigs => ({
	AXELAR_BRIDGE_URL
})

const configsByEnvironment: { [key: string]: IDownstreamServicesConfigs } = {};

configsByEnvironment.local = setConfigs("https://murmuring-chamber-60098.herokuapp.com");
configsByEnvironment.devnet = setConfigs("https://murmuring-chamber-60098.herokuapp.com");
configsByEnvironment.testnet = setConfigs("http://localhost:4000");
configsByEnvironment.mainnet = setConfigs("http://localhost:4000");

const getEnvironmentBasedConfigs = (environment: string) => {
	return configsByEnvironment[environment || "devnet"];
}

const configs = {
	GITHUB_LINK,
	getEnvironmentBasedConfigs
}

export default configs;