import {useRecoilValue, useSetRecoilState} from "recoil";
import {IAssetInfo}                        from "@axelar-network/axelarjs-sdk";
import {SOURCE_TOKEN_KEY}                  from "config/consts";
import svg                                 from "resources/select-asset-component.svg";
import {ChainList}                         from "state/ChainList";
import {ChainSelection, SourceAsset}       from "state/ChainSelection";
import styled                              from "styled-components";
import {GridDisplay}                       from "component/StyleComponents/GridDisplay";

const StyledAssetMenu = styled(GridDisplay)`
	background-image: url(${svg});
	background-repeat: no-repeat;
	background-size: cover;
	height: 569px;
	width: 401px;
	padding: 15px 50px 0px 50px; /*top right bottom left*/
	box-sizing: border-box;
`;

const AssetMenu = (props: any) => {

	const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const chainList = useRecoilValue(ChainList);
	const setSourceChainAsset = useSetRecoilState(SourceAsset);
	const fullAssetList: IAssetInfo[] = chainList?.find(chain => chain?.chainName === sourceChain?.chainName)?.assets || [];
	const handleChange = (asset: IAssetInfo) => setSourceChainAsset(asset);

	return (<StyledAssetMenu>
		<div>
			<h5>Select an Asset</h5>
		</div>
		<div>
			{fullAssetList.map(assetInfo => (<TokenOption
					key={assetInfo.assetSymbol}
					tokenInfo={assetInfo} onClick={() => {
					handleChange(assetInfo);
					props.onHide();
				}}/>
			))}
		</div>
	</StyledAssetMenu>);
};

interface ITokenOption {
	tokenInfo: IAssetInfo;
	onClick: any;
}

const TokenOption = (props: ITokenOption) => {
	const {tokenInfo, onClick}: { tokenInfo: IAssetInfo, onClick: any } = props;
	return <div onClick={() => onClick(tokenInfo)}>
		<h6>{tokenInfo?.assetName} ({tokenInfo?.assetSymbol})</h6>
	</div>;
}

export default AssetMenu;