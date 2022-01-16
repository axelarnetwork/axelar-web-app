import {useRecoilValue}                          from "recoil";
import styled                                    from "styled-components";
import BoldSpan                                  from "component/StyleComponents/BoldSpan";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY} from "config/consts";
import {ChainSelection, SourceAsset}             from "state/ChainSelection";
import {SourceDepositAddress}                    from "state/TransactionStatus";
import {getShortenedWord}                        from "utils/wordShortener";
import {getMinDepositAmount}                     from "utils/getMinDepositAmount";
import {DepositFromWallet}                       from "./DepositFromWallet";

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

const Step2InfoForWidget = ({isWalletConnected, walletBalance}: {isWalletConnected: boolean, walletBalance: number}) => {

	const sourceAsset = useRecoilValue(SourceAsset);
	const depositAddress = useRecoilValue(SourceDepositAddress);
	const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const destChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));

	if (!sourceAsset || !depositAddress || !sourceChain || !destChain)
		return null;

	const minDepositAmt = getMinDepositAmount(sourceAsset, destChain);

	return <div
		style={{width: `100%`, height: `100%`}}
		className={"joyride-status-step-2-important-info"}
	>
		<StyledHeader>
			<br/>
			<div><BoldSpan>Deposit Notes</BoldSpan></div>
			<br/>
		</StyledHeader>
		<br/>
		{generateLine("Transfer Fee", `${sourceChain?.txFeeInPercent}% of transferred ${sourceAsset?.assetSymbol}`)}
		{minDepositAmt && generateLine("Minimum Transfer Amount", `Send at least ${minDepositAmt} ${sourceAsset?.assetSymbol || "XX"} to the deposit address ("${getShortenedWord(depositAddress?.assetAddress)}")`)}
		{generateLine("Deposit Confirmation Wait Time", `Upwards of ~${sourceChain?.estimatedWaitTime} minutes to confirm your deposit on ${sourceChain?.chainName}`)}
		{isWalletConnected && generateLine("(Optional) Send deposit here!", <DepositFromWallet isWalletConnected={isWalletConnected} walletBalance={walletBalance}/>)}
		<br/>
	</div>

}

const generateLine = (header: string, text: string | JSX.Element) => {
	return <div style={{padding: `0.75em`, fontSize: `0.8em`}}>
		<BoldSpan>{header}</BoldSpan>
		<div>{text}</div>
	</div>;
}

export default Step2InfoForWidget;