import Container  from "../StyleComponents/Container";
import styled     from "styled-components";
import {SVGImage} from "../Widgets/SVGImage";

const StyledPageHeader = styled(Container)`
	position: fixed;
	top: 0;
	width: 100%;
	height: 40px;
	box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.21);
	background-color: ${props => props.theme.headerBackgroundColor};
	z-index: 1000;
`

const PageHeader = () => {
	return (
		<StyledPageHeader>
			<SVGImage src={require(`resources/axelar-logo-horizontal-white.svg`)?.default} height={"30px"}
			          width={"125px"}
			          margin={"4px"}/>
		</StyledPageHeader>
	);
}

export default PageHeader;