import React, {useState}                                 from "react";
import {useRecoilState, useRecoilValue}                  from "recoil";
import styled, {ThemedStyledProps}                       from "styled-components";
import {IAssetInfo, validateDestinationAddress}          from "@axelar-network/axelarjs-sdk";
import svg                                               from "assets/transfer-modal-light-mode.svg";
import dividerSvg from "assets/group.svg";
import ChainSelector                                     from "component/CompositeComponents/ChainSelector";
import {InputForm}                                       from "component/CompositeComponents/InputForm";
import {FlexColumn}                                      from "component/StyleComponents/FlexColumn";
import {GridDisplay}                                     from "component/StyleComponents/GridDisplay";
import DelayedRender                                     from "component/Widgets/DelayedRender";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}         from "config/consts";
import {ChainSelection, DestinationAddress, SourceAsset} from "state/ChainSelection";
import {ChainList}                                       from "state/ChainList";
import {StyledAppContainer}                              from "view/App/styles/StyledAppContainer";
import "../todelete.css";

interface IUserInputWindowProps {
	handleSwapSubmit: any;
}

interface IStyledButtonProps extends ThemedStyledProps<any, any> {
	dim?: boolean;
}

{/*{sourceChainSelection && sourceChainSelection?.assets && sourceChainSelection?.assets?.length > 1 &&*/}
{/*<FlexRow>*/}
{/*    <AssetSelector*/}
{/*        selectedToken={sourceChainAsset}*/}
{/*        allTokens={chainList?.find(chain => chain?.chainName === sourceChainSelection?.chainName)?.assets || []}*/}
{/*        handleChange={(asset) => setSourceChainAsset(asset)}*/}
{/*    />*/}
{/*</FlexRow>*/}
{/*}*/}

const Button = styled.button<IStyledButtonProps>`
	width: 100%;
	height: 35px;
	border-radius: 8px;
	border: none !important;
	box-shadow: 0 0 3px 0 rgba(11, 11, 12, 0.38);
	background-color: ${props => props.dim ? "grey" : "#0b0b0f"};
	color: white;
`;

interface IStyledTransferFeeDividerProps extends ThemedStyledProps<any, any> {
	nextState?: boolean;
}

const StyledTransferFeeDivider = styled.div<IStyledTransferFeeDividerProps>`
	position: absolute;
	width: 333px;
	height: 30px;
	bottom: ${props => props.nextState ? `90px` : `190px` };
	margin-top: ${props => props.nextState ? `10px` : `0px` };
    transition: bottom 500ms;
`;

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
		<StyledTransferFeeDivider nextState={isSubmitting}>
			<div style={{
				backgroundImage: `url(${dividerSvg})`, backgroundRepeat: `no-repeat`, backgroundSize: `cover`,
				right: `0`,
				top: `5px`,
				fontSize: `11px`,
				fontWeight: `bold`,
				height: `21px`,
				width: `98%`,
				textAlign: `right`
			}}>
				Transfer fee
			</div>
		</StyledTransferFeeDivider>
		{<div className={isSubmitting ? "no-visibility" : "testsss"}>
			<br/>
			<ChainSelector id={DESTINATION_TOKEN_KEY} label={"Destination Chain"}/>
			<br/>
			<br/>
			<FlexColumn>
				<br/>
				<InputForm/>
				<br/>
				<Button
					dim={!destAddr}
					onClick={() => {
						const destToken: IAssetInfo = {
							assetAddress: destAddr as string,
							assetSymbol: destChainSelection?.chainSymbol
						}
						const validAddr: boolean = validateDestinationAddress(destChainSelection?.chainSymbol as string, destToken);
						setIsValidDestinationAddress(validAddr);
						validAddr && setIsSubmitting(validAddr)
						validAddr && handleSwapSubmit();
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
				</Button>
			</FlexColumn>
		</div>}
	</>;
}

export default UserInputWindow;

