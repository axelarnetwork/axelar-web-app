import {Request, ResponseToolkit} from "@hapi/hapi";
import {
	CLIENT_API_POST_TRANSFER_ASSET,
	IAssetTransferObject,
	IDepositAddressResponse
}                                 from "@axelar-network/axelarjs-sdk";
import Boom                                         from "@hapi/boom";
import {startTendermintSocketForDestinationAddress} from "../../../services";

interface AssetTransferRequest extends Request {
	payload: IAssetTransferObject;
}

export const transferAsset = {
	method: 'POST',
	path: CLIENT_API_POST_TRANSFER_ASSET,
	handler: async function (request: AssetTransferRequest, h: ResponseToolkit) {

		try {

			let payload: IAssetTransferObject = request.payload as IAssetTransferObject;

			const sourceTokenDepositAddress: any = await startTendermintSocketForDestinationAddress();

			const responseObj: IDepositAddressResponse = {
				sourceTokenDepositAddress,
				sourceTokenSymbol: payload?.sourceTokenSymbol
			}

			return h.response(responseObj);

		} catch (e: any) {

			console.log(e);
			throw Boom.boomify(e, {statusCode: 400});

		}

	}

}