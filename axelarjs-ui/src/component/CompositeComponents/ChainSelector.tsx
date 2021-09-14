import React, {useState} from "react";
import {ISupportedChainType, SupportedChains} from "@axelar-network/axelarjs-sdk";
import {SVGImage} from "component/SVGImage";
import DropdownComponent, {IDropdownOption} from "component/DropdownComponent";
import Container from "component/Container";
import styled from "styled-components";

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
				margin={"5px"}
			/>
		: null;
	return <Container width={"60px"} height={"60px"}>
		{image}
	</Container>
}


const StyledChainSelector = styled(Container)`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin-top: 20px;
`;

interface IChainSelectorProps {
	id: string;
}

const ChainSelector = (props: IChainSelectorProps) => {

	const [selectedChain, setSelectedChain] = useState<ISupportedChainType | null>(null);

	const dropdownOptions: IDropdownOption[] = SupportedChains
		.map((supportedChain: ISupportedChainType) => ({
			title: supportedChain.name,
			active: false,
			action: (param: IDropdownOption) => setSelectedChain(supportedChain)
		}));

	return <StyledChainSelector width="100px">
		<SelectedChainComponent chainInfo={selectedChain}/>
		{<DropdownComponent id={"dropdown-for-" + props.id} dropdownOptions={dropdownOptions}/>}
	</StyledChainSelector>

}

export default ChainSelector;