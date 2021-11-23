import React, {useCallback, useEffect, useState}                                    from "react";
import {useRecoilState, useRecoilValue}                                             from "recoil";
import styled                                                                       from "styled-components";
import {IAssetInfo, validateDestinationAddress}                                     from "@axelar-network/axelarjs-sdk";
import {InputForm}                                                                  from "component/CompositeComponents/InputForm";
import ChainSelector
	                                                                                from "component/CompositeComponents/Selectors/ChainSelector";
import SwapChains
	                                                                                from "component/CompositeComponents/SwapChains";
import TransferFeeDivider
	                                                                                from "component/CompositeComponents/TransferFeeDivider";
import {FlexColumn}                                                                 from "component/StyleComponents/FlexColumn";
import ValidationErrorWidget
	                                                                                from "component/Widgets/ValidationErrorWidget";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}                                    from "config/consts";
import screenConfigs                                                                from "config/screenConfigs";
import useResetUserInputs                                                           from "hooks/useResetUserInputs";
import {ChainSelection, DestinationAddress, IsValidDestinationAddress, SourceAsset} from "state/ChainSelection";
import StyledButtonContainer                                                        from "../StyledComponents/StyledButtonContainer";
import PlainButton                                                                  from "../StyledComponents/PlainButton";

interface IUserInputWindowProps {
	handleSwapSubmit: () => Promise<string>;
}

const StyledUserInputWindow = styled.div`
	position: relative;
	overflow-y: hidden;
	
	@media ${screenConfigs.media.laptop} {
		width: 100%;
	    height: 685px;
	}
	@media ${screenConfigs.media.tablet} {
		width: 310px;
		height: 425px;
	}
	@media ${screenConfigs.media.mobile} {
		width: 310px;
		height: 425px;
	}

`;

const StyledChainSelectorSection = styled.div`
	overflow-y: hidden;
	@media ${screenConfigs.media.laptop} {
		max-height: 500px;
	}
	@media ${screenConfigs.media.tablet} {
		max-height: 350px;
	}
	@media ${screenConfigs.media.mobile} {
		max-height: 350px;
	}	
`;

const StyledInputFormSection = styled(FlexColumn)`
	margin-top: 10px;
`;

const UserInputWindow = ({handleSwapSubmit}: IUserInputWindowProps) => {

	const sourceChainSelection = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const destChainSelection = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const selectedSourceAsset = useRecoilValue(SourceAsset);
	const [destAddr, setDestAddr] = useRecoilState(DestinationAddress);
	const [isValidDestinationAddress, setIsValidDestinationAddress] = useRecoilState(IsValidDestinationAddress);
	const resetUserInputs = useResetUserInputs();
	const [mounted, setMounted] = useState(true);
	const [showValidationErrors, setShowValidationErrors] = useState(false);

	useEffect(() => {
		setMounted(true);
		const destToken: IAssetInfo = {
			assetAddress: destAddr as string,
			assetSymbol: destChainSelection?.chainSymbol
		}
		const validAddr: boolean = validateDestinationAddress(destChainSelection?.chainSymbol as string, destToken);
		setIsValidDestinationAddress(validAddr);
	}, [destAddr, destChainSelection, setIsValidDestinationAddress]);

	const onInitiateTransfer = useCallback(async () => {
		if (!(destAddr && isValidDestinationAddress && mounted))
			return;
		try {
			setMounted(false);
			await handleSwapSubmit();
			return;
		} catch (e) {
			resetUserInputs();
		}
	}, [destAddr,
		isValidDestinationAddress,
		handleSwapSubmit,
		mounted,
		setMounted,
		resetUserInputs
	]);

	const renderValidationErrors = useCallback(() => {
		if (!sourceChainSelection)
			return <ValidationErrorWidget text={`Select a source chain.`} />
		if (!selectedSourceAsset)
			return <ValidationErrorWidget text={`Select an asset on the source chain.`} />
		if (!destChainSelection)
			return <ValidationErrorWidget text={`Select a destination chain.`} />
		if (sourceChainSelection.chainName === destChainSelection.chainName)
			return <ValidationErrorWidget text={`Source and destination chains can't be equal.`} />
		if (!isValidDestinationAddress)
			return <ValidationErrorWidget text={`Invalid input address for ${destChainSelection.chainName}.`} />
	},[sourceChainSelection, destChainSelection, selectedSourceAsset, isValidDestinationAddress]);

	const enableSubmitBtn = sourceChainSelection && destChainSelection
		&& sourceChainSelection.chainName !== destChainSelection.chainName
		&& selectedSourceAsset
		&& isValidDestinationAddress;

	return <StyledUserInputWindow>
		<br/><br/>
		<StyledChainSelectorSection>
			<ChainSelector id={SOURCE_TOKEN_KEY} label={"Source Chain"}/>
			<div><SwapChains/></div>
			<ChainSelector id={DESTINATION_TOKEN_KEY} label={"Destination Chain"}/>
			<br/>
			<TransferFeeDivider/>
			<StyledInputFormSection>
				<br/>
				<InputForm
					name={"destination-address-input"}
					value={destAddr || ""}
					placeholder={"Enter Destination Address (Public Key)"}
					type={"text"}
					onChange={(e: any) => setDestAddr(e.target.value)}
				/>
			</StyledInputFormSection>
		</StyledChainSelectorSection>
		{ showValidationErrors && renderValidationErrors()}
		<StyledButtonContainer>
			<PlainButton
				dim={!enableSubmitBtn}
				onClick={onInitiateTransfer}
				onMouseEnter={() => !enableSubmitBtn && setShowValidationErrors(true)}
				onMouseLeave={() => setShowValidationErrors(false)}
			>
				Initiate Asset Transfer
			</PlainButton>
		</StyledButtonContainer>

	</StyledUserInputWindow>;
}

export default UserInputWindow;