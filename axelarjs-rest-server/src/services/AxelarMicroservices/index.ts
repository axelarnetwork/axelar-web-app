import {AxiosInstance, AxiosRequestConfig}                               from "axios";
import {INonSmartContractLinkRequestBody, ISmartContractLinkRequestBody} from "@axelar-network/axelarjs-sdk";

export class AxelarMicroservices {

	private MICROSERVICES_HOSTNAME: string;
	private axios: AxiosInstance;
	private LINK_URL: string = "default/msg";

	constructor() {
		this.MICROSERVICES_HOSTNAME = (process.env.MICROSERVICES_URL + "/") as string;
		this.axios = require("axios")
			.create({
				baseUrl: this.MICROSERVICES_HOSTNAME,
				headers: {'Access-Control-Allow-Origin' : '*',
					'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS'
				}
			} as AxiosRequestConfig);
	}

	public async link(body: INonSmartContractLinkRequestBody | ISmartContractLinkRequestBody) {
		try {
			const res = await this.axios.post(this.MICROSERVICES_HOSTNAME + this.LINK_URL, body)
			return res.data;
		} catch (e: any) {
			return e;
		}
	}

}

