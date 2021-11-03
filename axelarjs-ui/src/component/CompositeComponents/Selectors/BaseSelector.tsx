import {StyledSelectedChainComponent} from "./ChainSelector/SelectedChainComponent";
import {ReactElement}                 from "react";

interface IBaseSelectorProps {
	image: ReactElement;
	label: string;
}
export const BaseSelector = (props: IBaseSelectorProps) => {
	return <StyledSelectedChainComponent>
		{props.image}
		<div style={{width: `90px`, marginLeft: `5px`}}>{props.label}</div>
	</StyledSelectedChainComponent>
}