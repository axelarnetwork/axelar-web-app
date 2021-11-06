import styled from "styled-components";
import backgroundImage from "resources/jarold-sng-axo-explorer-jsd.png";

const StyledLoginPage = styled.div`
	width: 100vw;
	height: 100vh;
	background-color: #C2BFBD;
	position: relative;
`;

const StyledLoginImage = styled.div`
	height: 100%;
	width: 60%;
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: flex-start;
`;

const StyledImage = styled.img`
	height: 75%;
	width: 50%;
	object-fit: contain;
`;

const Login = () => {

	const onClick = () => {
	}

	return <StyledLoginPage>
		<StyledLoginImage>
			<StyledImage src={backgroundImage}/>
		</StyledLoginImage>
		<div style={{ textAlign: `right` }}>
			<div data-dis-trigger-for="myDisId" onClick={onClick}>Click me</div>
		</div>

	</StyledLoginPage>;
}

export default Login;