import Container from "./Container";
import styled from "styled-components";
import wrappedSvg from "react-inlinesvg";
import logo from "assets/axelar_logo.svg";

const StyledContainer = styled(Container)`
	position: relative;
	width: 100%;
	height: 75px;
	background-color: white;
`

const StyledSVG = styled(wrappedSvg)`
  width: 200px;
  height: 50px;
  margin: 10px;
`;

const PageHeader = () => {
	return (
		<StyledContainer>
			<StyledSVG src={logo} />
		</StyledContainer>
	);
}

export default PageHeader;