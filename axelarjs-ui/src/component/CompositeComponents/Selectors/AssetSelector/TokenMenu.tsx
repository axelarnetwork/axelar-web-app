import {useRecoilValue, useSetRecoilState} from "recoil";
import {ChainSelection, SourceAsset}       from "state/ChainSelection";
import {SOURCE_TOKEN_KEY}                  from "config/consts";
import {ChainList}                         from "state/ChainList";
import {IAssetInfo}                        from "@axelar-network/axelarjs-sdk";

const TokenMenu = (props: any) => {

	const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const selectedToken = useRecoilValue(SourceAsset);
	const chainList = useRecoilValue(ChainList);
	const setSourceChainAsset = useSetRecoilState(SourceAsset);
	const allTokens: IAssetInfo[] = chainList?.find(chain => chain?.chainName === sourceChain?.chainName)?.assets || [];
	const handleChange = (asset: IAssetInfo) => setSourceChainAsset(asset);

	return (<>
		<div className="token-selector-header">
			<h5>Select an Asset</h5>
		</div>
		<div className="token-selector-list">
			{allTokens.map(token => (<TokenOption
					key={token.assetSymbol}
					tokenInfo={token} onClick={() => {
					handleChange(token);
					props.onHide();
				}}/>
			))}
		</div>
	</>);
};

interface ITokenOption {
	tokenInfo: IAssetInfo;
	onClick: any;
}

const TokenOption = (props: ITokenOption) => {
	const {tokenInfo, onClick}: { tokenInfo: IAssetInfo, onClick: any } = props;
	return <div className="token-option" onClick={() => onClick(tokenInfo)}>
		<h6>{tokenInfo?.assetName} ({tokenInfo?.assetSymbol})</h6>
	</div>;
}

export default TokenMenu;