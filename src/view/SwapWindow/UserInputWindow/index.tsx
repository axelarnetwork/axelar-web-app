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
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}                                    from "config/consts";
import useResetUserInputs                                                           from "hooks/useResetUserInputs";
import {ChainSelection, DestinationAddress, IsValidDestinationAddress, SourceAsset} from "state/ChainSelection";
import StyledButtonContainer                                                        from "../StyledComponents/StyledButtonContainer";
import PlainButton                                                                  from "../StyledComponents/PlainButton";

interface IUserInputWindowProps {
	handleSwapSubmit: () => Promise<string>;
}

const StyledUserInputWindow = styled.div`
	width: 310px;
	height: 425px;
	position: relative;
	overflow: hidden;
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

	const enableSubmitBtn = sourceChainSelection && destChainSelection
		&& sourceChainSelection.chainName !== destChainSelection.chainName
		&& selectedSourceAsset
		&& isValidDestinationAddress;

	return <StyledUserInputWindow>
		<br/><br/>
		<div style={{maxHeight: `350px`, overflow: `hidden`}}>
			<ChainSelector id={SOURCE_TOKEN_KEY} label={"Source Chain"}/>
			<div><SwapChains/></div>
			<ChainSelector id={DESTINATION_TOKEN_KEY} label={"Destination Chain"}/>
			<br/><br/>
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
		<StyledButtonContainer>
			<PlainButton disabled={!enableSubmitBtn} dim={!enableSubmitBtn} onClick={onInitiateTransfer}>
				Initiate Asset Transfer
			</PlainButton>
		</StyledButtonContainer>

	</StyledUserInputWindow>;
}

export default UserInputWindow;