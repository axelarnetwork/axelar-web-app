import {useRef}         from "react";
import {useRecoilState} from "recoil";
import {Redirect}       from "react-router-dom";
import styled           from "styled-components";
import {slamKeyframe}   from "component/StyleComponents/animations/slamKeyframe";
import {StyledButton}   from "component/StyleComponents/StyledButton";
import usePasswordInput from "hooks/usePasswordInput";
import backgroundImage  from "resources/jarold-sng-axo-explorer-jsd.png";
import {IsLoggedIn}     from "state/ApplicationStatus";
import disintegrate     from "./animation";

const StyledLoginPage = styled.div`
	width: 100vw;
	height: 100vh;
	position: relative;
	display: flex;
	flex-direction: row;
`;

const StyledLoginSection = styled.div`
	height: 100%;
	width: 50%;
	display: flex;
	align-items: flex-start;
	justify-content: center;
	flex-direction: column;
`;

const RightStyledLoginSection = styled(StyledLoginSection)`
	background-image: linear-gradient(to right, white, grey);
`;

const StyledImage = styled.img`
	height: auto;
	width: 65%;
	object-fit: cover;
`;

const SlaminDiv = styled(StyledImage)`
    animation: ${slamKeyframe} 1500ms ease-in;
    display: block;
    font-size: 6em;
    font-weight: 600;
    margin-left: -20px;
`;

const Login = () => {

	const imageRef = useRef(null);
	const [isLoggedIn, setIsLoggedIn] = useRecoilState(IsLoggedIn);
	const [userPassword, passwordComponent] = usePasswordInput();

	const onClick = () => {
		if (!(userPassword === process.env.REACT_APP_LOGIN_PASSWORD))
			return;
		disintegrate(imageRef.current)
		.then(() => setTimeout(() => setIsLoggedIn(true), 2000));
	}

	return <>{isLoggedIn
		? <Redirect to={"/app"}/>
		: <StyledLoginPage>
			<StyledLoginSection>
				<StyledImage ref={imageRef} src={backgroundImage}/>
			</StyledLoginSection>
			<RightStyledLoginSection>
				<SlaminDiv src={require("resources/axelar-logo-horizontal-white.svg").default}/>
				<br/>
				{passwordComponent}
				<br/>
				<div style={{width: `50%`}}>
					<StyledButton onClick={onClick}>Enter</StyledButton>
				</div>
			</RightStyledLoginSection>
		</StyledLoginPage>
	}</>;
}

export default Login;