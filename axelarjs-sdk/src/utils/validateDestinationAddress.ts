import {ITokenAddress}                  from "../interface";
import {SupportedTokenSymbols}          from "../constants";
import {isAddress as isValidEVMAddress} from "ethers/lib/utils";
import {validate  as isValidBTCAddress} from "bitcoin-address-validation";

export const validateDestinationAddress = (destTokenInfo: ITokenAddress): boolean => {

	const destTokenSymbol: SupportedTokenSymbols = destTokenInfo?.tokenSymbol;
	const destTokenAddr: string = destTokenInfo?.tokenAddress as string;

	console.log(destTokenInfo);
	switch (destTokenSymbol) {
		case SupportedTokenSymbols.BTC:
			return isValidBTCAddress(destTokenAddr);
		case SupportedTokenSymbols.EVM:
			return isValidEVMAddress(destTokenAddr);
		case SupportedTokenSymbols.AXL:
			return true; //TODO: do we have an address validator in our network?
		default:
			return false;
	}

}