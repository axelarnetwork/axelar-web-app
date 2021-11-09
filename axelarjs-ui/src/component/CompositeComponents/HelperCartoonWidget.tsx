import {useRecoilValue}            from "recoil";
import styled, {ThemedStyledProps} from "styled-components";
import {ShowHelperCartoonWidget}   from "state/ApplicationStatus";
import {fadeIn, fadeInFromLeft}    from "../StyleComponents/animations/fadeInKeyframe";

const HelperCartoonWidgetStyles = styled.div`
    position: absolute;
    height: auto;
    z-index: 1000;
    width: 250px;
    margin: 50px 0px 0px 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: end;
`;

interface IStyledDivProps extends ThemedStyledProps<any, any> {
	animation?: any;
	animationDuration?: number;
}

const StyledDiv = styled.div<IStyledDivProps>`
	width: 50%;
	animation: ${props => props?.animation} ${props => props?.animationDuration}s ease-in;
`;

const StyledImage = styled.img`
	width: 100%;
	height: auto;
`;
const StyledTextDiv = styled(StyledDiv)`
	display: flex;
	box-sizing: border-box;
	padding: 20px;
	border-radius: 8px;
	box-shadow: inset 0 0 3px 0 rgba(0, 0, 0, 0.02);
	border: solid 5px #e2e1e2;
	border-style: outset;
	background-color: rgba(255, 255, 255, 1);
	height: 50%;
`;

const HelperCartoonWidget = () => {
	const showHelperCartoonWidget = useRecoilValue(ShowHelperCartoonWidget);

	if (!showHelperCartoonWidget)
		return null;

	return <HelperCartoonWidgetStyles>
		<StyledDiv animation={fadeInFromLeft} animationDuration={1}>
			<StyledImage src={require("resources/seated_robot.png").default} alt={""}/>
		</StyledDiv>
		<StyledTextDiv animation={fadeIn} animationDuration={2}>
			Hello
		</StyledTextDiv>
	</HelperCartoonWidgetStyles>
}

export default HelperCartoonWidget;