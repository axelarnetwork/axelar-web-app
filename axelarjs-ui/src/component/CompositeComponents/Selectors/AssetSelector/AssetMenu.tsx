import {useRecoilValue, useSetRecoilState} from "recoil";
import {IAssetInfo}                        from "@axelar-network/axelarjs-sdk";
import {SOURCE_TOKEN_KEY}                  from "config/consts";
import svg                                 from "resources/select-asset-component.svg";
import {ChainSelection, SourceAsset}       from "state/ChainSelection";
import styled                              from "styled-components";
import {GridDisplay}                       from "component/StyleComponents/GridDisplay";
import {SelectedChainComponent}            from "../ChainSelector/SelectedChainComponent";
import AssetSearchComponent                from "./AssetSearchComponent";
import {useEffect, useState}               from "react";
import {ChainList}                         from "state/ChainList";
import {SVGImage}                          from "../../../Widgets/SVGImage";

const StyledAssetMenu = styled(GridDisplay)`
	background-image: url(${svg});
	background-repeat: no-repeat;
	background-size: cover;
	height: 572px;
	width: 409px;
	padding: 15px 75px 90px 55px; /*top right bottom left*/
	box-sizing: border-box;
`;

const StyledBox = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  box-shadow: inset 0 0 3px 0 rgba(0, 0, 0, 0.21);
  border: solid 1px #e2e1e2;
  background-color: rgba(255, 255, 255, 0.02);
`;

const StyledCloseButton = styled(SVGImage)`
	position: absolute;
	cursor: pointer;
	right: 40px;
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
		<StyledCloseButton onClick={props.handleClose} height={"12px"} width={"12px"}
		          src={require(`resources/close-icon.svg`)?.default}
		/>
		<div style={{ marginLeft: `30px`}}><SelectedChainComponent chainInfo={sourceChain} /></div>
		<br />
		<AssetSearchComponent
			initialAssetList={initialAssetList}
			callback={(data) => setAssetList(data)}
		/>
		<br />
		<StyledBox>
			{assetList.map(assetInfo => (<AssetOption
					key={assetInfo.assetSymbol}
					assetInfo={assetInfo} onClick={() => {
					handleChange(assetInfo);
					props.handleClose && props.handleClose();
				}}/>
			))}
		</StyledBox>
	</StyledAssetMenu>);
};

interface IAssetOption {
	assetInfo: IAssetInfo;
	onClick: any;
}

const StyledToken = styled.div`
	cursor: pointer;
	box-sizing: border-box;
	width: 100%;
	padding: 20px;
	box-sizing: border-box;
	border: solid 1px #e2e1e2;
	color: #babbc8;
	letter-spacing: 0.78px;
	font-weight: bold;
`;

const AssetOption = (props: IAssetOption) => {
	const {assetInfo, onClick}: { assetInfo: IAssetInfo, onClick: any } = props;
	return <StyledToken onClick={() => onClick(assetInfo)}>
		<span>{assetInfo?.assetName} ({assetInfo?.assetSymbol})</span>
	</StyledToken>;
}

export default AssetMenu;