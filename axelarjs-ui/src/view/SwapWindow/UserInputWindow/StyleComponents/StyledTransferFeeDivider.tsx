import styled, {ThemedStyledProps} from "styled-components";

interface IStyledTransferFeeDividerProps extends ThemedStyledProps<any, any> {
	nextState?: boolean;
	showContents?: boolean;
}

export const StyledTransferFeeDivider = styled.div<IStyledTransferFeeDividerProps>`
	position: absolute;
	width: 333px;
	height: 50px;
	bottom: ${props => props.nextState ? `60px` : `190px`};
	margin-top: ${props => props.nextState ? `10px` : `0px`};
	opacity: ${props => props.showContents ? `1` : `0`};
    ${props => props.showContents ? `transition: bottom 500ms, opacity 1000ms;` : ``}
`;