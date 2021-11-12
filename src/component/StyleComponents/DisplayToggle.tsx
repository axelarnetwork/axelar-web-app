import styled, {ThemedStyledProps} from "styled-components";

interface IStyledVisibilityToggleProps extends ThemedStyledProps<any, any> {
	shouldHide: boolean;
}

export const DisplayToggle = styled.div<IStyledVisibilityToggleProps>`
	display: ${props => props.shouldHide ? "none" : "initial"};
`;