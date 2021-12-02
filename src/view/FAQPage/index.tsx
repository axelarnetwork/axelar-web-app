import {useRecoilValue}                           from "recoil";
import {SourceDepositAddress, TransactionTraceId} from "state/TransactionStatus";
import styled                                     from "styled-components";
import Tooltip                                    from "component/Widgets/Tooltip";
import CopyToClipboard                            from "component/Widgets/CopyToClipboard";
import BoldSpan                                   from "component/StyleComponents/BoldSpan";
import {FlexRow}                                  from "component/StyleComponents/FlexRow";
import {useState}                                 from "react";

const StyledHelperComponent = styled.div`
    position: absolute;
    z-index: 15;
    bottom: 50px;
    right: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 30%;
    min-width: 275px;
    max-width: 300px;
`;

const HelperWidget = styled.div`
	box-sizing: border-box;
	padding: 0.5em 0.75em 0.5em 0.75em;
	margin: 0.5em;
	background-color: black;
	border-radius: 50px;
	color: white;
	cursor: pointer;
`;

const StyledFAQPopup = styled.div`
	background-color: rgb(255,255,255,0.9);
	color: black;
	box-sizing: border-box;
	border: 2px solid #b9bac8;
	border-radius: 10px;
	overflow-wrap: break-word;
    background-color: white;
    width: 100%;
    font-size: 12px;
`;

const StyledHeader = styled.div`
	position: relative;
	width: 100%;
    background-color: black;
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
	const depositAddress = useRecoilValue(SourceDepositAddress);
	const [showFAQ, setShowFAQ] = useState(false);

	return <StyledHelperComponent>
		{ showFAQ && <StyledFAQPopup>
            <StyledHeader>
                <span>Frequently Asked Questions</span>
                <div
	                style={{ position: `absolute`, right: 8, top: 5, cursor: `pointer` }}
	                onClick={() => setShowFAQ(false)}
                >
	                <img src={require(`resources/close-icon.svg`).default} alt={""} />
                </div>
            </StyledHeader>
            <FAQSection>
                <div><BoldSpan>Question 1?</BoldSpan></div>
                <div>TBU</div>
                <br/>
                <div><BoldSpan>Question 2?</BoldSpan></div>
                <div>TBU</div>
            </FAQSection>
            <ContactUsSection>
                <br/>
                <div><BoldSpan>Having issues with a live transaction?</BoldSpan></div>
                <br/>
                <div style={{ marginBottom: `5px` }}>Reach out to us on Discord, referencing</div>
                <Tooltip
                    anchorContent={<CopyToClipboard
						JSXToShow={<>
							<div>
								<div><BoldSpan>Trace ID:</BoldSpan></div>
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
            </ContactUsSection>
        </StyledFAQPopup>}
		<HelperWidget onClick={() => setShowFAQ(!showFAQ)}>
			<FlexRow>
				<img src={require(`resources/active-eye.svg`).default} alt={""} />
				<div style={{ marginLeft: `10px`}}>Support Center</div>
			</FlexRow>
		</HelperWidget>
	</StyledHelperComponent>;
}

export default FAQPage;