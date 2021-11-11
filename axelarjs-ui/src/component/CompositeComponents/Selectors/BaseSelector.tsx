import {ReactElement} from "react";
import styled         from "styled-components";

export const StyledBaseSelector = styled.div`
	width: 125px;
	display: fiex;
	align-items: center;
	justify-content: space-between;
	margin-left: 10px;
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
		<div style={{width: `120px`, marginLeft: `5px`, fontSize: `17px`, fontWeight: 900 }}>{props.label}</div>
	</StyledBaseSelector>
}