import {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import {IBTCLinkRequestBody, IEVMLinkRequestBody}         from "@axelar-network/axelarjs-sdk";

export class AxelarMicroservices {

	private MICROSERVICES_HOSTNAME: string;
	private axios: AxiosInstance;
	private SENDER_URL: string = "/sender";
	private LINK_URL: string = "/msg";

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

	public async getSender(): Promise<string> {
		try {
			const res: AxiosResponse = await this.axios.get(this.MICROSERVICES_HOSTNAME + this.SENDER_URL, {
				data: { httpMethod: "GET"}
			})
			return (res.data as any).body as string;
		} catch (e: any) {
			return e;
		}
	}

	public async link(body: IBTCLinkRequestBody | IEVMLinkRequestBody) {
		try {
			const res = await this.axios.post(this.MICROSERVICES_HOSTNAME + this.LINK_URL,{
				httpMethod: "POST",
				body: JSON.stringify(body)
			})
			return res.data;
		} catch (e: any) {
			return e;
		}
	}

}

