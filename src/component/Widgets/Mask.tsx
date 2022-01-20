import styled, {ThemedStyledProps} from "styled-components";
import {StyledCentered}            from "component/StyleComponents/Centered";

export interface IMaskProps extends ThemedStyledProps<any, any> {
	centered: boolean;
}

export const Mask = styled.div<IMaskProps>`
	position: absolute;
	width: 100%;
	height: 100%;
	${props => props.centered ? `${StyledCentered}` : null}
`;