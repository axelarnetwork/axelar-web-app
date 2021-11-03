import React, {useState}                                 from "react";
import {useRecoilState, useRecoilValue}                  from "recoil";
import {IAssetInfo, validateDestinationAddress}          from "@axelar-network/axelarjs-sdk";
import BoldSpan                                          from "component/StyleComponents/BoldSpan";
import ChainSelector                                     from "component/CompositeComponents/ChainSelector";
import {InputForm}                                       from "component/CompositeComponents/InputForm";
import {FlexColumn}                                      from "component/StyleComponents/FlexColumn";
import {VisibilityToggle}                                from "component/StyleComponents/VisibilityToggle";
import DelayedRender                                     from "component/Widgets/DelayedRender";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}         from "config/consts";
import {ChainSelection, DestinationAddress, SourceAsset} from "state/ChainSelection";
import {ChainList}                                       from "state/ChainList";
import {StyledInitiateTransferButton}                    from "./StyleComponents/StyledInitiateTransferButton";
import {StyledTransferFeeDivider}                        from "./StyleComponents/StyledTransferFeeDivider";
import {StyledDividerSvg}                                from "./StyleComponents/StyledDividerSvg";
import "../todelete.css";

interface IUserInputWindowProps {
	handleSwapSubmit: any;
}

// {/*{sourceChainSelection && sourceChainSelection?.assets && sourceChainSelection?.assets?.length > 1 &&*/}
// {/*<FlexRow>*/}
// {/*    <AssetSelector*/}
// {/*        selectedToken={sourceChainAsset}*/}
// {/*        allTokens={chainList?.find(chain => chain?.chainName === sourceChainSelection?.chainName)?.assets || []}*/}
// {/*        handleChange={(asset) => setSourceChainAsset(asset)}*/}
// {/*    />*/}
// {/*</FlexRow>*/}
// {/*}*/}

const UserInputWindow = ({handleSwapSubmit}: IUserInputWindowProps) => {

	const sourceChainSelection = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const chainList = useRecoilValue(ChainList);
	const destChainSelection = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const destAddr = useRecoilValue(DestinationAddress);
	const [sourceChainAsset, setSourceChainAsset] = useRecoilState(SourceAsset);
	const [isValidDestinationAddress, setIsValidDestinationAddress] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	return <>
		<ChainSelector id={SOURCE_TOKEN_KEY} label={"Source Chain"} animate={isSubmitting} hideContents={isSubmitting}/>
		<StyledTransferFeeDivider showContents={!!sourceChainSelection} nextState={isSubmitting}>
            <StyledDividerSvg>
                <BoldSpan>Fee: </BoldSpan>
                <span>XX% of transferred {sourceChainSelection?.chainSymbol}</span>
            </StyledDividerSvg>
        </StyledTransferFeeDivider>

		<VisibilityToggle shouldHide={isSubmitting}>
			<br/>
			<ChainSelector id={DESTINATION_TOKEN_KEY} label={"Destination Chain"}/>
			<br/>
			<br/>
			<FlexColumn>
				<br/>
				<InputForm/>
				<br/>
				<StyledInitiateTransferButton
					dim={!destAddr}
					onClick={() => {
						const destToken: IAssetInfo = {
							assetAddress: destAddr as string,
							assetSymbol: destChainSelection?.chainSymbol
						}
						const validAddr: boolean = validateDestinationAddress(destChainSelection?.chainSymbol as string, destToken);
						setIsValidDestinationAddress(validAddr);
						if (destAddr && validAddr) {
							setIsSubmitting(validAddr);
							handleSwapSubmit();
						}
					}}
					onAnimationEnd={() => setIsSubmitting(false)}
				>
					{isValidDestinationAddress
						? "Initiate Asset Transfer"
						: <DelayedRender
							prevChild={
								<span>The {destChainSelection?.chainSymbol} address does not look right...</span>}
							newChild={<span>Retry and resubmit here</span>}
							delayBeforeNewChild={3000}
						/>
					}
				</StyledInitiateTransferButton>
			</FlexColumn>
		</VisibilityToggle>
	</>;
}

export default UserInputWindow;

