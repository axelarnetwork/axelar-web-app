import styled        from "styled-components";
import screenConfigs from "config/screenConfigs";

export const Input = styled.input.attrs({})`
	width: 100%;
	border-radius: 5px;
	border: solid 1px #e2e1e2;
	padding: 0px 10px 0px 10px !important;
	box-sizing: border-box;
	transition: 0.3s;
	&:focus {
		outline: none !important;
	    border-color: darkgrey;
	    box-shadow: 0 0 8px 0 darkgrey;
	}

	@media ${screenConfigs.media.laptop} {
		font-size: 16px;
		height: 50px;
	}
	@media ${screenConfigs.media.tablet} {
		font-size: 11px;
		height: 35px;
	}
	@media ${screenConfigs.media.mobile} {
		font-size: 11px;
		height: 35px;
	}	
`