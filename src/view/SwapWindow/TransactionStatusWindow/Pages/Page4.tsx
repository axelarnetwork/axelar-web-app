import {useRecoilValue}                                  from "recoil";
import styled                                            from "styled-components";
import BoldSpan                                          from "component/StyleComponents/BoldSpan";
import {FlexRow}                                         from "component/StyleComponents/FlexRow";
import {FlexColumn}                                      from "component/StyleComponents/FlexColumn";
import Tooltip                                           from "component/Widgets/Tooltip";
import CopyToClipboard                                   from "component/Widgets/CopyToClipboard";
import {DESTINATION_TOKEN_KEY}                           from "config/consts";
import completedLogo                                     from "resources/transaction_status_logos/axelar-logo.svg";
import {ChainSelection, DestinationAddress, SourceAsset} from "state/ChainSelection";

const NumbersContainer = styled(FlexRow)`
	height: 40%;
`;

const StyledPage4 = styled.div`
	width: 300px;
	height: 225px;
	position: relative;
	overflow: hidden;
`;
const StyledP = styled.div`
	font-size: 0.75rem;
	overflow-wrap: break-word;
	width: 95%;
`;

const Page4 = () => {
	const selectedSourceAsset = useRecoilValue(SourceAsset);
	const destinationChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const destinationAddr = useRecoilValue(DestinationAddress);

	return <StyledPage4>
		<NumbersContainer>
			<img src={completedLogo} height={`100%`} width={`100%`} alt={""}/>
		</NumbersContainer>
		<FlexColumn>
			<br/>
			<p>Transfer Completed!</p>
		</FlexColumn>
		<StyledP>
			{`Completed ${selectedSourceAsset?.assetSymbol} transfer to ${destinationChain?.chainName} at: `}
			<br/><br/>
			<BoldSpan>{destinationAddr}</BoldSpan>
			<Tooltip
				tooltipText={<CopyToClipboard
					height={`12px`}
					width={`10px`}
					textToCopy={destinationAddr || ""}
				/>}
				tooltipBox={"Copy to Clipboard"}
			/>
		</StyledP>
	</StyledPage4>
}

export default Page4;