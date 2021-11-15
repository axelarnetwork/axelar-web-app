import React, {useCallback, useState}                    from "react";
import {useRecoilState, useRecoilValue}                  from "recoil";
import {IAssetInfo, validateDestinationAddress}          from "@axelar-network/axelarjs-sdk";
import {InputForm}                                       from "component/CompositeComponents/InputForm";
import ChainSelector                                     from "component/CompositeComponents/Selectors/ChainSelector";
import SwapChains                                        from "component/CompositeComponents/SwapChains";
import TransferFeeDivider                                from "component/CompositeComponents/TransferFeeDivider";
import {FlexColumn}                                      from "component/StyleComponents/FlexColumn";
import {StyledButton}                                    from "component/StyleComponents/StyledButton";
import DelayedRender                                     from "component/Widgets/DelayedRender";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}         from "config/consts";
import useResetUserInputs                                from "hooks/useResetUserInputs";
import {ChainSelection, DestinationAddress, SourceAsset} from "state/ChainSelection";
import "../todelete.css";
import styled                                            from "styled-components";

interface IUserInputWindowProps {
	handleSwapSubmit: () => Promise<string>;
}

const StyledUserInputWindow = styled.div`
    position: absolute;
	padding: 10% 18% 5% 18%;
    top: 5%;
    left: 0;
    right: 0;
    bottom: 0;
`;

const UserInputWindow = ({handleSwapSubmit}: IUserInputWindowProps) => {

	const sourceChainSelection = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const destChainSelection = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const selectedSourceAsset = useRecoilValue(SourceAsset);
	const [destAddr, setDestAddr] = useRecoilState(DestinationAddress);
	const [isValidDestinationAddress, setIsValidDestinationAddress] = useState(true);
	const resetUserInputs = useResetUserInputs();
	const [mounted, setMounted] = useState(true);

	const onInitiateTransfer = useCallback(async () => {
		const destToken: IAssetInfo = {
			assetAddress: destAddr as string,
			assetSymbol: destChainSelection?.chainSymbol
		}
		const validAddr: boolean = validateDestinationAddress(destChainSelection?.chainSymbol as string, destToken);
		setIsValidDestinationAddress(validAddr);
		if (!(destAddr && validAddr && mounted))
			return;
		try {
			setMounted(false);
			await handleSwapSubmit();
			return;
		} catch (e) {
			resetUserInputs();
		}
	}, [destAddr,
		destChainSelection,
		handleSwapSubmit,
		mounted,
		setIsValidDestinationAddress,
		setMounted,
		resetUserInputs
	]);

	const enableSubmitBtn = sourceChainSelection && destChainSelection
		&& sourceChainSelection.chainName !== destChainSelection.chainName
		&& selectedSourceAsset
		&& destAddr;

	return <StyledUserInputWindow>

		<ChainSelector id={SOURCE_TOKEN_KEY} label={"Source Chain"}/>
		<div><SwapChains/></div>
		<ChainSelector id={DESTINATION_TOKEN_KEY} label={"Destination Chain"}/><br/>
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
			<StyledButton disabled={!enableSubmitBtn} dim={!enableSubmitBtn} onClick={onInitiateTransfer}> {
				isValidDestinationAddress
					? "Initiate Asset Transfer"
					: <DelayedRender
						prevChild={<span>
							The {destChainSelection?.chainSymbol} address does not look right...
						</span>}
						newChild={<span>Retry and resubmit here</span>}
						delayBeforeNewChild={3000}
					/>
			} </StyledButton>
		</FlexColumn>

	</StyledUserInputWindow>;
}

export default UserInputWindow;