import {IAsset}           from "@axelar-network/axelarjs-sdk";
import ModalWidget        from "component/CompositeComponents/ModalWidget";

//TODO: convert to styled components instead of CSS
import "./assetSelector.css";
import {useRecoilValue}   from "recoil";
import {ChainSelection}   from "../../../../state/ChainSelection";
import {SOURCE_TOKEN_KEY} from "../../../../config/consts";

interface IAssetSelector {
	selectedToken: IAsset | null;
	allTokens: IAsset[];
	handleChange: (param: any) => void;
}

const AssetSelector = ({selectedToken, allTokens, handleChange}: IAssetSelector) => {

	const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY))

	const TokenMenu = (props: any) => (<>
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

	return (<div className="token-selection-window">
		<div className="selected-token-info">
			<ModalWidget
				modaltext={selectedToken
					? `${selectedToken?.assetName} (${selectedToken?.assetSymbol})`
					: `Select asset in ${sourceChain?.chainName} to transfer`}
				items={<TokenMenu/>}
			/>
		</div>
	</div>)
};

interface ITokenOption {
	tokenInfo: IAsset;
	onClick: any;
}

const TokenOption = (props: ITokenOption) => {
	const {tokenInfo, onClick}: { tokenInfo: IAsset, onClick: any } = props;
	return <div className="token-option" onClick={() => onClick(tokenInfo)}>
		<h6>{tokenInfo?.assetName} ({tokenInfo?.assetSymbol})</h6>
	</div>;
}

export default AssetSelector;