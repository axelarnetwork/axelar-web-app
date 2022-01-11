import {useState}          from "react";
import {useSetRecoilState} from "recoil";
import styled              from "styled-components";
import {DisclaimerAgreed}  from "state/ApplicationStatus";
import textLines           from "./disclaimerText";
import {StyledCentered}    from "component/StyleComponents/Centered";
import {StyledButton}      from "component/StyleComponents/StyledButton";

const StyledLoginPage = styled.div`
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

const Mask = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 10000;
	${StyledCentered}
`;

const Disclaimer = () => {

	const setDisclaimerAgreed = useSetRecoilState(DisclaimerAgreed);
	const [checked, setChecked] = useState(false);
	const handleChange = () => setChecked(!checked);

	return <Mask>
		<StyledLoginPage>
			<h1>Before proceeding...</h1>
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
			<StyledButton
				dim={!checked}
				disabled={!checked}
				onClick={() => setDisclaimerAgreed(true)}
			>
				Enter
			</StyledButton>
		</StyledLoginPage>
	</Mask>;
}

export default Disclaimer;