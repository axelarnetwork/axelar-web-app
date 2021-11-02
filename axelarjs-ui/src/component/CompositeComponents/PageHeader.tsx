import Container  from "../StyleComponents/Container";
import styled     from "styled-components";
import {SVGImage} from "../Widgets/SVGImage";

const StyledPageHeader = styled(Container)`
	position: fixed;
	z-index: 10;
	top: 0;
	width: 100%;
	height: 40px;
	box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.21);
	background-image: linear-gradient(92deg, #1b1c1e 2%, #0b0b0c 100%);
`

const PageHeader = () => {
	return (
		<StyledPageHeader>
			<SVGImage src={require(`assets/axelar-logo-horizontal-white.svg`)?.default} height={"30px"} width={"125px"}
			          margin={"4px"}/>
		</StyledPageHeader>
	);
}

export default PageHeader;