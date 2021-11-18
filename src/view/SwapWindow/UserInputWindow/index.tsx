import React, {useCallback, useEffect, useState}                                    from "react";
import {useRecoilState, useRecoilValue}                                             from "recoil";
import styled, {ThemedStyledProps}                                                  from "styled-components";
import {IAssetInfo, validateDestinationAddress}                                     from "@axelar-network/axelarjs-sdk";
import {InputForm}                                                                  from "component/CompositeComponents/InputForm";
import ChainSelector
                                                                                    from "component/CompositeComponents/Selectors/ChainSelector";
import SwapChains
                                                                                    from "component/CompositeComponents/SwapChains";
import TransferFeeDivider
                                                                                    from "component/CompositeComponents/TransferFeeDivider";
import {FlexColumn}                                                                 from "component/StyleComponents/FlexColumn";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}                                    from "config/consts";
import useResetUserInputs                                                           from "hooks/useResetUserInputs";
import {ChainSelection, DestinationAddress, IsValidDestinationAddress, SourceAsset} from "state/ChainSelection";
import "../todelete.css";

interface IUserInputWindowProps {
	handleSwapSubmit: () => Promise<string>;
}

const StyledUserInputWindow = styled.div`
	width: 300px;
	height: 425px;
	position: relative;
	overflow: hidden;
`;

interface IStyledButtonProps extends ThemedStyledProps<any, any> {
	dim?: boolean;
}

const PlainButton = styled.button<IStyledButtonProps>`
    border: none;
    background: none;
	${props => props.dim ? "" : "cursor: pointer;"};
    margin: 0px 0px 0px 0px;
    padding: 0;
	color: ${props => props.dim ? "#565656" : "white"};
	transition: color 1000ms;
`;
const ButtonContainer = styled(FlexColumn)`
	width: 100%;
	bottom: 0;
	position: absolute;
	height: 50px;
`;

const UserInputWindow = ({handleSwapSubmit}: IUserInputWindowProps) => {

	const sourceChainSelection = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const destChainSelection = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const selectedSourceAsset = useRecoilValue(SourceAsset);
	const [destAddr, setDestAddr] = useRecoilState(DestinationAddress);
	const [isValidDestinationAddress, setIsValidDestinationAddress] = useRecoilState(IsValidDestinationAddress);
	const resetUserInputs = useResetUserInputs();
	const [mounted, setMounted] = useState(true);

	useEffect(() => {
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

	const enableSubmitBtn = sourceChainSelection && destChainSelection
		&& sourceChainSelection.chainName !== destChainSelection.chainName
		&& selectedSourceAsset
		&& isValidDestinationAddress;

	return <StyledUserInputWindow>
		<br/>
		<div style={{maxHeight: `350px`, overflow: `hidden`}}>
			<ChainSelector id={SOURCE_TOKEN_KEY} label={"Source Chain"}/>
			<div><SwapChains/></div>
			<ChainSelector id={DESTINATION_TOKEN_KEY} label={"Destination Chain"}/>
			<br/>
			<TransferFeeDivider/>
			<FlexColumn>
				<br/>
				<InputForm
					name={"destination-address-input"}
					value={destAddr || ""}
					placeholder={"Enter Destination Address (Public Key)"}
					type={"text"}
					onChange={(e: any) => setDestAddr(e.target.value)}
				/>
				<br/>
			</FlexColumn>
		</div>
		<ButtonContainer>
			<PlainButton disabled={!enableSubmitBtn} dim={!enableSubmitBtn} onClick={onInitiateTransfer}>
				Initiate Asset Transfer
			</PlainButton>
		</ButtonContainer>

	</StyledUserInputWindow>;
}

export default UserInputWindow;