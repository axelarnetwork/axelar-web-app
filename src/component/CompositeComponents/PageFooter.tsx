import {useRecoilState}                          from "recoil";
import styled                                    from "styled-components";
import {ShowFAQWidget, ShowGettingStartedWidget} from "state/FAQWidget";
import Container                                 from "../StyleComponents/Container";
import {FlexRow}                                 from "../StyleComponents/FlexRow";

const StyledPageFooter = styled(Container)`
	position: fixed;
	bottom: 0;
	width: 100%;
	height: 55px;
	box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.21);
	display: flex;
	justify-content: space-between !important;
	align-items: center !important;
	z-index: 10000;
	color: black;
	font-size: 1em;
	transition: background-color 0.3s ease-in-out;
	background-color: rgba(0, 0, 0, 0.21);
	&:hover
	{
		color: white;
		background-color: ${props => props.theme.headerBackgroundColor};
	}
`
const HelperWidget = styled.div`
	box-sizing: border-box;
	padding: 0.5em 0.75em 0.5em 0.75em;
	margin: 0.5em;
	border-radius: 50px;
	cursor: pointer;
	border: 1px solid darkgrey;
	transition: background-color color 0.5s ease-in-out;
	${StyledPageFooter}:hover & {
        background: none;
        border: 0.5px solid grey;
    }
    &:hover {
        background-color: ${props => props.theme.headerBackgroundColor} !important;
    }
`;

const LinkText = styled.a`
	color: blue;
	${StyledPageFooter}:hover & {
        color: lightgrey;
    }
`;

const PageFooter = () => {
	const [showFAQ, setShowFAQ] = useRecoilState(ShowFAQWidget);
	const [showGettingStarted, setShowGettingStarted] = useRecoilState(ShowGettingStartedWidget);

	return (<StyledPageFooter>
		<div style={{marginLeft: `1em`, cursor: `pointer`, width: `25%`}}
		     onClick={() => window.open("https://axelar.network", '_blank')}>
			<img src={require(`resources/axelar-logo-horizontal-white.svg`)?.default} alt=""/>
		</div>
		<div style={{fontSize: `0.6em`, width: `50%`, textAlign: "center"}}>This site is protected by reCAPTCHA, and the
			Google{" "}
			<LinkText href="https://policies.google.com/privacy" target={"_blank"}
			          rel="noreferrer">
				Privacy Policy
			</LinkText>
			{" "}and{" "}
			<LinkText href="https://policies.google.com/terms" target={"_blank"} rel="noreferrer">
				Terms of Service
			</LinkText>
			{" "}apply.
		</div>
		<FlexRow style={{width: `25%`, fontSize: `0.9em`, minWidth: `300px`, justifyContent: `flex-end`}}>
			<HelperWidget className={"joyride-faq"} onClick={() => {
				setShowFAQ(false);
				setShowGettingStarted(!showGettingStarted);
			}}>
				<FlexRow style={{marginLeft: `0em`}}>
					<img src={require(`resources/active-eye-orange.svg`).default} alt={""}/>
					<div style={{marginLeft: `0.5em`}}>Getting Started</div>
				</FlexRow>
			</HelperWidget>
			<HelperWidget className={"joyride-faq"} onClick={() => {
				setShowGettingStarted(false);
				setShowFAQ(!showFAQ);
			}}>
				<FlexRow style={{marginLeft: `0em`}}>
					<img src={require(`resources/active-eye-orange.svg`).default} alt={""}/>
					<div style={{marginLeft: `0.5em`}}>Support</div>
				</FlexRow>
			</HelperWidget>
		</FlexRow>
	</StyledPageFooter>);
}

export default PageFooter;