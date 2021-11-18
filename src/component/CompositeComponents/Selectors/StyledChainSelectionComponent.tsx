import styled, {ThemedStyledProps} from "styled-components";
import {FlexRow}                   from "../../StyleComponents/FlexRow";

interface IStyledChainSelectorProps extends ThemedStyledProps<any, any> {
	animate: boolean;
}

export const StyledChainSelectionComponent = styled(FlexRow)<IStyledChainSelectorProps>`
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    box-sizing: border-box;
	border-radius: 10px;
	box-shadow: -2px -2px 4px 0 #fff, 2px 2px 4px 0 rgba(0, 0, 0, 0.16), inset 0 0 1px 1px rgba(0, 0, 0, 0.13);
	border-width: 1.6px;
	border-image-source: linear-gradient(103deg, #cecfd8 2%, #b8b9c7);
	border-image-slice: 1;
	background-origin: border-box;
	background-clip: content-box, border-box;
	padding: 5px 5px 10px 5px;
	white-space: nowrap;
`;