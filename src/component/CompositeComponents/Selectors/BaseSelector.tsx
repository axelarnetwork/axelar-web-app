import {ReactElement} from "react";
import styled         from "styled-components";

export const StyledBaseSelector = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-left: 5px;
	margin-right: 5px;
	font-weight: bold;
`;

interface IBaseSelectorProps {
	image: ReactElement;
	label: string;
}

export const BaseSelector = (props: IBaseSelectorProps) => {
	return <StyledBaseSelector>
		{props.image}
		<div style={{marginLeft: `10px`}}>{props.label}</div>
	</StyledBaseSelector>
}