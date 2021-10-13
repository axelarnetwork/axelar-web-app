import {IAssetTransferObject, ITokenAddress, TransferAssetBridge} from "@axelar-network/axelarjs-sdk";
import downstreamServices                                         from "config/downstreamServices";

declare const grecaptcha: any;

export class TransferAssetBridgeFacade {

	private static hostUrl: string;
	private static transferAssetBridge: TransferAssetBridge;

	constructor(hostUrl: string) {
		TransferAssetBridgeFacade.hostUrl = hostUrl;
		TransferAssetBridgeFacade.transferAssetBridge = new TransferAssetBridge(TransferAssetBridgeFacade.hostUrl);
	}

	public static async transferAssets(message: IAssetTransferObject, waitCb: any, errCb: any): Promise<ITokenAddress> {
		message.recaptchaToken = await TransferAssetBridgeFacade.getRecaptchaToken();
		return TransferAssetBridgeFacade.transferAssetBridge.transferAssets(message, waitCb, errCb);
	}

	private static async getRecaptchaToken() {
		return new Promise((resolve) => {
			grecaptcha.ready(async () => {
				const token = await grecaptcha.execute(downstreamServices.SITE_KEY);
				resolve(token);
			});
		});
	}

}