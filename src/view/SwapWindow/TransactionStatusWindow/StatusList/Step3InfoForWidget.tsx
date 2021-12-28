import {useRecoilValue}                          from "recoil";
import styled                                    from "styled-components";
import BigNumber                                 from "decimal.js";
import BoldSpan                                  from "component/StyleComponents/BoldSpan";
import {SVGImage}                                from "component/Widgets/SVGImage";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY} from "config/consts";
import {ChainSelection, SourceAsset}             from "state/ChainSelection";
import {NumberConfirmations}                     from "state/TransactionStatus";

export const StyledHeader = styled.div`
	position: relative;
	width: 100%;
    background-color: black;
    border-radius: 9px 9px 0px 0px;
    color: white;
    font-size: .8em;
    text-align: center;
    box-sizing: border-box;
    padding: 0.25em;
`;

const Step3InfoForWidget = () => {

	const sourceAsset = useRecoilValue(SourceAsset);
	const sourceNumConfirmations = useRecoilValue(NumberConfirmations(SOURCE_TOKEN_KEY));
	const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const destChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));

	const amountConfirmedAtomicUnits: number = parseFloat((sourceNumConfirmations.amountConfirmedString || "")
	.replace(/[^\d.]*/g, ''));
	const amountConfirmedAdjusted: number = amountConfirmedAtomicUnits
		* BigNumber.pow(10, (-1 * (sourceAsset?.decimals || 1))).toNumber();
	const afterFees: number = new BigNumber(1).minus(new BigNumber(sourceChain?.txFeeInPercent || 0).div(100))
	.times(amountConfirmedAdjusted).toNumber();

	return <div
		style={{width: `100%`, height: `100%`}}
		className={"joyride-status-step-2-important-info"}
	>
		<StyledHeader>
			<br/>
			<SVGImage
				src={require(`resources/caution.svg`)?.default}
				height={"1.5em"}
				width={"1.5em"}
			/>
			<br/>
			<div><BoldSpan>Deposit Confirmation</BoldSpan></div>
			<br/>
		</StyledHeader>
		<br/>
		<div style={{padding: `0.75em`, fontSize: `0.8em`}}>
			<div>Received your deposit of {amountConfirmedAdjusted} {sourceAsset?.assetSymbol}!</div>
			<br/>
			<div>Sending {afterFees} {sourceAsset?.assetSymbol} to {destChain?.chainName}</div>
		</div>
		<br/>
	</div>

}

export default Step3InfoForWidget;