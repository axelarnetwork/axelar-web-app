import {validateDestinationAddress} from "@axelar-network/axelarjs-sdk/dist/utils";
import {ITokenAddress}              from "@axelar-network/axelarjs-sdk";

export const validateAddr = (addrInfo: ITokenAddress, cb?: any) => {
	return validateDestinationAddress(addrInfo);
}