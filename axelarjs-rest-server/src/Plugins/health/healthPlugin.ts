import {HealthPlugin} from "hapi-k8s-health";

export const healthPlugin = {
	plugin: HealthPlugin,
	options: {
		livenessProbes: {
			status: () => Promise.resolve('Yeah !')
		},
		readinessProbes: {
			health: () => Promise.resolve('ready TODO')
		}
	}
};