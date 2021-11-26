import {useRecoilValue}                           from "recoil";
import {SourceDepositAddress, TransactionTraceId} from "state/TransactionStatus";
import styled                                     from "styled-components";
import Tooltip                                    from "../../component/Widgets/Tooltip";
import CopyToClipboard                            from "../../component/Widgets/CopyToClipboard";
import BoldSpan                                   from "../../component/StyleComponents/BoldSpan";

const StyledFAQPage = styled.div`
	background-color: #D1D1D1;
	color: black;
	width: 50vw;
	height: 60vh;
	box-sizing: border-box;
	border: 10px solid darkgrey;
	padding: 1em;
	border-radius: 10px;

`;

const FAQPage = () => {
	const transactionTraceId = useRecoilValue(TransactionTraceId);
	const depositAddress = useRecoilValue(SourceDepositAddress);

	return <StyledFAQPage>
		<h1>Frequently Asked Questions</h1>
		<div>TBU</div>
		<h1>Having issues?</h1>
		<div>Reach out to us on Discord and reference the following info:</div>
		<br />

		<Tooltip
			anchorContent={<CopyToClipboard
				JSXToShow={<>
					<div>TraceID - <BoldSpan>{transactionTraceId}</BoldSpan></div>
					<div>{depositAddress ? "Deposit Address - " + <BoldSpan>depositAddress.assetAddress</BoldSpan> : null}</div>
				</>}
				height={`12px`}
				width={`10px`}
				textToCopy={JSON.stringify({ transactionTraceId: transactionTraceId, ...(depositAddress) })}
				showImage={false}
			/>}
			tooltipText={(transactionTraceId && depositAddress ? "Copy both to Clipboard" : "Copy to Clipboard")}
			tooltipAltText={"Copied to Clipboard!"}
		/>
	</StyledFAQPage>;
}

export default FAQPage;