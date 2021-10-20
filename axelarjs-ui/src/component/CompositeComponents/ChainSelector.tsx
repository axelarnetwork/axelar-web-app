import React                                           from "react";
import {ISupportedChainType, SupportedChains}          from "@axelar-network/axelarjs-sdk";
import {SVGImage}                                      from "component/Widgets/SVGImage";
import DropdownComponent, {IDropdownOption}            from "component/Widgets/DropdownComponent";
import Container                                       from "component/StyleComponents/Container";
import styled                                          from "styled-components";
import {useRecoilState, useResetRecoilState}           from "recoil";
import {ChainSelection, SOURCE_TOKEN_KEY, SourceAsset} from "state/ChainSelection";

interface IChainComponentProps {
	chainInfo: ISupportedChainType | null
}

const SelectedChainComponent = (props: IChainComponentProps) => {

	const chainId: string | undefined = props.chainInfo?.symbol;
	const image = chainId
		? <SVGImage
			src={require(`assets/logos/${props.chainInfo?.symbol}.svg`)?.default}
			height={"50px"}
			width={"50px"}
			margin={"15px"}
		/>
		: null;
	return <Container width={"80px"} height={"80px"} margin={"0px"}>
		{image}
	</Container>
}


const StyledChainSelector = styled(Container)`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

interface IChainSelectorProps {
	id: string;
	label: string;
}

const ChainSelector = (props: IChainSelectorProps) => {

	const [selectedChain, setSelectedChain] = useRecoilState<ISupportedChainType | null>(ChainSelection(props.id));
	const [sourceAsset, setSourceAsset] = useRecoilState(SourceAsset);
	const resetSourceAsset = useResetRecoilState(SourceAsset);

	const dropdownOptions: IDropdownOption[] = SupportedChains
	.map((supportedChain: ISupportedChainType) => ({
		title: supportedChain.name,
		active: false,
		action: (param: IDropdownOption) => {
			setSelectedChain(supportedChain);

			/*
			if the selected chain is the source token and the chain only
			has a single asset, select that asset
			* */
			if (props.id === SOURCE_TOKEN_KEY) {
				supportedChain?.assets?.length === 1
					? setSourceAsset(supportedChain.assets[0])
					: !sourceAsset && resetSourceAsset();
			}
		}
	}));

	return <StyledChainSelector width="150px">
		{props.label}
		<SelectedChainComponent chainInfo={selectedChain}/>
		{<DropdownComponent id={"dropdown-for-" + props.id} dropdownOptions={dropdownOptions}/>}
	</StyledChainSelector>

}

export default ChainSelector;