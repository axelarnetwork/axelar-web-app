import React, {ReactElement} from "react";
import {StyledSwapWindow} from "./styles/StyledSwapWIndow";
import {IAssetTransferObject} from "@axelar-network/axelarjs-sdk";
import {TransferAssetBridgeFacade} from "api/TransferAssetBridgeFacade";
import ChainSelector from "component/CompositeComponents/ChainSelector";
import {FlexRow} from "component/FlexRow";

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
		<FlexRow>
			<ChainSelector id={"first-chain-selection"}/>
			<ChainSelector id={"second-chain-selection"}/>
		</FlexRow>
		<div onClick={onClick}>Click me!</div>
	</StyledSwapWindow>;
}

export default SwapWindow;