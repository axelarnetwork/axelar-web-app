import {AxiosInstance, AxiosRequestConfig}        from "axios";
import {IBTCLinkRequestBody, IEVMLinkRequestBody} from "@axelar-network/axelarjs-sdk";

export class AxelarMicroservices {

	private MICROSERVICES_HOSTNAME: string;
	private axios: AxiosInstance;
	private LINK_URL: string = "default/msg";

	constructor() {
		this.MICROSERVICES_HOSTNAME = process.env.MICROSERVICES_URL as string;
		this.axios = require("axios")
		.create({
			baseUrl: this.MICROSERVICES_HOSTNAME,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
			}
		} as AxiosRequestConfig);
	}

	public async link(body: IBTCLinkRequestBody | IEVMLinkRequestBody) {
		try {
			const res = await this.axios.post(this.MICROSERVICES_HOSTNAME + this.LINK_URL, body)
			return res.data;
		} catch (e: any) {
			console.log("error hitting link",e);
			return e;
		}
	}

}

