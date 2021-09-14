import styled from "styled-components";
import Container from "../../../component/Container";
import {SCREEN_CONFIGS} from "../../../config";

export const StyledContainer = styled(Container)`
	max-width: 60%;
	max-height: 60%;
	padding: 0;
	background-color: darkgrey;
	@media ${SCREEN_CONFIGS.media.mobile} {
		width: 100vw;
		overflow-x: hidden;
	}
`