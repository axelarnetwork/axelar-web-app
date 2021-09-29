import React, {ReactElement, useState} from "react";
import {useRecoilState}                from "recoil";
import {
	BlockCypherResponse,
	IAssetTransferObject,
	IBlockCypherResponse,
	IDepositAddressResponse
}                                      from "@axelar-network/axelarjs-sdk";
import {StyledSwapWindow}              from "view/SwapWindow/styles/StyledSwapWIndow";
import {TransferAssetBridgeFacade}     from "api/TransferAssetBridgeFacade";
import ChainSelector                   from "component/CompositeComponents/ChainSelector";
import {FlexRow}                       from "component/StyleComponents/FlexRow";
import {NumberFormInput}               from "component/CompositeComponents/NumberFormInput";
import {FlexColumn}                    from "component/StyleComponents/FlexColumn";
import {
	ChainSelection,
	DestinationAddress
}                                      from "state/ChainSelection";
import {Nullable}                      from "interface/Nullable";
import Button                          from "react-bootstrap/Button";
import {GridDisplay}                   from "component/StyleComponents/GridDisplay";
import DismissableAlert                from "component/Widgets/DismissableAlert";
import BoldSpan                        from "component/StyleComponents/BoldSpan";

const SwapWindow = (): ReactElement => {

	const sourceTokenKey: string = "first-chain-selection";
	const destinationTokenKey: string = "second-chain-selection";
	const [sourceToken, setSourceToken] = useRecoilState(ChainSelection(sourceTokenKey));
	const [destinationToken, setDestinationToken] = useRecoilState(ChainSelection(destinationTokenKey));
	const [destinationAddress, setDestinationAddress] = useRecoilState(DestinationAddress);
	const [numConfirmations, setNumConfirmations] = useState<Nullable<number>>(null);

	const [showResultsScreen, setShowResultsScreen] = useState<boolean>(false);
	const [depositAddress, setDepositAddress] = useState<Nullable<IDepositAddressResponse>>(null);
	const onClick = async () => {
		if (!(sourceToken?.symbol && destinationToken?.symbol && destinationAddress))
			return;
		const message: IAssetTransferObject = {
			sourceTokenSymbol: sourceToken.symbol,
			destinationTokenSymbol: destinationToken.symbol,
			destinationAddress
		}
		const getStatus: IBlockCypherResponse = (status: BlockCypherResponse): void => {
			console.log("status+++++", status);
			let confirms: Nullable<number> = null;
			if (status.unconfirmed_txrefs)
				confirms = 0;
			if (status?.txrefs?.length)
				confirms = status.txrefs[0].confirmations;
			if (confirms)
				setNumConfirmations(confirms);

		};
		const res: IDepositAddressResponse = await TransferAssetBridgeFacade.transferAssets(message, getStatus);
		setDepositAddress(res);
		setShowResultsScreen(true);
	}

	return <StyledSwapWindow>
		<FlexRow>
			<ChainSelector id={sourceTokenKey} label={"Source"}/>
			<ChainSelector id={destinationTokenKey} label={"Destination"}/>
		</FlexRow>
		<FlexColumn>
			<NumberFormInput/>
		</FlexColumn>
		{sourceToken?.symbol && destinationToken?.symbol && destinationAddress && !showResultsScreen &&
        <GridDisplay>
            <Button
                variant="secondary"
                size="sm"
                onClick={onClick}
            >
                Initiate Asset Transfer
            </Button>
        </GridDisplay>}
		<GridDisplay>
			<DismissableAlert
				headerText={"Transfer In Progress..."}
				bodyContent={<span>Next step: please deposit
					<BoldSpan> {depositAddress?.sourceTokenSymbol} </BoldSpan>
					to the following address:
					<BoldSpan> {depositAddress?.sourceTokenDepositAddress}</BoldSpan>
					<BoldSpan> Number of confirms {numConfirmations}</BoldSpan>
				.</span>}
				closeCb={() => {
					//TODO: is there a better place to reset these params?
					setShowResultsScreen(false);
					setSourceToken(null);
					setDestinationToken(null);
					setDestinationAddress(null);
				}}
				open={showResultsScreen}
			/>
		</GridDisplay>
	</StyledSwapWindow>;
}

export default SwapWindow;