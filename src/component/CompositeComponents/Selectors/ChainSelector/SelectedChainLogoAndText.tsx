import {IChainInfo}   from "@axelar-network/axelarjs-sdk";
import {SVGImage}     from "component/Widgets/SVGImage";
import {BaseSelector} from "../BaseSelector";

interface IChainComponentProps {
	chainInfo: IChainInfo | null;
}

export const SelectedChainLogoAndText = (props: IChainComponentProps) => {

	let image;
	try {
		image = require(`resources/logos/${props.chainInfo?.chainSymbol}.svg`)?.default;
	} catch (e) {
		image = require(`resources/select-chain-eye.svg`)?.default;
	}
	return <BaseSelector
		image={<SVGImage height={`1.5em`} width={`1.5em`} src={image}/>}
		label={props.chainInfo?.chainName || "Select Chain"}
	/>;
}