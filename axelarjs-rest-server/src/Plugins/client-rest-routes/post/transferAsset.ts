import {Request, ResponseToolkit}                                            from "@hapi/hapi";
import {CLIENT_API_POST_TRANSFER_ASSET, IAssetTransferObject, ITokenAddress} from "@axelar-network/axelarjs-sdk";
import Boom                                                                  from "@hapi/boom";
import DepositAddressListener
                                                                             from "../../../services/DepositAddressListener";
import {AxelarMicroservices}                                                 from "../../../services/AxelarMicroservices";
import {constructLinkBody}                                                   from "../helpers";
import axios from "axios";

interface AssetTransferRequest extends Request {
	payload: IAssetTransferObject;
}

const handleRecaptcha = (token: any) => {
	const secret_key = process.env.GOOGLE_RECAPTCHA_V3_SECRET_KEY;
	const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;

	return new Promise((resolve, reject) => {
		axios.post(url)
		.then(google_response => resolve(google_response.data))
		.catch(error => reject({ error }));
	});
};


export const transferAsset = {
	method: 'POST',
	path: CLIENT_API_POST_TRANSFER_ASSET,
	handler: async function (request: AssetTransferRequest, h: ResponseToolkit) {

		try {

			let payload: IAssetTransferObject = request.payload as IAssetTransferObject;

			const recaptchaVerification = await handleRecaptcha(request.payload.recaptchaToken);

			if (!(recaptchaVerification as any)?.success) {
				const msg: string = "bad recaptcha verification";
				console.log(msg);
				return Boom.forbidden(msg);
			} else {
				console.log("good recaptcha verification");
			}


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