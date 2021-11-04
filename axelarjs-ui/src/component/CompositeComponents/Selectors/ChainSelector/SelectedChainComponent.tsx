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

	let image, dimensions;
	try {
		image = require(`resources/logos/${props.chainInfo?.chainSymbol}/${props.chainInfo?.chainSymbol}.svg`)?.default;
		dimensions = "25px";
	} catch (e) {
		image = require(`resources/select-chain-icon-black.svg`)?.default;
		dimensions = "20px"
	}
	return <BaseSelector
		image={<SVGImage height={dimensions} width={dimensions} src={image} />}
		label={props.chainInfo?.chainName || "Select Chain"}
	/>;
}