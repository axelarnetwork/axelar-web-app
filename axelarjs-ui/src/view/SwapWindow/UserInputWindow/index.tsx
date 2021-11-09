import React, {useCallback, useState}            from "react";
import {useRecoilState, useRecoilValue}          from "recoil";
import {IAssetInfo, validateDestinationAddress}  from "@axelar-network/axelarjs-sdk";
import {InputForm}                               from "component/CompositeComponents/InputForm";
import ChainSelector                             from "component/CompositeComponents/Selectors/ChainSelector";
import TransferFeeDivider                        from "component/CompositeComponents/TransferFeeDivider";
import {FlexColumn}                              from "component/StyleComponents/FlexColumn";
import {StyledButton}                            from "component/StyleComponents/StyledButton";
import DelayedRender                             from "component/Widgets/DelayedRender";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY} from "config/consts";
import useResetUserInputs                        from "hooks/useResetUserInputs";
import {ChainSelection, DestinationAddress}      from "state/ChainSelection";
import "../todelete.css";

interface IUserInputWindowProps {
	handleSwapSubmit: () => Promise<string>;
}

const UserInputWindow = ({handleSwapSubmit}: IUserInputWindowProps) => {

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

		<ChainSelector id={SOURCE_TOKEN_KEY} label={"Source Chain"} /><br/>
		<ChainSelector id={DESTINATION_TOKEN_KEY} label={"Destination Chain"}/><br/>
		<TransferFeeDivider />
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