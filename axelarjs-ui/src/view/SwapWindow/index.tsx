import React, {ReactElement}                       from "react";
import {useRecoilValue}                            from "recoil";
import {IAssetTransferObject, ISupportedChainType} from "@axelar-network/axelarjs-sdk";
import {StyledSwapWindow}                          from "view/SwapWindow/styles/StyledSwapWIndow";
import {TransferAssetBridgeFacade}                 from "api/TransferAssetBridgeFacade";
import ChainSelector                               from "component/CompositeComponents/ChainSelector";
import {FlexRow}                                   from "component/StyleComponents/FlexRow";
import {NumberFormInput}                           from "component/CompositeComponents/NumberFormInput";
import {FlexColumn}                                from "component/StyleComponents/FlexColumn";
import {ChainSelection, DestinationAddress}        from "state/ChainSelection";
import {Nullable}                                  from "interface/Nullable";
import Button                                      from "react-bootstrap/Button";
import {GridDisplay}                               from "component/StyleComponents/GridDisplay";

const SwapWindow = (): ReactElement => {

	const sourceTokenKey: string = "first-chain-selection";
	const destinationTokenKey: string = "second-chain-selection";
	const sourceToken: Nullable<ISupportedChainType> = useRecoilValue(ChainSelection(sourceTokenKey));
	const destinationToken: Nullable<ISupportedChainType> = useRecoilValue(ChainSelection(destinationTokenKey));
	const destinationAddress: Nullable<string> = useRecoilValue(DestinationAddress);

	const onClick = async () => {
		if (!(sourceToken?.symbol && destinationToken?.symbol && destinationAddress))
			return;
		const message: IAssetTransferObject = {
			sourceTokenSymbol: sourceToken.symbol,
			destinationTokenSymbol: destinationToken.symbol,
			destinationAddress
		}
		const res = await TransferAssetBridgeFacade.transferAssets(message, console.log);
		console.log("results", res);
	}

	return <StyledSwapWindow>
		<FlexRow>
			<ChainSelector id={sourceTokenKey} label={"Source"}/>
			<ChainSelector id={destinationTokenKey} label={"Destination"}/>
		</FlexRow>
		<FlexColumn>
			<NumberFormInput/>
		</FlexColumn>
		{sourceToken?.symbol && destinationToken?.symbol && destinationAddress &&
        <GridDisplay>
            <Button
                variant="secondary"
                size="sm"
                onClick={onClick}
            >
                Initiate Asset Transfer
            </Button>
        </GridDisplay>
		}
	</StyledSwapWindow>;
}

export default SwapWindow;