import {useRecoilState, useRecoilValue, useSetRecoilState}          from "recoil";
import {SourceDepositAddress, TransactionTraceId}                   from "state/TransactionStatus";
import styled                                                       from "styled-components";
import Tooltip                                                      from "component/Widgets/Tooltip";
import CopyToClipboard                                              from "component/Widgets/CopyToClipboard";
import BoldSpan                                                     from "component/StyleComponents/BoldSpan";
import {FlexRow}                                                    from "component/StyleComponents/FlexRow";
import {SVGImage}                                                   from "component/Widgets/SVGImage";
import configs                                                      from "config/downstreamServices";
import {ShowDisclaimer, ShowDisclaimerFromFAQ, ShowLargeDisclaimer} from "state/ApplicationStatus";
import {ShowSupportWidget, ShowGettingStartedWidget, ShowFAQ}       from "state/FAQWidget";
import {toProperCase}                                               from "utils/toProperCase";
import {QASection}                                                  from "./QA";

const StyledHelperComponent = styled.div`
    position: absolute;
    z-index: 15;
    bottom: 70px;
    right: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 30%;
    min-width: 275px;
    max-width: 500px;
`;

const StyledPopup = styled.div`
	background-color: rgb(255,255,255,0.9);
	color: ${props => props.theme.headerBackgroundColor};
	box-sizing: border-box;
	border: 2px solid #b9bac8;
	border-radius: 10px;
	overflow-wrap: break-word;
    background-color: white;
    width: 100%;
    font-size: 0.9em;
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
    margin-bottom: 1em;
`;

const SupportSection = styled.div`
    box-sizing: border-box;
    padding: 0.75em;
`;

const ContactUsSection = styled(SupportSection)`
	background-color: #bab9c8;
	padding-bottom: 0.1em;
`;

const SupportPage = () => {
	const transactionTraceId = useRecoilValue(TransactionTraceId);
	const setShowDisclaimer = useSetRecoilState(ShowDisclaimer);
	const setShowLargeDisclaimer = useSetRecoilState(ShowLargeDisclaimer);
	const setShowDisclaimerFromFAQ = useSetRecoilState(ShowDisclaimerFromFAQ);
	const depositAddress = useRecoilValue(SourceDepositAddress);
	const [showSupport, setShowSupport] = useRecoilState(ShowSupportWidget);
	const [showGettingStarted, setShowGettingStarted] = useRecoilState(ShowGettingStartedWidget);
	const [showFAQ, setShowFAQ] = useRecoilState(ShowFAQ);

	return <StyledHelperComponent>
		{showFAQ && <StyledPopup>
            <StyledHeader>
                <span>Frequently Asked Questions</span>
                <div
                    style={{position: `absolute`, right: 8, top: 5, cursor: `pointer`}}
                    onClick={() => setShowFAQ(false)}
                >
                    <img src={require(`resources/close-icon.svg`).default} alt={""}/>
                </div>
            </StyledHeader>
			<QASection />
        </StyledPopup>}
		{showGettingStarted && <StyledPopup>
            <StyledHeader>
                <span>Getting Started</span>
                <div
                    style={{position: `absolute`, right: 8, top: 5, cursor: `pointer`}}
                    onClick={() => setShowGettingStarted(false)}
                >
                    <img src={require(`resources/close-icon.svg`).default} alt={""}/>
                </div>
            </StyledHeader>
            <SupportSection>
                <NewLink text={"Instructional Video"}
                         onClick={() => window.open('https://www.youtube.com/watch?v=VsfCJl1A9QI', '_blank')}/>
                <DescriptorText>One of our devs records himself walking through a transaction from start to
                    finish.</DescriptorText>
                <NewLink text={"Medium Instructional Guide"}
                         onClick={() => window.open("https://socialaxl.medium.com/f6480c7ff20c", '_blank')}/>
                <DescriptorText>A step-by-step Medium post with screenshots at each step of the way through a
                    transaction.</DescriptorText>
                <NewLink text={`Token Contracts & Channel IDs (${toProperCase(process.env.REACT_APP_STAGE as string)})`}
                         onClick={() => window.open(configs.tokenContracts[process.env.REACT_APP_STAGE as string], '_blank')}/>
                <DescriptorText>An IMPORTANT document with the token contract addresses for all assets across EVM
                    chains. Also includes our channel ID on Terra. </DescriptorText>
                <NewLink text={`Minimum Transfer Amounts`}
                         onClick={() => window.open(configs.tokenContracts[process.env.REACT_APP_STAGE as string] + "?id=minimum-transfer-amounts", '_blank')}/>
                <DescriptorText>Minimum amounts depend on the selected destination chain. This document lists all of
                    them in a table. </DescriptorText>
                <NewLink text={`Transaction Fees`}
                         onClick={() => window.open(configs.tokenContracts[process.env.REACT_APP_STAGE as string] + "?id=transaction-fees", '_blank')}/>
                <DescriptorText>Note regarding relevant processing fees for any transaction that flows through the
                    network. </DescriptorText>
                <NewLink text={`Axelar Website`}
                         onClick={() => window.open("https://axelar.network", '_blank')}/>
                <DescriptorText>
                    <div>A little more about us.</div>
                </DescriptorText>
            </SupportSection>
        </StyledPopup>}
		{showSupport && <StyledPopup>
            <StyledHeader>
                <span>Support</span>
                <div
                    style={{position: `absolute`, right: 8, top: 5, cursor: `pointer`}}
                    onClick={() => setShowSupport(false)}
                >
                    <img src={require(`resources/close-icon.svg`).default} alt={""}/>
                </div>
            </StyledHeader>
            <SupportSection>
                <NewLink text={"Discord Support Channel"}
                         onClick={() => window.open('https://discord.com/invite/aRZ3Ra6f7D', '_blank')}/>
                <DescriptorText>
                    <div>Join our community and get Satellite support directly in
                        the <BoldSpan>#satellite-bridge-support</BoldSpan> channel.
                    </div>
                </DescriptorText>
                <NewLink text={"Terms of Use"} onClick={() => {
					setShowDisclaimer(true);
					setShowLargeDisclaimer(true);
					setShowDisclaimerFromFAQ(true);
				}}/>
                <DescriptorText>
                    <div>Before using Satellite, you should be comfortable with our Terms of Use.</div>
                </DescriptorText>
            </SupportSection>
			{transactionTraceId && <ContactUsSection>
                <h3>Issues with a live transaction?</h3>
                <div style={{marginBottom: `5px`}}>Reach out on Discord in
                    the <BoldSpan>#satellite-bridge-support</BoldSpan> channel with:
                </div>
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
        </StyledPopup>}

	</StyledHelperComponent>;
}

const StyledText = styled(FlexRow)`
	justify-content: flex-start;
	margin-bottom: 0.25em;
`;
const DescriptorText = styled(StyledText)`
	font-style: italic;
	margin-bottom: 1em;
	color: #898994;
	font-size: 0.9em;
`;

const StyledNewLink = styled(StyledText)`
	cursor: pointer;
	font-weight: bold;
	&:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: underline;
	}
`;
export const NewLink = ({text, onClick, link}: { text: string, onClick?: any, link?: string }) => {
	return <StyledNewLink onClick={onClick}>
		{text}
		{"  "}
		<SVGImage
			style={{marginLeft: `5px`}}
			src={require(`resources/link-new-tab.svg`).default}
			height={`1em`}
			width={`1em`}
		/>
	</StyledNewLink>
}
export default SupportPage;