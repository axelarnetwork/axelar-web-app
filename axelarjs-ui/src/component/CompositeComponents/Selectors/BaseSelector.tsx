import {ReactElement} from "react";
import styled         from "styled-components";

export const StyledBaseSelector = styled.div`
	width: 125px;
	height: 30px;
	display: fiex;
	align-items: center;
	justify-content: space-between;
	margin-left: 10px;
	font-weight: bold;
`;

interface IBaseSelectorProps {
	image: ReactElement;
	label: string;
}

export const BaseSelector = (props: IBaseSelectorProps) => {
	return <StyledBaseSelector>
		{props.image}
		<div style={{width: `90px`, marginLeft: `5px`}}>{props.label}</div>
	</StyledBaseSelector>
}