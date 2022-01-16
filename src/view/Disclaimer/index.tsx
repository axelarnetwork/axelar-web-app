import {useState}                              from "react";
import {useRecoilState}                        from "recoil";
import styled, {ThemedStyledProps}             from "styled-components";
import {DisclaimerAgreed, ShowLargeDisclaimer} from "state/ApplicationStatus";
import textLines                               from "./disclaimerText";
import {StyledCentered}                        from "component/StyleComponents/Centered";
import {StyledButton}                          from "component/StyleComponents/StyledButton";

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
	z-index: 10000;
	${props => props.centered ? `${StyledCentered}` : null}
`;

const Disclaimer = () => {
	const [isDisclaimerAgreed, setDisclaimerAgreed] = useRecoilState(DisclaimerAgreed);
	const [showLargeDisclaimer, setShowLargeDisclaimer] = useRecoilState(ShowLargeDisclaimer);
	const [checked, setChecked] = useState(isDisclaimerAgreed);
	const handleChange = () => setChecked(!checked);

	if (!showLargeDisclaimer)
		return null;

	return <Mask centered={true}>
		<StyledLargeDisclaimerPage>
			<h1>Terms of Use</h1>
			<TextSection>
				{textLines.map((text: string) => <Text>{text}</Text>)}
			</TextSection>
			{!isDisclaimerAgreed && <label>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={handleChange}
                />
				{" "}I understand the risks and agree to the terms.
            </label>}
			<br/>
			<DisclaimerAgreeButton
				checked={checked}
				setDisclaimerAgreed={() => {
					setDisclaimerAgreed(true);
					setShowLargeDisclaimer(false);
				}}
				text={!isDisclaimerAgreed ? "Agree & Enter" : "Close"}
			/>

		</StyledLargeDisclaimerPage>
	</Mask>;
}
const StyledTinyDisclaimer = styled.div`
	position: absolute;
	bottom: 0;
	z-index: 10000;
	font-size: smaller;
	background: rgba(255,255,255,0.97);
	box-sizing: border-box;
	padding: 0.25em;
	box-shadow: 2px 0px 5px hsl(0deg 0% 0% / 0.39);
	border-radius: 10px;
`;
export const TinyDisclaimer = () => {

	const [showLargeDisclaimer, setShowLargeDisclaimer] = useRecoilState(ShowLargeDisclaimer);

	return showLargeDisclaimer
		? null
		: <StyledTinyDisclaimer>
			Satellite is in Beta. Use at your own risk with funds you're comfortable using.{" "}
			<span
				style={{cursor: `pointer`, color: `blue`}}
				onClick={() => setShowLargeDisclaimer(true)}
			>
				Click here{" "}
			</span>
			for full Terms of Use, to which you implicitly agree by using this platform.
		</StyledTinyDisclaimer>;
}

const DisclaimerAgreeButton = ({
	                               checked,
	                               setDisclaimerAgreed,
	                               text
                               }: { checked: boolean; setDisclaimerAgreed: (agreed: boolean) => void; text: string; }) => (
	<StyledButton
		dim={!checked}
		disabled={!checked}
		onClick={() => setDisclaimerAgreed(true)}
	>
		{text}
	</StyledButton>
)

export default Disclaimer;