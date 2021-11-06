import styled           from "styled-components";
import {StyledCentered} from "component/StyleComponents/Centered";
import backgroundImage  from "resources/dummy_background_7.jpg";

export const StyledAppBody = styled.div`
	${StyledCentered}
	position: relative;
	width: 100vw;
	height: 100vh;
	background-image: url(${backgroundImage});
	background-repeat: no-repeat;
	background-size: cover;
`;