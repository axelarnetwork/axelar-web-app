import styled, {ThemedStyledProps} from "styled-components";
import {FlexRow}                   from "../../../StyleComponents/FlexRow";

interface IStyledChainSelectorProps extends ThemedStyledProps<any, any> {
	animate: boolean;
}

export const StyledChainSelectionComponent = styled(FlexRow)<IStyledChainSelectorProps>`
	border-radius: 8px;
	box-shadow: inset 0 0 3px 0 rgba(0, 0, 0, 0.21);
	border: solid 1px #e2e1e2;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    transition: height 500ms;
    height: ${props => props.animate ? "90%" : "70px"};
`;