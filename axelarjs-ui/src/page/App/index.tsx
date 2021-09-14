import React from 'react';
import {IAssetTransferObject} from "@axelar-network/axelarjs-sdk";
import PageHeader from "component/PageHeader";
import SwapWindow from "page/SwapWindow";
import {TransferAssetBridgeFacade} from "api/TransferAssetBridgeFacade";
import {StyledContainer} from "./styles/StyledContainer";
import {StyledBody} from "./styles/StyledBody";

const App = () => {

	const message: IAssetTransferObject = {
		sourceTokenSymbol: "BTC",
		destinationTokenSymbol: "ETH",
		destinationAddress: "TBD"
	}

	const onClick = async () => {

		const res = await TransferAssetBridgeFacade.transferAssets(message, console.log);
		console.log("results", res);
	}

	return (
		<StyledContainer>
			<PageHeader/>
			<StyledBody>
				<SwapWindow/>
				<div onClick={onClick}>Click me!</div>
			</StyledBody>
		</StyledContainer>
	);
}

export default App;
