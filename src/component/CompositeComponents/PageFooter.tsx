import styled    from "styled-components";
import Container from "../StyleComponents/Container";

const StyledPageFooter = styled(Container)`
	position: fixed;
	bottom: 0;
	width: 100%;
	height: 45px;
	box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.21);
	background-image: linear-gradient(92deg, #1b1c1e 2%, #0b0b0c 100%);
	display: flex;
	justify-content: space-between !important;
	align-items: center !important;
	z-index: 10000;
	color: white;
	font-size: 0.6em;
`

const PageFooter = () => {
	return (<StyledPageFooter>
		<div style={{marginLeft: `1em`}}><img src={require(`resources/axelar-logo-horizontal-white.svg`)?.default}
		                                      alt=""/></div>
		<span>This site is protected by reCAPTCHA, and the Google{" "}
			<a href="https://policies.google.com/privacy" style={{color: `lightgrey`}} target={"_blank"}
			   rel="noreferrer">
			    Privacy Policy
		    </a>
			{" "}and{" "}
			<a href="https://policies.google.com/terms" style={{color: `lightgrey`}} target={"_blank"} rel="noreferrer">
			    Terms of Service
		    </a>
			{" "}apply.
		</span>
	</StyledPageFooter>);
}

export default PageFooter;