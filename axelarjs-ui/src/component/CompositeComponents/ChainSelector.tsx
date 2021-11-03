import React                                                                    from "react";
import {useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState} from "recoil";
import styled, {ThemedStyledProps}                                              from "styled-components";
import {IChainInfo}                                                             from "@axelar-network/axelarjs-sdk";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}                                from "config/consts";
import {SVGImage}                                                               from "component/Widgets/SVGImage";
import DropdownComponent, {IDropdownOption}                                     from "component/Widgets/DropdownComponent";
import {ChainSelection, SourceAsset}                                            from "state/ChainSelection";
import {ChainList}                                                              from "state/ChainList";
import {FlexRow}                                                                from "../StyleComponents/FlexRow";

const StyledSelectedChainComponent = styled.div`
	width: 125px;
	height: 30px;
	display: fiex;
	align-items: center;
	justify-content: space-between;
	margin-left: 10px;
	font-weight: bold;
`;
interface IChainComponentProps {
	chainInfo: IChainInfo | null
}

const SelectedChainComponent = (props: IChainComponentProps) => {

	const chainId: string | undefined = props.chainInfo?.chainSymbol;
	const image = chainId
		? <SVGImage height={"25px"} width={"25px"}
		            src={require(`assets/logos/${props.chainInfo?.chainSymbol}.svg`)?.default}
		/>
		: <SVGImage height={"20px"} width={"20px"} margin={"2.5px"}
		            src={require(`assets/select-chain-icon-black.svg`)?.default}
		/>;
	return <StyledSelectedChainComponent>
		{image}
		<div style={{width: `90px`, marginLeft: `5px`}}>{props.chainInfo?.chainName || "Select Chain"}</div>
	</StyledSelectedChainComponent>
}
interface IStyledChainSelectorProps extends ThemedStyledProps<any, any> {
	animate: boolean;
}

const StyledChainSelectionComponent = styled(FlexRow)<IStyledChainSelectorProps>`
	border-radius: 8px;
	box-shadow: inset 0 0 3px 0 rgba(0, 0, 0, 0.21);
	border: solid 1px #e2e1e2;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    transition: height 500ms;
    height: ${props => props.animate ? "90%" : "70px"};
`;

const StyledChainSelectionIconWidget = styled.div`
	position: relative;
	display: flex;
	justify-content: space-between;
	flex-direction: row;
	align-items: center;
	width: 50%;
`;

interface IChainSelectorProps {
	id: string;
	label: string;
	animate?: boolean;
	hideContents?: boolean;
}

const ChainSelector = (props: IChainSelectorProps) => {

	const isSourceChain: boolean = props.id === SOURCE_TOKEN_KEY;
	const [selectedChain, setSelectedChain] = useRecoilState<IChainInfo | null>(ChainSelection(props.id));
	const sourceChain = useRecoilValue<IChainInfo | null>(ChainSelection(SOURCE_TOKEN_KEY));
	const destinationChain = useRecoilValue<IChainInfo | null>(ChainSelection(DESTINATION_TOKEN_KEY));
	const chainList = useRecoilValue(ChainList);
	const setSourceAsset = useSetRecoilState(SourceAsset);
	const resetSourceAsset = useResetRecoilState(SourceAsset);

	const dropdownOptions: IDropdownOption[] = chainList
	.map((supportedChain: IChainInfo) => ({
		title: supportedChain.chainName,
		symbol: supportedChain.chainSymbol,
		active: false,
		disabled: (isSourceChain ? destinationChain : sourceChain)?.chainName === supportedChain.chainName,
		action: (param: IDropdownOption) => {
			setSelectedChain(supportedChain);

			/* if the selected chain is the source token and the chain only
			has a single asset, select that asset */
			if (isSourceChain) {
				supportedChain?.assets?.length === 1
					? setSourceAsset(supportedChain.assets[0])
					: resetSourceAsset();
			}
		}
	}));

	return <StyledChainSelectionComponent animate={props.animate}> {
		!props.hideContents && <>
            <div style={{marginLeft: `10px`, marginBottom: `10px`}}>{props.label}</div>
            <StyledChainSelectionIconWidget>
                <SelectedChainComponent chainInfo={selectedChain}/>
				{<DropdownComponent
					id={"dropdown-for-" + props.id}
					dropdownOptions={dropdownOptions}
				/>}
            </StyledChainSelectionIconWidget>
		</>
	} </StyledChainSelectionComponent>

}

export default ChainSelector;