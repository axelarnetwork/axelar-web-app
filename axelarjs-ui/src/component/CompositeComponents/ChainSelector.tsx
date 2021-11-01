import React                                                                    from "react";
import {useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState} from "recoil";
import styled                                                                   from "styled-components";
import {IChainInfo}                                                             from "@axelar-network/axelarjs-sdk";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}                                from "config/consts";
import {SVGImage}                                                               from "component/Widgets/SVGImage";
import DropdownComponent, {IDropdownOption}                                     from "component/Widgets/DropdownComponent";
import {ChainSelection, SourceAsset}                                            from "state/ChainSelection";
import {ChainList}                                                              from "state/ChainList";
import {FlexRow}                                                                from "../StyleComponents/FlexRow";

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
	return <div style={{
		width: `125px` ,
		height: `30px`,
		display: `flex`,
		alignItems: `center`,
		justifyContent: `space-between`,
		marginLeft: `10px`,
		fontWeight: `bold`
	}}>
		{image} <div style={{ width: `90px`, marginLeft: `5px` }}>{props.chainInfo?.chainName || "Select Chain"}</div>
	</div>
}

const StyledChainSelector = styled(FlexRow)`
	height: 70px;
	border-radius: 8px;
	box-shadow: inset 0 0 3px 0 rgba(0, 0, 0, 0.21);
	border: solid 1px #e2e1e2;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
`;

interface IChainSelectorProps {
	id: string;
	label: string;
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
		active: false,
		disabled: (isSourceChain ? destinationChain : sourceChain)?.chainName === supportedChain.chainName,
		action: (param: IDropdownOption) => {
			setSelectedChain(supportedChain);

			/*
			if the selected chain is the source token and the chain only
			has a single asset, select that asset
			* */
			if (isSourceChain) {
				supportedChain?.assets?.length === 1
					? setSourceAsset(supportedChain.assets[0])
					: resetSourceAsset();
			}
		}
	}));

	return <StyledChainSelector>
		<div style={{ marginLeft: `10px`, marginBottom: `10px` }}>{props.label}</div>
		<div style={{
				display: `flex`,
				justifyContent: `space-between`,
				flexDirection: `row`,
				alignItems: `center`,
				width: `50%`,
				// borderRadius: `8px`,
				// boxShadow: `inset 0 0 3px 0 rgba(0, 0, 0, 0.21)`,
				// border: `solid 1px #e2e1e2`,
				// height: `35px`,
				// marginLeft: `10px`,
				// paddingRight: `5px`
		}}>
			<SelectedChainComponent chainInfo={selectedChain}/>
			<SVGImage
				src={require(`assets/chevron-down-black.svg`)?.default}
				height={"8px"}
				width={"20px"}
			/>
			{<DropdownComponent
				id={"dropdown-for-" + props.id}
				dropdownOptions={dropdownOptions}
			/>}
		</div>
	</StyledChainSelector>

}

export default ChainSelector;