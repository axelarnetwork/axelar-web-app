import {useRecoilValue}              from "recoil";
import BoldSpan                      from "component/StyleComponents/BoldSpan";
import {StyledImage}                 from "component/StyleComponents/StyledImage";
import {StyledTransferFeeDivider}    from "component/StyleComponents/StyledTransferFeeDivider";
import {SOURCE_TOKEN_KEY}            from "config/consts";
import dividerImage                  from "resources/group.svg";
import {ChainSelection, SourceAsset} from "state/ChainSelection";

const TransferFeeDivider = () => {

	const sourceChainSelection = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const selectedSourceAsset = useRecoilValue(SourceAsset);

	return <StyledTransferFeeDivider showContents={!!(sourceChainSelection && selectedSourceAsset)}>
		<StyledImage src={dividerImage}/>
		<div style={{display: `flex`, justifyContent: `space-between`}}>
			<div style={{marginLeft: `15px`, marginTop: `10px`}}>
				<div><BoldSpan>Approximate wait time: </BoldSpan></div>
				<div>XX minutes</div>
			</div>
			<div style={{textAlign: `right`}}>
				<div><BoldSpan>Transfer Fee: </BoldSpan></div>
				<div>XX% of transferred {selectedSourceAsset?.assetSymbol}</div>
			</div>
		</div>
	</StyledTransferFeeDivider>;
}

export default TransferFeeDivider;