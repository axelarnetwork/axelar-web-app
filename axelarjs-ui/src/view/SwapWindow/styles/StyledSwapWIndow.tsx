import styled from "styled-components";
import Container from "component/StyleComponents/Container";
import {SCREEN_CONFIGS} from "config";

export const StyledSwapWindow = styled(Container)`
	margin-top: 50px;
	width: 500px;
	// max-width: 60%;
	max-height: 60%;
	padding: 0;
	background-color: black;
	border-radius: 50px;
	@media ${SCREEN_CONFIGS.media.mobile} {
		width: 100vw;
		overflow-x: hidden;
	}
`