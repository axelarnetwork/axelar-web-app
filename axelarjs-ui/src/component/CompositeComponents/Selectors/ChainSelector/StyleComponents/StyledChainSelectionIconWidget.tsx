import styled, {ThemedStyledProps} from "styled-components";

interface IStyledChainSelectionIconWidgetProps extends ThemedStyledProps<any, any> {
	hide: boolean;
}

export const StyledChainSelectionIconWidget = styled.div<IStyledChainSelectionIconWidgetProps>`
	position: relative;
	display: flex;
	flex-direction: row;
	align-items: center;
	width: 50%;
	visibility: ${props => props.hide ? 'hidden' : 'visible'};
	transition: 1000ms;
`;