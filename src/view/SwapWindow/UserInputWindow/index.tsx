import React, {ChangeEvent, createRef, KeyboardEvent, useCallback, useEffect, useState} from "react";
import {useRecoilState, useRecoilValue, useSetRecoilState}                              from "recoil";
import styled                                                                           from "styled-components";
import {
	AssetInfo, ChainInfo, validateDestinationAddress
}                                                                                       from "@axelar-network/axelarjs-sdk";
import {InputForm}                                                                      from "component/CompositeComponents/InputForm";
import ChainSelector
                                                                                        from "component/CompositeComponents/Selectors/ChainSelector";
import SwapChains
                                                                                        from "component/CompositeComponents/SwapChains";
import TransactionInfo
                                                                                        from "component/CompositeComponents/TransactionInfo";
import {FlexColumn}                                                                     from "component/StyleComponents/FlexColumn";
import {SVGImage}                                                                       from "component/Widgets/SVGImage";
import ValidationErrorWidget
                                                                                        from "component/Widgets/ValidationErrorWidget";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}                                        from "config/consts";
import screenConfigs                                                                    from "config/screenConfigs";
import useResetUserInputs                                                               from "hooks/useResetUserInputs";
import {MetaMaskWallet}                                                                 from "hooks/wallet/MetaMaskWallet";
import {KeplrWallet}                                                                    from "hooks/wallet/KeplrWallet";
import {WalletInterface}                                                                from "hooks/wallet/WalletInterface";
import {DisclaimerAgreed}                                                               from "state/ApplicationStatus";
import {ChainSelection, DestinationAddress, IsValidDestinationAddress, SourceAsset}     from "state/ChainSelection";
import StyledButtonContainer
                                                                                        from "../StyledComponents/StyledButtonContainer";
import PlainButton
                                                                                        from "../StyledComponents/PlainButton";
import TopFlowsSelectorWidget                                                           from "../TopFlowsSelector";

interface IUserInputWindowProps {
	handleTransactionSubmission: (numAttempt: number) => Promise<string>;
}

const StyledUserInputWindow = styled.div`
	position: relative;
	overflow-y: hidden;
	
	@media ${screenConfigs.media.desktop} {
		width: 100%;
		margin-top: 50px;
	    height: 685px;
	}
	@media ${screenConfigs.media.laptop} {
		width: 100%;
	    height: 545px;
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
	@media ${screenConfigs.media.desktop} {
		max-height: 500px;
		margin-top: 25px;
	}
	@media ${screenConfigs.media.laptop} {
		max-height: 425px;
	}
	@media ${screenConfigs.media.tablet} {
		max-height: 350px;
	}
	@media ${screenConfigs.media.mobile} {
		max-height: 350px;
	}	
`;

const StyledInputFormSection = styled(FlexColumn)`
	
	@media ${screenConfigs.media.desktop} {
		margin-top: 50px;
	}
	@media ${screenConfigs.media.laptop} {
		margin-top: 30px;
	}
	@media ${screenConfigs.media.tablet} {
		margin-top: 5px;
	}
	@media ${screenConfigs.media.mobile} {
		margin-top: 5px;
	}	
`;

const StyledSVGImage = styled(SVGImage)`
	cursor: pointer;
`;

const UserInputWindow = ({handleTransactionSubmission}: IUserInputWindowProps) => {

	const sourceChainSelection = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const destChainSelection = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const selectedSourceAsset = useRecoilValue(SourceAsset);
	const [destAddr, setDestAddr] = useRecoilState(DestinationAddress);
	const [isValidDestinationAddress, setIsValidDestinationAddress] = useRecoilState(IsValidDestinationAddress);
	const resetUserInputs = useResetUserInputs();
	const [showValidationErrors, setShowValidationErrors] = useState(false);
	const srcChainComponentRef = createRef();
	const destChainComponentRef = createRef();
	const [attemptNumber, setAttemptNumber] = useState(1);
	const [mounted, setMounted] = useState(true);
	const setDisclaimerAgreed = useSetRecoilState(DisclaimerAgreed);

	useEffect(() => {
		setMounted(true);
		const destToken: AssetInfo = {
			assetAddress: destAddr as string,
			assetSymbol: destChainSelection?.chainSymbol
		}
		const validAddr: boolean = validateDestinationAddress(destChainSelection?.chainSymbol as string, destToken);
		setIsValidDestinationAddress(validAddr);
	}, [destAddr, destChainSelection, setIsValidDestinationAddress]);

	const onInitiateTransfer = useCallback(async () => {

		if (!(destAddr && isValidDestinationAddress && mounted))
			return;
		setDisclaimerAgreed(true);
		try {
			setMounted(false);
			await handleTransactionSubmission(attemptNumber);
			return;
		} catch (e: any) {
			if (e?.statusCode === 403 && attemptNumber === 1) {

				//updating values here but the second attempt will
				//actually be invoked from the parent component `SwapWindow`
				//in the `onChange` callback of the recaptcha window after the
				//challenge is completed
				setAttemptNumber(2);

			} else
				resetUserInputs();
		}
	}, [attemptNumber, destAddr, isValidDestinationAddress, handleTransactionSubmission,
		resetUserInputs, mounted, setDisclaimerAgreed, setMounted
	]);

	const renderValidationErrors = useCallback(() => {
		if (!sourceChainSelection)
			return <ValidationErrorWidget text={`Select a source chain.`}/>
		if (!selectedSourceAsset)
			return <ValidationErrorWidget text={`Select an asset on the source chain.`}/>
		if (!destChainSelection)
			return <ValidationErrorWidget text={`Select a destination chain.`}/>
		if (sourceChainSelection.chainName === destChainSelection.chainName)
			return <ValidationErrorWidget text={`Source and destination chains can't be equal.`}/>
		if (!isValidDestinationAddress)
			return <ValidationErrorWidget text={`Invalid input address for ${destChainSelection.chainName}.`}/>
	}, [sourceChainSelection, destChainSelection, selectedSourceAsset, isValidDestinationAddress]);

	const enableSubmitBtn = sourceChainSelection && destChainSelection
		&& sourceChainSelection.chainName !== destChainSelection.chainName
		&& selectedSourceAsset
		&& isValidDestinationAddress;

	const handleOnEnterPress = (e: KeyboardEvent<HTMLInputElement>) => {
		e.stopPropagation();
		(e.code === "Enter" || e.code === "NumpadEnter")
		&& enableSubmitBtn
		&& onInitiateTransfer();
	}

	const getDestinationAddressFromWallet = async (e: ChangeEvent<HTMLInputElement>, destinationChain: ChainInfo) => {
		let wallet: WalletInterface;
		const isEvm: boolean = (destinationChain.module === "evm");
		wallet = isEvm
			? new MetaMaskWallet(destinationChain.chainName.toLowerCase())
			: new KeplrWallet(destinationChain.chainName.toLowerCase() === "terra"
				? "terra"
				: "axelar"
			);
		if (!wallet.isWalletInstalled() || !isEvm)
			await wallet.connectToWallet();
		wallet.isWalletInstalled() && setDestAddr(await wallet.getAddress());
	}

	/*closeAllSearchWindows is a method inside ChainSelector children called
	to programmatically close the asset search windows, i.e. when TopFlowsSelectorWidget is made */
	const closeAllSearchWindows = () => {
		(srcChainComponentRef?.current as any)?.closeAllSearchWindows();
		(destChainComponentRef?.current as any)?.closeAllSearchWindows();
	}

	return <StyledUserInputWindow>
		<br/>
		<br/>
		<TopFlowsSelectorWidget closeAllSearchWindows={closeAllSearchWindows}/>
		<StyledChainSelectorSection className={"joyride-chain-selector"}>
			<ChainSelector ref={srcChainComponentRef} id={SOURCE_TOKEN_KEY} label={"Source Chain"}
			               closeOtherWindow={() => (destChainComponentRef?.current as any)?.closeAllSearchWindows()}/>
			<div><SwapChains/></div>
			<ChainSelector ref={destChainComponentRef} id={DESTINATION_TOKEN_KEY} label={"Destination Chain"}
			               closeOtherWindow={() => (srcChainComponentRef?.current as any)?.closeAllSearchWindows()}/>
			<br/>
			<TransactionInfo/>
			<StyledInputFormSection>
				<InputForm
					name={"destination-address-input"}
					value={destAddr || ""}
					placeholder={"Enter Destination Address"}
					type={"text"}
					handleOnEnterPress={handleOnEnterPress}
					onChange={(e: any) => setDestAddr(e.target.value)}
				/>
				{destChainSelection &&
                <div
                    style={{
						width: `100%`,
	                    height: `100%`,
						color: `#898994`,
						marginTop: `0.5em`,
	                    textAlign: `right`,
						fontSize: `0.8em`,
	                    display: `flex`,
	                    justifyContent: `flex-end`,
	                    alignItems: `flex-start`
					}}
                >
                    <span>Autofill Destination Address (optional)</span>
                    <StyledSVGImage
                        onClick={(e: ChangeEvent<HTMLInputElement>) => getDestinationAddressFromWallet(e, destChainSelection as ChainInfo)}
                        height={`1.25em`}
                        width={`1.25em`}
                        margin={`0em 0.75em 0em 0.5em`}
                        src={destChainSelection.module === "axelarnet"
	                        ? require(`resources/keplr.svg`).default
	                        : require(`resources/metamask.svg`).default
                        }
                    />
                </div>
				}

			</StyledInputFormSection>
		</StyledChainSelectorSection>
		{showValidationErrors && renderValidationErrors()}
		<StyledButtonContainer className={"joyride-input-button"}>
			<PlainButton
				dim={!enableSubmitBtn}
				onClick={() => enableSubmitBtn && onInitiateTransfer()}
				onMouseEnter={() => !enableSubmitBtn && setShowValidationErrors(true)}
				onMouseLeave={() => setShowValidationErrors(false)}
			>
				Initiate Asset Transfer
			</PlainButton>
		</StyledButtonContainer>

	</StyledUserInputWindow>;
}

export default UserInputWindow;