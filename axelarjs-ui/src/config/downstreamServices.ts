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

configsByEnvironment.local = setConfigs("http://localhost:4000");
configsByEnvironment.devNet = setConfigs("http://localhost:4000");
configsByEnvironment.testNet = setConfigs("http://localhost:4000");
configsByEnvironment.mainNet = setConfigs("http://localhost:4000");

const getEnvironmentBasedConfigs = (environment: string) => {
	return configsByEnvironment[environment || "devNet"];
}

const configs = {
	GITHUB_LINK,
	getEnvironmentBasedConfigs
}

export default configs;