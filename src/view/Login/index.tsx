import React, {useRef}  from "react";
import {useRecoilState} from "recoil";
import {Redirect}       from "react-router-dom";
import styled           from "styled-components";
import {slamKeyframe}   from "component/StyleComponents/animations/slamKeyframe";
import {StyledButton}   from "component/StyleComponents/StyledButton";
import usePasswordInput from "hooks/usePasswordInput";
import backgroundImage  from "resources/globe.svg";
import {IsLoggedIn}     from "state/ApplicationStatus";
import disintegrate     from "./animation";

const StyledLoginPage = styled.div`
	width: 100vw;
	height: 100vh;
	position: relative;
	display: flex;
	flex-direction: row;
	background: white !important;
`;

const StyledLoginSection = styled.div`
	height: 100%;
	width: 60%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
`;

const LeftStyledLoginSection = styled(StyledLoginSection)`
	background-image: linear-gradient(to right, lightgrey, white);
	width: 40%;
`;

const StyledImage = styled.img`
	height: auto;
	width: 90%;
	object-fit: cover;
`;

const SlaminDiv = styled(StyledImage)`
    animation: ${slamKeyframe} 1000ms ease-in;
    display: block;
    font-size: 6em;
    font-weight: 600;
    margin-left: 20px;
`;

const Login = () => {

	const imageRef = useRef(null);
	const [isLoggedIn, setIsLoggedIn] = useRecoilState(IsLoggedIn);
	const onClick = () => {
		if (!(userPassword === process.env.REACT_APP_LOGIN_PASSWORD))
			return;
		disintegrate(imageRef.current)
		.then(() => setTimeout(() => setIsLoggedIn(true), 1000));
	}
	const [userPassword, passwordComponent] = usePasswordInput({ handleOnEnterPress: onClick});


	return <>{isLoggedIn
		? <Redirect to={"/"}/>
		: <StyledLoginPage>
			<LeftStyledLoginSection>
				<SlaminDiv src={require("resources/axelar-logo-horizontal-white.svg").default}/>
				<br/>
				{React.cloneElement(passwordComponent, { handleOnEnterPress: onClick })}
				<br/>
				<div style={{width: `50%`}}>
					<StyledButton onClick={onClick}>Enter</StyledButton>
				</div>
			</LeftStyledLoginSection>
			<StyledLoginSection>
				<StyledImage ref={imageRef} src={backgroundImage}/>
			</StyledLoginSection>
		</StyledLoginPage>
	}</>;
}

export default Login;