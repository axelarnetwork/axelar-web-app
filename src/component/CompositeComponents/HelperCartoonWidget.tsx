/*
TODO: the cartoon character isn't used at the moment, but we'll incorporate this shortly
* */
import {useRecoilValue}                                 from "recoil";
import styled, {ThemedStyledProps}                      from "styled-components";
import screenConfigs                                    from "config/screenConfigs";
import {MessageShownInCartoon, ShowHelperCartoonWidget} from "state/ApplicationStatus";
import {fadeIn, fadeInFromLeft}                         from "../StyleComponents/animations/fadeInKeyframe";
import {fadeOutKeyframe}                                from "../StyleComponents/animations/fadeOutKeyframe";

const HelperCartoonWidgetStyles = styled.div`
    position: absolute;
    z-index: 1000;
    width: 350px;
    height: 125px;
    margin: 50px 0px 0px 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: end;
    
    @media ${screenConfigs.media.mobile} {
		display: none;
	}
`;

interface IStyledDivProps extends ThemedStyledProps<any, any> {
	animation?: any;
	animationDuration?: number;
	width: string;
}

const StyledDiv = styled.div<IStyledDivProps>`
	position: relative;
	width: ${props => props.width};
	height: 100%;
	animation: ${props => props?.animation} ${props => props?.animationDuration}s ease-in;
`;

const StyledImage = styled.img`
	width: 100%;
	height: auto;
`;
const StyledTextDiv = styled.div`
	position: absolute;
	box-sizing: border-box;
	padding: 10px 10px 0px 15%;
	height: 75%;
	font-size: 12px;
	animation: ${fadeOutKeyframe} 5s forwards; 
	animation-delay: 30s;
`;
const StyledBubbleImage = styled(StyledImage)`
	position: absolute;
	height: 75%;
`;

const HelperCartoonWidget = () => {
	const showHelperCartoonWidget = useRecoilValue(ShowHelperCartoonWidget);
	const messageInCartoon = useRecoilValue(MessageShownInCartoon);

	if (!showHelperCartoonWidget)
		return null;

	return <HelperCartoonWidgetStyles>
		<StyledDiv animation={fadeInFromLeft} animationDuration={1} width={"30%"}>
			<StyledImage src={require("resources/seated_robot.png").default} alt={""}/>
		</StyledDiv>
		<StyledDiv animation={fadeIn} animationDuration={2} width={"70%"}>
			<StyledBubbleImage src={require("resources/speech-textbox.png").default} alt={""}/>
			<StyledTextDiv>{messageInCartoon}</StyledTextDiv>
		</StyledDiv>
	</HelperCartoonWidgetStyles>
}

export default HelperCartoonWidget;