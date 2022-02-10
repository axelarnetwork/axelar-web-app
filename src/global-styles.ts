import { createGlobalStyle } from "styled-components"
import backgroundImage from "assets/svg/bg-image.svg"
import { PageOpacityAnimation } from "./components/StyleComponents/animations/PageOpacityAnimation"
import { HideGrecaptchaBadge } from "./components/StyleComponents/HideGrecaptchaBadge"
import screenConfigs from "./config/screenConfigs"

export const GlobalStyle = createGlobalStyle`
	body {
		font-family: ‘Gilroy-ExtraBold’, sans-serif;
		margin: 0 auto;
		padding: 0;
		${HideGrecaptchaBadge}
		${PageOpacityAnimation}
		box-sizing: border-box;
		position: relative;
		line-height: initial;
		background-image: url(${backgroundImage});
		background-repeat: no-repeat;
		background-position: 50% 50%;
		background-attachment: fixed;
		background-size: cover;
    max-width: 100%;
    overflow-x: hidden;

		@media ${screenConfigs.media.desktop} {
			font-size: 20px;
		}
		@media ${screenConfigs.media.laptop} {
			font-size: 18px;
		}
		@media ${screenConfigs.media.tablet} {
			font-size: 16px;
		}
		@media ${screenConfigs.media.mobile} {
			
		}
	}
	
	p {
		margin-block-start: 5px;
    margin-block-end: 5px;
    margin-inline-start: 0;
    margin-inline-end: 0;
	}
	
	button {
		@media ${screenConfigs.media.desktop} {
			font-size: 20px;
		}
		@media ${screenConfigs.media.laptop} {
			font-size: 18px;
		}
		@media ${screenConfigs.media.tablet} {
			font-size: 16px;
		}
		@media ${screenConfigs.media.mobile} {
		}
	}

	code {
	    // font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
	}
`
