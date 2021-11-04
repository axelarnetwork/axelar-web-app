import {useRecoilValue, useSetRecoilState} from "recoil";
import {IAssetInfo}                        from "@axelar-network/axelarjs-sdk";
import {SOURCE_TOKEN_KEY}                  from "config/consts";
import svg                                 from "resources/select-asset-component.svg";
import {ChainSelection, SourceAsset}       from "state/ChainSelection";
import styled                              from "styled-components";
import {GridDisplay}                       from "component/StyleComponents/GridDisplay";
import {SelectedChainComponent}            from "../ChainSelector/SelectedChainComponent";
import AssetSearchComponent  from "./AssetSearchComponent";
import {useEffect, useState} from "react";
import {ChainList}           from "../../../../state/ChainList";

const StyledAssetMenu = styled(GridDisplay)`
	background-image: url(${svg});
	background-repeat: no-repeat;
	background-size: cover;
	height: 572px;
	width: 409px;
	padding: 15px 50px 0px 50px; /*top right bottom left*/
	box-sizing: border-box;
`;

interface IAssetMenuProps {
	handleClose?: () => void;
}
const AssetMenu = (props: IAssetMenuProps) => {

	const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const setSourceChainAsset = useSetRecoilState(SourceAsset);
	const chainList = useRecoilValue(ChainList);
	const initialAssetList: IAssetInfo[] = chainList?.find(chain => chain?.chainName === sourceChain?.chainName)?.assets || [];
	const [assetList, setAssetList] = useState<IAssetInfo[]>(initialAssetList);

	useEffect(() => {
		const newAssetList = chainList?.find(chain => chain?.chainName === sourceChain?.chainName)?.assets || [];
		setAssetList(newAssetList);
	}, [chainList, sourceChain,setAssetList]);

	const handleChange = (asset: IAssetInfo) => setSourceChainAsset(asset);

	return (<StyledAssetMenu>
		<div style={{ marginLeft: `30px`}}><SelectedChainComponent chainInfo={sourceChain} /></div>
		<AssetSearchComponent
			initialAssetList={initialAssetList}
			callback={(data) => setAssetList(data)}
		/>
		<div>
			{assetList.map(assetInfo => (<TokenOption
					key={assetInfo.assetSymbol}
					tokenInfo={assetInfo} onClick={() => {
					handleChange(assetInfo);
					props.handleClose && props.handleClose();
				}}/>
			))}
		</div>
	</StyledAssetMenu>);
};

interface ITokenOption {
	tokenInfo: IAssetInfo;
	onClick: any;
}

const StyledToken = styled.div`
	cursor: pointer;
	box-sizing: border-box;
`;

const TokenOption = (props: ITokenOption) => {
	const {tokenInfo, onClick}: { tokenInfo: IAssetInfo, onClick: any } = props;
	return <StyledToken onClick={() => onClick(tokenInfo)}>
		<h6>{tokenInfo?.assetName} ({tokenInfo?.assetSymbol})</h6>
	</StyledToken>;
}

export default AssetMenu;