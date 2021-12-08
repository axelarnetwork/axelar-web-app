import {useRecoilValue}              from "recoil";
import BoldSpan                      from "component/StyleComponents/BoldSpan";
import {StyledImage}                 from "component/StyleComponents/StyledImage";
import {StyledTransferFeeDivider}                from "component/StyleComponents/StyledTransferFeeDivider";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY} from "config/consts";
import dividerImage                              from "resources/group.svg";
import {ChainSelection, SourceAsset} from "state/ChainSelection";

const TransferFeeDivider = () => {

	const srcChainSelection = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const destChainSelection = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const selectedSrcAsset = useRecoilValue(SourceAsset);

	const waitTime: number = srcChainSelection?.estimatedWaitTime || 0;

	return <StyledTransferFeeDivider showContents={!!(srcChainSelection && selectedSrcAsset && destChainSelection)}>
		<StyledImage src={dividerImage}/>
		<div style={{display: `flex`, justifyContent: `space-between`}}>
			<div style={{marginLeft: `15px`, marginTop: `10px`}}>
				<div><BoldSpan>Approximate wait time: </BoldSpan></div>
				<div>~{waitTime}-{waitTime+5} minutes</div>
			</div>
			<div style={{textAlign: `right`}}>
				<div><BoldSpan>Transfer Fee: </BoldSpan></div>
				<div>{srcChainSelection?.txFeeInPercent}% of transferred {selectedSrcAsset?.assetSymbol}</div>
			</div>
		</div>
	</StyledTransferFeeDivider>;
}

export default TransferFeeDivider;