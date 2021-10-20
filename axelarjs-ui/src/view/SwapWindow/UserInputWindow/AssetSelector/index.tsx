import {IAsset}    from "@axelar-network/axelarjs-sdk";
import ModalWidget from "component/CompositeComponents/ModalWidget";

//TODO: convert to styled components instead of CSS
import "./assetSelector.css";

interface IAssetSelector {
	selectedToken: IAsset | null;
	allTokens: IAsset[];
	handleChange: (param: any) => void;
}

const AssetSelector = ({selectedToken, allTokens, handleChange}: IAssetSelector) => {

	const TokenMenu = (props: any) => (<>
		<div className="token-selector-header">
			<h5>Select a token</h5>
		</div>
		<div className="token-selector-list">
			{allTokens.map(token => (<TokenOption
					key={token.symbol}
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
				modaltext={(`${selectedToken?.name} (${selectedToken?.symbol})` ) || "Select Asset"}
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
		<h6>{tokenInfo?.name} ({tokenInfo?.symbol})</h6>
	</div>;
}

export default AssetSelector;