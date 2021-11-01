import React, {useState}                                 from "react";
import {CSSTransition} from 'react-transition-group';
import {useRecoilState, useRecoilValue}         from "recoil";
import styled, {ThemedStyledProps}              from "styled-components";
import {IAssetInfo, validateDestinationAddress} from "@axelar-network/axelarjs-sdk";
import svg                                               from "assets/transfer-modal-light-mode.svg";
import ChainSelector                                     from "component/CompositeComponents/ChainSelector";
import {InputForm} from "component/CompositeComponents/InputForm";
import {FlexRow}                                         from "component/StyleComponents/FlexRow";
import {FlexColumn}                                      from "component/StyleComponents/FlexColumn";
import {FooterComponent}                                 from "component/StyleComponents/FooterComponent";
import {GridDisplay}                                     from "component/StyleComponents/GridDisplay";
import DelayedRender                                     from "component/Widgets/DelayedRender";
import {SVGImage}  from "component/Widgets/SVGImage";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}         from "config/consts";
import {ChainSelection, DestinationAddress, SourceAsset} from "state/ChainSelection";
import {ChainList}                                       from "state/ChainList";
import {StyledAppContainer}                              from "view/App/styles/StyledAppContainer";
import AssetSelector                                     from "./AssetSelector";
import "../todelete.css";

interface IUserInputWindowProps {
	handleSwapSubmit: any;
}
interface IStyledButtonProps extends ThemedStyledProps<any, any> {
	dim?: boolean;
}
const Button = styled.button<IStyledButtonProps>`
	width: 100%;
	height: 35px;
	border-radius: 8px;
	border: none !important;
	box-shadow: 0 0 3px 0 rgba(11, 11, 12, 0.38);
	background-color: ${props => props.dim ? "grey" : "#0b0b0f" };
	color: white;
`;

const UserInputWindow = ({handleSwapSubmit}: IUserInputWindowProps) => {

	const sourceChainSelection = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const chainList = useRecoilValue(ChainList);
	const destChainSelection = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const destAddr = useRecoilValue(DestinationAddress);
	const [sourceChainAsset, setSourceChainAsset] = useRecoilState(SourceAsset);
	const [isValidDestinationAddress, setIsValidDestinationAddress] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	return <StyledAppContainer
		style={{ backgroundImage: `url(${svg})`, backgroundRepeat: `no-repeat`, backgroundSize: `cover` }}
		height={"480px"}
		width={"483px"}
	>
		<GridDisplay style={{ padding: "100px", height: `100%`, boxSizing: `border-box` }}>
			<ChainSelector id={SOURCE_TOKEN_KEY} label={"Source Chain"}/>
			<br />
			<ChainSelector id={DESTINATION_TOKEN_KEY} label={"Destination Chain"}/>
			<br />
			<div className={"my-node" + (isSubmitting ? " move" : "") }>
				<SVGImage
					src={require(`assets/group.svg`)?.default}
					width={"100%"}
				/>
				<div style={{ position: `absolute`, right: `0`, top: `5px`, fontSize: `11px`, fontWeight: `bold` }}>Transfer fee</div>
			</div>
			<br />
			{/*{sourceChainSelection && sourceChainSelection?.assets && sourceChainSelection?.assets?.length > 1 &&*/}
            {/*<FlexRow>*/}
            {/*    <AssetSelector*/}
            {/*        selectedToken={sourceChainAsset}*/}
            {/*        allTokens={chainList?.find(chain => chain?.chainName === sourceChainSelection?.chainName)?.assets || []}*/}
            {/*        handleChange={(asset) => setSourceChainAsset(asset)}*/}
            {/*    />*/}
            {/*</FlexRow>*/}
			{/*}*/}
			<FlexColumn>
				<br />
				<InputForm />
				<br />
				<Button
					dim={!destAddr}
					onClick={() => {
						const destToken: IAssetInfo = {
							assetAddress: destAddr as string,
							assetSymbol: destChainSelection?.chainSymbol
						}
						const validAddr: boolean = validateDestinationAddress(destChainSelection?.chainSymbol as string, destToken);
						setIsValidDestinationAddress(validAddr);
						setIsSubmitting(validAddr);
						validAddr && handleSwapSubmit();
					}}
					onAnimationEnd={() => setIsSubmitting(false)}
				>
					{isValidDestinationAddress
						? "Initiate Asset Transfer"
						: <DelayedRender
							prevChild={<span>The {destChainSelection?.chainSymbol} address does not look right...</span>}
							newChild={<span>Retry and resubmit here</span>}
							delayBeforeNewChild={3000}
						/>
					}
				</Button>
			</FlexColumn>
		</GridDisplay>
	</StyledAppContainer>;
}

export default UserInputWindow;