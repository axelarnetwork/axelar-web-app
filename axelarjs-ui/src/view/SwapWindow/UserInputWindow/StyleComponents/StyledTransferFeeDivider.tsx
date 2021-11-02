import styled, {ThemedStyledProps} from "styled-components";

interface IStyledTransferFeeDividerProps extends ThemedStyledProps<any, any> {
	nextState?: boolean;
}

export const StyledTransferFeeDivider = styled.div<IStyledTransferFeeDividerProps>`
	position: absolute;
	width: 333px;
	height: 30px;
	bottom: ${props => props.nextState ? `60px` : `190px` };
	margin-top: ${props => props.nextState ? `10px` : `0px` };
    transition: bottom 500ms;
`;