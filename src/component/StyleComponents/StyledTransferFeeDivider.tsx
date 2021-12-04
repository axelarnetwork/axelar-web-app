import styled, {ThemedStyledProps} from "styled-components";
import screenConfigs               from "config/screenConfigs";

interface IStyledTransferFeeDividerProps extends ThemedStyledProps<any, any> {
	nextState?: boolean;
	showContents?: boolean;
}

export const StyledTransferFeeDivider = styled.div<IStyledTransferFeeDividerProps>`
	position: relative;
	width: 100%;
	height: auto;
	opacity: ${props => props.showContents ? `1` : `0`};
    ${props => props.showContents ? `transition: opacity 1000ms;` : ``}
    
    @media ${screenConfigs.media.desktop} {
        margin-top: 50px;
		font-size: 14px;
	}
    @media ${screenConfigs.media.laptop} {
        margin-top: 30px;
		font-size: 12px;
	}
	@media ${screenConfigs.media.tablet} {
		margin-top: 0px;
		font-size: 10px;
	}
	@media ${screenConfigs.media.mobile} {
		font-size: 10px;
		margin-top: 0px;
	}
`;