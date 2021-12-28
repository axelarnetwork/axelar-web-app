import {useRecoilValue}              from "recoil";
import styled                        from "styled-components";
import BigNumber                     from "decimal.js";
import BoldSpan                      from "component/StyleComponents/BoldSpan";
import {SVGImage}                    from "component/Widgets/SVGImage";
import {SOURCE_TOKEN_KEY}            from "config/consts";
import {ChainSelection, SourceAsset} from "state/ChainSelection";
import {SourceDepositAddress}        from "state/TransactionStatus";
import {getShortenedWord}            from "utils/wordShortener";

export const StyledHeader = styled.div`
	position: relative;
	width: 100%;
    background-color: ${props => props.theme.headerBackgroundColor};
    border-radius: 9px 9px 0px 0px;
    color: white;
    font-size: .8em;
    text-align: center;
    box-sizing: border-box;
    padding: 0.25em;
`;

const Step2InfoForWidget = () => {

	const sourceAsset = useRecoilValue(SourceAsset);
	const depositAddress = useRecoilValue(SourceDepositAddress);
	const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));

	return <div
		style={{ width: `100%`, height: `100%`}}
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
			<div><BoldSpan>Important Deposit Information</BoldSpan></div>
			<br/>
		</StyledHeader>
		<br/>
		{generateLine("Transfer Fee", `${sourceChain?.txFeeInPercent}% of transferred ${sourceAsset?.assetSymbol} on the ${sourceChain?.chainName} network`)}
		{generateLine("Minimum Transfer Amount", `${(new BigNumber(sourceAsset?.minDepositAmt || 0)).times(1.15)} ${sourceAsset?.assetSymbol || "XX"} sent to the one-time deposit address ("${getShortenedWord(depositAddress?.assetAddress)}") on ${sourceChain?.chainName || "XX"}`)}
		{generateLine("Deposit Confirmation Wait Time", `Upwards of ~${sourceChain?.estimatedWaitTime} minutes to confirm your deposit on ${sourceChain?.chainName}`)}
		<br/>
	</div>

}

const generateLine = (header: string, text: string) => {
	return <div style={{padding: `0.75em`, fontSize: `0.8em`}}>
		<BoldSpan>{header}</BoldSpan>
		<div>{text}</div>
	</div>;
}

export default Step2InfoForWidget;