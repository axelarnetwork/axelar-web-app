import {useRecoilValue}                          from "recoil";
import styled, {ThemedStyledProps}               from "styled-components";
import BoldSpan                                  from "component/StyleComponents/BoldSpan";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY} from "config/consts";
import screenConfigs                             from "config/screenConfigs";
import {ChainSelection, SourceAsset}             from "state/ChainSelection";
import {getMinDepositAmount}                     from "utils/getMinDepositAmount";

interface IStyledTransferFeeDividerProps extends ThemedStyledProps<any, any> {
	nextState?: boolean;
	showContents?: boolean;
}

export const StyledTransferFeeDivider = styled.div<IStyledTransferFeeDividerProps>`
	position: relative;
	width: 99%;
	padding: 0.5em;
	box-sizing: border-box;
	height: auto;
	font-size: 0.75em;
	border-radius: 5px;
	border: solid 1px #e2e1e2;
	opacity: ${props => props.showContents ? `1` : `0`};
    ${props => props.showContents ? `transition: opacity 1000ms;` : ``}
    
    @media ${screenConfigs.media.desktop} {
		font-size: 0.9em;
	}
    @media ${screenConfigs.media.laptop} {
	}
	@media ${screenConfigs.media.tablet} {
	}
	@media ${screenConfigs.media.mobile} {
	}
`;

const TransactionInfo = () => {

	const srcChainSelection = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const destChainSelection = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const selectedSrcAsset = useRecoilValue(SourceAsset);

	const waitTime: number = srcChainSelection?.estimatedWaitTime || 0;
	const minDeposit: number | null = getMinDepositAmount(selectedSrcAsset, destChainSelection);

	return <StyledTransferFeeDivider showContents={!!(srcChainSelection && selectedSrcAsset && destChainSelection)}>
		<div style={{display: `flex`, flexDirection: `column`}}>
			{minDeposit && generateInfoLine(`Minimum Transfer Amount`, `${minDeposit} ${selectedSrcAsset?.assetSymbol}`)}
			{generateInfoLine("Fee (% of assets transferred)", `${srcChainSelection?.txFeeInPercent}%`)}
			{generateInfoLine("Total Approximate Wait Time", `~${waitTime}-${waitTime + 5} minutes`)}
		</div>
	</StyledTransferFeeDivider>;
}

const generateInfoLine = (headerColumn: string, contents: string) => (
	<div style={{display: `flex`, justifyContent: `space-between`}}>
		<div style={{margin: `3px`, color: `#898994`}}>{headerColumn}</div>
		<div><BoldSpan>{contents}</BoldSpan></div>
	</div>
)

export default TransactionInfo;