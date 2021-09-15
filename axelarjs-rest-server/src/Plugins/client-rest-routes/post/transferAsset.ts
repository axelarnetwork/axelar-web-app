import {Request, ResponseToolkit} from "@hapi/hapi";
import {
	CLIENT_API_POST_TRANSFER_ASSET,
	IAssetTransferObject,
	IDepositAddressResponse
}                                 from "@axelar-network/axelarjs-sdk";
import Boom                       from "@hapi/boom";

interface AssetTransferRequest extends Request {
	payload: IAssetTransferObject;
}

export const transferAsset = {
	method: 'POST',
	path: CLIENT_API_POST_TRANSFER_ASSET,
	handler: function (request: AssetTransferRequest, h: ResponseToolkit) {

		try {

			let payload: IAssetTransferObject = request.payload as IAssetTransferObject;

			const responseObj: IDepositAddressResponse = {
				sourceTokenDepositAddress: "123456789", // TODO: will come from downstream service
				sourceTokenSymbol: payload?.sourceTokenSymbol
			}

			return h.response(responseObj);

		} catch (e: any) {

			console.log(e);
			throw Boom.boomify(e, {statusCode: 400});

		}

	}

}