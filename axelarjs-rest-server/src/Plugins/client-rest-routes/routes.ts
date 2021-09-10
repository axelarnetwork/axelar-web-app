'use strict';

import {Request, ResponseToolkit, Server} from "@hapi/hapi";
import {
	CLIENT_API_POST_TRANSFER_ASSET,
	IAssetTransferObject,
	IDepositAddressResponse
} from "@axelar-network/axelarjs-sdk";
import Boom from "@hapi/boom";

interface AssetTransferRequest extends Request {
	payload: IAssetTransferObject;
}

export const routes = {
	name: 'routes',
	version: '1.0.0',
	register: async (server: Server, options: any) => {

		server.route({
			method: 'GET',
			path: '/',
			handler: (request: Request): string => {

				console.log("Processing request", request.info.id);
				return "This is working!";

			}
		});

		server.route({
			method: 'POST',
			path: CLIENT_API_POST_TRANSFER_ASSET,
			handler: function (request: AssetTransferRequest, h: ResponseToolkit) {

				try {
					let payload: IAssetTransferObject;
					payload = request.payload as IAssetTransferObject;
					console.log("post request", payload);
					const responseObj: IDepositAddressResponse = {
						destinationTokenDepositAddress: "123456789",
						destinationTokenSymbol: payload?.destinationTokenSymbol
					}
					return h.response(responseObj);
				} catch (e: any) {
					console.log(e);
					throw Boom.boomify(e, { statusCode: 500});
				}
			}
		});

		// etc ...
		// await someAsyncMethods(); what does this do?
	}
};