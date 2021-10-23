import React                                                                    from "react";
import {ISupportedChainType, SupportedChains}                                   from "@axelar-network/axelarjs-sdk";
import {SVGImage}                                                               from "component/Widgets/SVGImage";
import DropdownComponent, {IDropdownOption}                                     from "component/Widgets/DropdownComponent";
import Container
                                                                                from "component/StyleComponents/Container";
import styled                                                                   from "styled-components";
import {useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState} from "recoil";
import {ChainSelection, SourceAsset}                                            from "state/ChainSelection";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}                                from "../../config/consts";

interface IChainComponentProps {
	chainInfo: ISupportedChainType | null
}

const SelectedChainComponent = (props: IChainComponentProps) => {

	const chainId: string | undefined = props.chainInfo?.chainSymbol;
	const image = chainId
		? <SVGImage
			src={require(`assets/logos/${props.chainInfo?.chainSymbol}.svg`)?.default}
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

	const isSourceChain: boolean = props.id === SOURCE_TOKEN_KEY;
	const [selectedChain, setSelectedChain] = useRecoilState<ISupportedChainType | null>(ChainSelection(props.id));
	const sourceChain = useRecoilValue<ISupportedChainType | null>(ChainSelection(SOURCE_TOKEN_KEY));
	const destinationChain = useRecoilValue<ISupportedChainType | null>(ChainSelection(DESTINATION_TOKEN_KEY));
	const setSourceAsset = useSetRecoilState(SourceAsset);
	const resetSourceAsset = useResetRecoilState(SourceAsset);

	const dropdownOptions: IDropdownOption[] = SupportedChains
	.map((supportedChain: ISupportedChainType) => ({
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

	return <StyledChainSelector width="150px">
		{props.label}
		<SelectedChainComponent chainInfo={selectedChain}/>
		{<DropdownComponent
			id={"dropdown-for-" + props.id}
			dropdownOptions={dropdownOptions}
		/>}
	</StyledChainSelector>

}

export default ChainSelector;