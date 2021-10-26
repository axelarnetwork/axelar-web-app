import {Request, ResponseToolkit} from "@hapi/hapi";
import {
	CLIENT_API_POST_TRANSFER_ASSET,
	IAssetInfo,
	IAssetTransferObject,
	validateDestinationAddress
}                                 from "@axelar-network/axelarjs-sdk";
import Boom                   from "@hapi/boom";
import DepositAddressListener from "../../../Services/TendermintWebsocket/DepositAddressListener";
import {AxelarMicroservices}  from "../../../Services/AxelarMicroservices";
import {
	constructLinkBody,
	handleRecaptcha
}                             from "../../helpers";
import {toProperCase}         from "../../../Services/util/toProperCase";

interface AssetTransferRequest extends Request {
	payload: IAssetTransferObject;
}

export const transferAsset = {
	method: 'POST',
	path: CLIENT_API_POST_TRANSFER_ASSET,
	handler: async function (request: AssetTransferRequest, h: ResponseToolkit) {

		try {

			let payload: IAssetTransferObject = request.payload as IAssetTransferObject;

			if (!validateDestinationAddress(payload?.destinationChainInfo?.chainSymbol, payload?.selectedDestinationAsset))
				throw Boom.badRequest("bad destination address");

			const recaptchaResult: any = await handleRecaptcha(request.payload.recaptchaToken);
			if (!recaptchaResult?.success || recaptchaResult?.score < 0.5) {
				return Boom.forbidden("bad recaptcha verification");
			}

			const axelarMicroservices = new AxelarMicroservices();
			const linkBody = constructLinkBody(payload);
			linkBody.sender = await axelarMicroservices.getSender();
			const link = await axelarMicroservices.link(linkBody);

			const assetAddress: any = await new DepositAddressListener().listen(
				payload.sourceChainInfo.chainName?.toLowerCase(),
				toProperCase(payload.destinationChainInfo.chainName),
				payload.selectedDestinationAsset.assetAddress as string
			);

			const responseObj: IAssetInfo = {
				assetAddress,
				assetSymbol: payload?.sourceChainInfo?.chainSymbol
			}

			return h.response(responseObj);

		} catch (e: any) {

			console.log(e);
			throw Boom.boomify(e, {statusCode: 500});

		}

	}

}