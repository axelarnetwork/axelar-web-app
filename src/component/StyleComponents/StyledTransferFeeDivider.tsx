import styled, {ThemedStyledProps} from "styled-components";

interface IStyledTransferFeeDividerProps extends ThemedStyledProps<any, any> {
	nextState?: boolean;
	showContents?: boolean;
}

export const StyledTransferFeeDivider = styled.div<IStyledTransferFeeDividerProps>`
	position: relative;
	height: auto;
	opacity: ${props => props.showContents ? `1` : `0`};
    ${props => props.showContents ? `transition: opacity 1000ms;` : ``}
`;