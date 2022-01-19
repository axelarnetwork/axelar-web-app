import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import styled, {ThemedStyledProps}                         from "styled-components";
import {ShowDisclaimer, ShowLargeDisclaimer}               from "state/ApplicationStatus";
import textLines                                           from "./disclaimerText";
import {StyledCentered}                                    from "component/StyleComponents/Centered";
import {StyledButton}                                      from "component/StyleComponents/StyledButton";

const StyledLargeDisclaimerPage = styled.div`
	width: 80vw;
	height: 80vh;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	background: rgba(255,255,255,0.97);
	box-sizing: border-box;
	padding: 3em;
	font-size: small;
	overflow-y: scroll;
	box-shadow: 3.5px 7.0px 7.0px hsl(0deg 0% 0% / 0.39);
	border-radius: 10px;
	z-index: 10000;
`;

const TextSection = styled.div`
	width: 100%;
	height: 75%;
	margin: 3em 0em 3em 0em;
	overflow-y: scroll;
	box-shadow: 2px 0px 7.0px hsl(0deg 0% 0% / 0.39);
	border-radius: 10px;
	box-sizing: border-box;
	padding: 2em;
`;

const Text = styled.div`
	margin-top: 1em;
`;

export interface IMaskProps extends ThemedStyledProps<any, any> {
	centered: boolean;
}

const Mask = styled.div<IMaskProps>`
	position: absolute;
	width: 100%;
	height: 100%;
	${props => props.centered ? `${StyledCentered}` : null}
`;

const Disclaimer = () => {
	const showLargeDisclaimer = useRecoilValue(ShowLargeDisclaimer);

	return showLargeDisclaimer
		? <LargeDisclaimer/>
		: <TinyDisclaimer/>
}
const LargeDisclaimer = () => {
	const [showLargeDisclaimer, setShowLargeDisclaimer] = useRecoilState(ShowLargeDisclaimer);
	const setShowDisclaimer = useSetRecoilState(ShowDisclaimer);

	if (!showLargeDisclaimer)
		return null;

	return <Mask centered={true}><StyledLargeDisclaimerPage>
		<h1>Terms of Use</h1>
		<TextSection>
			{textLines.map((text: string, key: number) => <Text key={`disclaimer-${key}`}>{text}</Text>)}
		</TextSection>
		<br/>
		<DisclaimerAgreeButton setDisclaimerAgreed={() => {
			setShowLargeDisclaimer(false);
			setShowDisclaimer(false);
		}}
		                       text={"Close"}
		/>

	</StyledLargeDisclaimerPage></Mask>;
}
const StyledTinyDisclaimer = styled.div`
	position: absolute;
	bottom: 40%;
	left: 5%;
	max-width: 20%;
	z-index: 10000;
	background: rgba(255,255,255,0.97);
	box-sizing: border-box;
	padding: 1em;
	box-shadow: 2px 10px 20px hsl(0deg 0% 0% / 0.39);
	border-radius: 10px;
`;
export const TinyDisclaimer = () => {

	const setShowLargeDisclaimer = useSetRecoilState(ShowLargeDisclaimer);
	const showDisclaimer = useRecoilValue(ShowDisclaimer);

	if (!showDisclaimer)
		return null;

	return <StyledTinyDisclaimer>
		Satellite is in Beta. Use at your own risk with funds you're comfortable using.{" "}
		<span
			style={{cursor: `pointer`, color: `blue`}}
			onClick={() => setShowLargeDisclaimer(true)}
		>
				Click here{" "}
			</span>
		for full Terms of Use.
	</StyledTinyDisclaimer>;
}

const DisclaimerAgreeButton = ({
	                               setDisclaimerAgreed,
	                               text
                               }: { setDisclaimerAgreed: (agreed: boolean) => void; text: string; }) => (
	<StyledButton onClick={() => setDisclaimerAgreed(true)}>
		{text}
	</StyledButton>
)

export default Disclaimer;