import React, {ReactElement} from "react";
import {StyledSwapWindow} from "./styles/StyledSwapWIndow";
import {IAssetTransferObject} from "@axelar-network/axelarjs-sdk";
import {TransferAssetBridgeFacade} from "../../api/TransferAssetBridgeFacade";

const SwapWindow = (): ReactElement => {

	const onClick = async () => {
		const message: IAssetTransferObject = {
			sourceTokenSymbol: "BTC",
			destinationTokenSymbol: "ETH",
			destinationAddress: "TBD"
		}
		const res = await TransferAssetBridgeFacade.transferAssets(message, console.log);
		console.log("results", res);
	}

	return <StyledSwapWindow>
		<div onClick={onClick}>Click me!</div>
	</StyledSwapWindow>;
}

export default SwapWindow;