import Container from "./Container";
import styled from "styled-components";
import wrappedSvg from "react-inlinesvg";
import logo from "assets/axelar_logo.svg";

const StyledContainer = styled(Container)`
	position: fixed;
	width: 100%;
	height: 80px;
	background-color: darkgrey;
	overflow: hidden;
	top: 0;
`

const StyledSVG = styled(wrappedSvg)`
	width: 150px;
	height: 40px;
	margin: 20px;
`;

const PageHeader = () => {
	return (
		<StyledContainer>
			<StyledSVG src={logo}/>
		</StyledContainer>
	);
}

export default PageHeader;