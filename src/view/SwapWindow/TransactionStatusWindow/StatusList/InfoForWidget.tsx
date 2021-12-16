import styled, {css}                 from "styled-components";
import BoldSpan                      from "component/StyleComponents/BoldSpan";
import {SVGImage}                    from "component/Widgets/SVGImage";
import {useRecoilValue}              from "recoil";
import {ChainSelection, SourceAsset} from "../../../../state/ChainSelection";
import {SOURCE_TOKEN_KEY}            from "../../../../config/consts";
import {FlexRow}                     from "../../../../component/StyleComponents/FlexRow";

/*
TODO: make table reusable component with SupportedAssets
* */
const tableStyles = css`
	text-align: left;
	box-sizing: border-box;

`;
const StyledTable = styled.table`
	${tableStyles}
	font-size: 0.8em;
`;
const StyledRow = styled.tr`
	${tableStyles}
`;
const StyledCell = styled.td`
	${tableStyles}
`;
const HeaderImage = styled(FlexRow)`
`;

const InfoForWidget = () => {
	const sourceAsset = useRecoilValue(SourceAsset);
	const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));

	return <div>
		<HeaderImage><SVGImage
			src={require(`resources/caution.svg`)?.default}
			height={"2.5em"}
			width={"2.5em"}
		/></HeaderImage>
		<br/>
		<div><BoldSpan>Important Deposit Information</BoldSpan></div>
		<br/>
		<StyledTable>
			<tbody>
			<StyledRow>
				<StyledCell><BoldSpan>Fee</BoldSpan></StyledCell>
				<StyledCell>{sourceChain?.txFeeInPercent}% of transferred {sourceAsset?.assetSymbol} on {sourceChain?.chainName}</StyledCell>
			</StyledRow>
			<StyledRow>
				<StyledCell><BoldSpan>Minimum amount</BoldSpan></StyledCell>
				<StyledCell>{`${sourceAsset?.minDepositAmt} ${sourceAsset?.assetSymbol} on ${sourceChain?.chainName}`}</StyledCell>
			</StyledRow>
			<StyledRow>
				<StyledCell><BoldSpan>Wait time</BoldSpan></StyledCell>
				<StyledCell>It'll take upwards of ~{sourceChain?.estimatedWaitTime} minutes to confirm your deposit on {sourceChain?.chainName}</StyledCell>
			</StyledRow>
			<StyledRow>TODO: let's make this look nicer.</StyledRow>
			</tbody>
		</StyledTable>
	</div>

}

export default InfoForWidget;