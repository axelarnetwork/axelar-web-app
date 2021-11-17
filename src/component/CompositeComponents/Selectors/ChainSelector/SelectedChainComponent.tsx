import {IChainInfo}   from "@axelar-network/axelarjs-sdk";
import {SVGImage}     from "component/Widgets/SVGImage";
import {BaseSelector} from "../BaseSelector";

interface IChainComponentProps {
	chainInfo: IChainInfo | null
}

export const SelectedChainComponent = (props: IChainComponentProps) => {

	let image, dimensions;
	try {
		image = require(`resources/logos/${props.chainInfo?.chainSymbol}/${props.chainInfo?.chainSymbol}.svg`)?.default;
	} catch (e) {
		image = require(`resources/select-chain-icon-black.svg`)?.default;
	}
	return <BaseSelector
		image={<SVGImage height={dimensions} width={`20px`} src={image}/>}
		label={props.chainInfo?.chainName || "Add Chain"}
	/>;
}