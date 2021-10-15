import {validateDestinationAddress} from "@axelar-network/axelarjs-sdk/dist/utils";
import {IAsset}                     from "@axelar-network/axelarjs-sdk";

export const validateAddr = (addrInfo: IAsset, cb?: any) => {
	return validateDestinationAddress(addrInfo);
}