// import {useRecoilValue}                          from "recoil";
import styled from "styled-components";
// import BigNumber                                 from "decimal.js";
// import BoldSpan                                  from "component/StyleComponents/BoldSpan";
// import {FlexRow}                                 from "component/StyleComponents/FlexRow";
// import {SVGImage}                                from "component/Widgets/SVGImage";
// import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY} from "config/consts";
// import {ChainSelection, SourceAsset}             from "state/ChainSelection";
// import {NumberConfirmations}                     from "state/TransactionStatus";

export const StyledHeader = styled.div`
	position: relative;
	width: 100%;
    background-color: ${props => props.theme.headerBackgroundColor};
    border-radius: 9px 9px 0px 0px;
    color: white;
    font-size: 1em;
    text-align: center;
    box-sizing: border-box;
    padding: 0.25em;
`;

const Step3InfoForWidget = () => {
	return null;

	// const sourceAsset = useRecoilValue(SourceAsset);
	// const sourceNumConfirmations = useRecoilValue(NumberConfirmations(SOURCE_TOKEN_KEY));
	// const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	// const destChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	//
	// const amountConfirmedAtomicUnits: number = parseFloat((sourceNumConfirmations.amountConfirmedString || "")
	// .replace(/[^\d.]*/g, ''));
	// const amountConfirmedAdjusted: number = amountConfirmedAtomicUnits
	// 	* BigNumber.pow(10, (-1 * (sourceAsset?.decimals || 1))).toNumber();
	// const afterFees: number = new BigNumber(1).minus(new BigNumber(sourceChain?.txFeeInPercent || 0).div(100))
	// .times(amountConfirmedAdjusted).toNumber();
	//
	// return <div
	// 	style={{width: `100%`, height: `100%`}}
	// 	className={"joyride-status-step-2-important-info"}
	// >
	// 	<StyledHeader>
	// 		<br/>
	// 		<div><BoldSpan>Deposit Confirmed!</BoldSpan></div>
	// 		<br/>
	// 	</StyledHeader>
	// 	<br/>
	// 	<FlexRow><SVGImage src={require(`resources/tokenAssets/${sourceAsset?.common_key}.svg`).default} height={"20%"} width={"20%"}/></FlexRow>
	// 	<br/>
	// 	<div style={{padding: `0.75em`, fontSize: `0.9em`}}>
	// 		<div>Your <BoldSpan>{amountConfirmedAdjusted} {sourceAsset?.assetSymbol}</BoldSpan> deposit was received!</div>
	// 		<br/>
	// 		<div>Sending <BoldSpan>{afterFees} {sourceAsset?.assetSymbol}</BoldSpan> to {destChain?.chainName}.</div>
	// 	</div>
	// 	<br/>
	// </div>

}

export default Step3InfoForWidget;