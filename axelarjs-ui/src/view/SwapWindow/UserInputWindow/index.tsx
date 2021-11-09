import React, {useCallback, useState}            from "react";
import {useRecoilState, useRecoilValue}          from "recoil";
import {IAssetInfo, validateDestinationAddress}  from "@axelar-network/axelarjs-sdk";
import BoldSpan                                  from "component/StyleComponents/BoldSpan";
import ChainSelector                             from "component/CompositeComponents/Selectors/ChainSelector";
import {InputForm}                               from "component/CompositeComponents/InputForm";
import {FlexColumn}                              from "component/StyleComponents/FlexColumn";
import {DisplayToggle}                           from "component/StyleComponents/DisplayToggle";
import {StyledButton}                            from "component/StyleComponents/StyledButton";
import DelayedRender                             from "component/Widgets/DelayedRender";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY} from "config/consts";
import useResetUserInputs                        from "hooks/useResetUserInputs";
import dividerImage                              from "resources/group.svg";
import {ChainSelection, DestinationAddress}      from "state/ChainSelection";
import {StyledTransferFeeDivider}                from "./StyleComponents/StyledTransferFeeDivider";
import {StyledImage}                             from "../index";
import "../todelete.css";

interface IUserInputWindowProps {
	handleSwapSubmit: () => Promise<string>;
}

const UserInputWindow = ({handleSwapSubmit}: IUserInputWindowProps) => {

	const sourceChainSelection = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const destChainSelection = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const [destAddr, setDestAddr] = useRecoilState(DestinationAddress);
	const [isValidDestinationAddress, setIsValidDestinationAddress] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const resetUserInputs = useResetUserInputs();
	const [mounted, setMounted] = useState(true);

	const onInitiateTransfer = useCallback(async () => {
		const destToken: IAssetInfo = {
			assetAddress: destAddr as string,
			assetSymbol: destChainSelection?.chainSymbol
		}
		const validAddr: boolean = validateDestinationAddress(destChainSelection?.chainSymbol as string, destToken);
		setIsValidDestinationAddress(validAddr);
		if (destAddr && validAddr && mounted) {
			try {
				setIsSubmitting(validAddr);
				setMounted(false);
				await handleSwapSubmit();
				return;
			} catch (e) {
				resetUserInputs();
			}
			setIsSubmitting(false);
		}
	}, [destAddr,
		destChainSelection,
		setIsValidDestinationAddress,
		setIsSubmitting,
		setMounted,
		handleSwapSubmit,
		resetUserInputs
	]);

	return <>

		<ChainSelector id={SOURCE_TOKEN_KEY} label={"Source Chain"} />
		<br/>
		<ChainSelector id={DESTINATION_TOKEN_KEY} label={"Destination Chain"}/>
		<br/>
		<StyledTransferFeeDivider showContents={!!sourceChainSelection}>
			<StyledImage src={dividerImage}/>
			<div style={{display: `flex`, justifyContent: `space-between`}}>
				<div style={{marginLeft: `15px`, marginTop: `15px`}}>
					<div><BoldSpan>Approximate wait time: </BoldSpan></div>
					<div>XX minutes</div>
				</div>
				<div style={{textAlign: `right`}}>
					<div><BoldSpan>Transfer Fee: </BoldSpan></div>
					<div>XX% of xferred {sourceChainSelection?.chainSymbol}</div>
				</div>
			</div>
		</StyledTransferFeeDivider>
		<FlexColumn>
			<br/>
			<InputForm
				name={"destination-address-input"}
				placeholder={"Enter Destination Address (Public Key)"}
				type={"text"}
				onChange={(e: any) => setDestAddr(e.target.value)}
			/>
			<br/>
			<StyledButton disabled={!destAddr} dim={!destAddr} onClick={onInitiateTransfer}> {
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

	</>;
}

export default UserInputWindow;