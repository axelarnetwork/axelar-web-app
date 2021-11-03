import styled         from "styled-components";
import {IChainInfo}   from "@axelar-network/axelarjs-sdk";
import {SVGImage}     from "component/Widgets/SVGImage";
import {BaseSelector} from "../BaseSelector";

export const StyledSelectedChainComponent = styled.div`
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

export const SelectedChainComponent = (props: IChainComponentProps) => {

	const chainId: string | undefined = props.chainInfo?.chainSymbol;
	const image = chainId
		? <SVGImage height={"25px"} width={"25px"}
		            src={require(`resources/logos/${props.chainInfo?.chainSymbol}/${props.chainInfo?.chainSymbol}.svg`)?.default}
		/>
		: <SVGImage height={"20px"} width={"20px"} margin={"2.5px"}
		            src={require(`resources/select-chain-icon-black.svg`)?.default}
		/>;
	return <BaseSelector
		image={image}
		label={props.chainInfo?.chainName || "Select Chain"}
	/>;
}