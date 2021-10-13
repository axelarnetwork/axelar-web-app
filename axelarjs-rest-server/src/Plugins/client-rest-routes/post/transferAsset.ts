import {Request, ResponseToolkit}                                            from "@hapi/hapi";
import {CLIENT_API_POST_TRANSFER_ASSET, IAssetTransferObject, ITokenAddress} from "@axelar-network/axelarjs-sdk";
import Boom                                                                  from "@hapi/boom";
import DepositAddressListener
                                                                             from "../../../services/DepositAddressListener";
import {AxelarMicroservices}                                                 from "../../../services/AxelarMicroservices";
import {constructLinkBody}                                                   from "../helpers";

interface AssetTransferRequest extends Request {
	payload: IAssetTransferObject;
}


export const transferAsset = {
	method: 'POST',
	path: CLIENT_API_POST_TRANSFER_ASSET,
	handler: async function (request: AssetTransferRequest, h: ResponseToolkit) {

		try {

			let payload: IAssetTransferObject = request.payload as IAssetTransferObject;

			const link = await new AxelarMicroservices().link(constructLinkBody(payload));

			const tokenAddress: any = await new DepositAddressListener().startTendermintSocketForDepositAddress();

			const responseObj: ITokenAddress = {
				tokenAddress,
				tokenSymbol: payload?.sourceTokenInfo?.tokenSymbol
			}

			return h.response(responseObj);

		} catch (e: any) {

			console.log(e);
			throw Boom.boomify(e, {statusCode: 500});

		}

	}

}