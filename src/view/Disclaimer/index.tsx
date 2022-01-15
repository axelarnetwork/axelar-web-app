import {useState}                          from "react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import styled, {ThemedStyledProps}         from "styled-components";
import {DisclaimerAgreed}                  from "state/ApplicationStatus";
import textLines           from "./disclaimerText";
import {StyledCentered}    from "component/StyleComponents/Centered";
import {StyledButton}      from "component/StyleComponents/StyledButton";

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
	const isDisclaimerAgreed = useRecoilValue(DisclaimerAgreed);
	const [isSmallView, setIsSmallView] = useState(true);

	return isDisclaimerAgreed
		? null
		: isSmallView
			? <SmallDisclaimer setViewBigger={() => setIsSmallView(false)}/>
			: <LargeDisclaimer />;

}

const StyledSmallDisclaimer = styled.div`
	position: absolute;
	bottom: 5em;
	left: 2em;
	z-index: 10000;
	width: 400px;
	background: rgba(255,255,255,0.97);
	box-sizing: border-box;
	padding: 2em;
	font-size: 0.9em;
	box-shadow: 5px 0px 10.0px hsl(0deg 0% 0% / 0.39);
	border-radius: 10px;
`;
const SmallDisclaimer = ({setViewBigger}: {setViewBigger: () => void;}) => {
	const setDisclaimerAgreed = useSetRecoilState(DisclaimerAgreed);
	return <Mask>
		<StyledSmallDisclaimer>
			<div>
				Satellite is in Beta. Use at your own risk and with funds you're comfortable using on this site.
			</div>
			<br/>
			<div>
				<span style={{ cursor: `pointer`, color: `blue` }} onClick={setViewBigger}>Click here{" "}</span>
				for full disclosure and Terms of Use.
			</div>
			<br/>
			<DisclaimerAgreeButton checked={true} setDisclaimerAgreed={setDisclaimerAgreed} text={"Ok, agreed"} />
		</StyledSmallDisclaimer>
	</Mask>;
}

export const LargeDisclaimer = () => {
	const setDisclaimerAgreed = useSetRecoilState(DisclaimerAgreed);
	const [checked, setChecked] = useState(false);
	const handleChange = () => setChecked(!checked);

	return <Mask centered={true}>
		<StyledLargeDisclaimerPage>
			<h1>Terms of Use</h1>
			<TextSection>
				{textLines.map((text: string) => <Text>{text}</Text>)}
			</TextSection>
			<label>
				<input
					type="checkbox"
					checked={checked}
					onChange={handleChange}
				/>
				{" "}I understand the risks and agree to the terms.
			</label>
			<br/>
			<DisclaimerAgreeButton checked={checked} setDisclaimerAgreed={setDisclaimerAgreed} text={"Enter"}/>

		</StyledLargeDisclaimerPage>
	</Mask>;
}

const DisclaimerAgreeButton = ({ checked, setDisclaimerAgreed, text}: { checked: boolean; setDisclaimerAgreed: (agreed: boolean) => void; text: string; }) => (
	<StyledButton
		dim={!checked}
		disabled={!checked}
		onClick={() => setDisclaimerAgreed(true)}
	>
		{text}
	</StyledButton>
)

export default Disclaimer;