import {useState}                                 from "react";
import {useRecoilValue, useSetRecoilState}        from "recoil";
import {SourceDepositAddress, TransactionTraceId} from "state/TransactionStatus";
import styled                                     from "styled-components";
import Tooltip                                    from "component/Widgets/Tooltip";
import CopyToClipboard                            from "component/Widgets/CopyToClipboard";
import BoldSpan                                   from "component/StyleComponents/BoldSpan";
import {FlexRow}                                  from "component/StyleComponents/FlexRow";
import {SVGImage}                                 from "component/Widgets/SVGImage";
import {DisclaimerAgreed}                         from "state/ApplicationStatus";

const StyledHelperComponent = styled.div`
    position: absolute;
    z-index: 15;
    bottom: 60px;
    right: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 30%;
    min-width: 275px;
    max-width: 500px;
`;

const HelperWidget = styled.div`
	box-sizing: border-box;
	padding: 0.5em 0.75em 0.5em 0.75em;
	margin: 0.5em;
	background-color: ${props => props.theme.headerBackgroundColor};
	border-radius: 50px;
	color: white;
	cursor: pointer;
`;

const StyledFAQPopup = styled.div`
	background-color: rgb(255,255,255,0.9);
	color: ${props => props.theme.headerBackgroundColor};
	box-sizing: border-box;
	border: 2px solid #b9bac8;
	border-radius: 10px;
	overflow-wrap: break-word;
    background-color: white;
    width: 100%;
    font-size: 0.8em;
`;

export const StyledHeader = styled.div`
	position: relative;
	width: 100%;
    background-color: ${props => props.theme.headerBackgroundColor};
    border-radius: 7px 7px 0px 0px;
    color: white;
    text-align: center;
    font-size: large;
    box-sizing: border-box;
    padding: 0.25em;
`;

const FAQSection = styled.div`
    box-sizing: border-box;
    padding: 0.75em;
`;

const ContactUsSection = styled(FAQSection)`
	background-color: #bab9c8;
	padding-bottom: 0.1em;
`;

const FAQPage = () => {
	const transactionTraceId = useRecoilValue(TransactionTraceId);
	const setDisclaimerAgreed = useSetRecoilState(DisclaimerAgreed);
	const depositAddress = useRecoilValue(SourceDepositAddress);
	const [showFAQ, setShowFAQ] = useState(false);

	return <StyledHelperComponent>
		{showFAQ && <StyledFAQPopup>
            <StyledHeader>
                <span>Support</span>
                <div
                    style={{position: `absolute`, right: 8, top: 5, cursor: `pointer`}}
                    onClick={() => setShowFAQ(false)}
                >
                    <img src={require(`resources/close-icon.svg`).default} alt={""}/>
                </div>
            </StyledHeader>
            <FAQSection>
	            <h2>Helpful Links</h2>
	            <NewLink text={"Frequently Asked Questions (TBD)"} />
                <NewLink text={"Instructional Video (TBD)"} />
                <NewLink text={"Medium Instructional Guide (TBD)"} />
                <NewLink text={"Terms of Use"} onClick={() => setDisclaimerAgreed(false)} />
            </FAQSection>
			{transactionTraceId && <ContactUsSection>
                {/*<br/>*/}
                <h2>Issues with a live transaction?</h2>
                {/*<br/>*/}
                <div style={{marginBottom: `5px`}}>Reach out on Discord with:</div>
                <Tooltip
                    anchorContent={<CopyToClipboard
						JSXToShow={<>
							<div>
								<div><BoldSpan>Trace ID</BoldSpan></div>
								{transactionTraceId}
							</div>
							<div>{depositAddress
								? <div style={{marginTop: `10px`}}>
									<div><BoldSpan>Deposit Address:</BoldSpan></div>
									{depositAddress?.assetAddress}
								</div>
								: null}
							</div>
						</>}
						height={`12px`}
						width={`10px`}
						textToCopy={JSON.stringify({transactionTraceId: transactionTraceId, ...(depositAddress)})}
						showImage={false}
					/>}
                    tooltipText={(transactionTraceId && depositAddress ? "Copy both to Clipboard" : "Copy to Clipboard")}
                    tooltipAltText={"Copied to Clipboard!"}
                />
            </ContactUsSection>}
        </StyledFAQPopup>}
		<HelperWidget className={"joyride-faq"} onClick={() => setShowFAQ(!showFAQ)}>
			<FlexRow>
				<img src={require(`resources/active-eye-orange.svg`).default} alt={""}/>
				<div style={{marginLeft: `10px`}}>Support</div>
			</FlexRow>
		</HelperWidget>
	</StyledHelperComponent>;
}

const NewLink = ({text, onClick, link}: {text: string, onClick?: any, link?: string}) => {
	return <FlexRow style={{ justifyContent: `flex-start`, marginBottom: `1em` }}>
		{text}
		{"  "}
		<SVGImage
			onClick={onClick}
			style={{ cursor: `pointer`, marginLeft: `5px` }}
			src={require(`resources/link-new-tab.svg`).default}
			height={`1em`}
			width={`1em`}
		/>
	</FlexRow>
}
export default FAQPage;