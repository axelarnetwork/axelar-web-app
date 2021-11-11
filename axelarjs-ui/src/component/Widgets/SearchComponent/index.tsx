import {useEffect, useState}               from "react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import styled, {ThemedStyledProps}         from "styled-components";
import {IAssetInfo}                        from "@axelar-network/axelarjs-sdk";
import {SOURCE_TOKEN_KEY}                  from "config/consts";
import {GridDisplay}                       from "component/StyleComponents/GridDisplay";
import {SVGImage}                          from "component/Widgets/SVGImage";
import SearchFilterText                    from "component/Widgets/SearchComponent/SearchFilterText";
import {ChainList}                         from "state/ChainList";
import {ChainSelection, SourceAsset}       from "state/ChainSelection";

interface IStyledSearchComponentProps extends ThemedStyledProps<any, any> {
	show: boolean;
}

const StyledSearchComponent = styled(GridDisplay)<IStyledSearchComponentProps>`
	padding: ${props => props.show ? '15px' : '0px'};
	box-sizing: border-box;
	width: 100%;
	height: 375px;
	visibility: ${props => props.show ? 'visible' : 'hidden'};
	height: ${props => props.show ? '375px' : '0px'};
	transition: all 1000ms;
`;

const StyledBox = styled.div`
	width: 100%;
	height: 100%;
	border-radius: 8px;
	box-shadow: inset 0 0 3px 0 rgba(0, 0, 0, 0.21);
	border: solid 1px #e2e1e2;
	background-color: rgba(255, 255, 255, 0.02);
	overflow-y: auto;
	position: relative;
`;

interface ISearchMenuProps {
	show: boolean;
	handleClose?: () => void;
}

const SearchMenu = (props: ISearchMenuProps) => {

	const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const setSourceChainAsset = useSetRecoilState(SourceAsset);
	const chainList = useRecoilValue(ChainList);
	const initialAssetList: IAssetInfo[] = chainList?.find(chain => chain?.chainName === sourceChain?.chainName)?.assets || [];
	const [assetList, setAssetList] = useState<IAssetInfo[]>(initialAssetList);

	useEffect(() => {
		const newAssetList = chainList?.find(chain => chain?.chainName === sourceChain?.chainName)?.assets || [];
		setAssetList(newAssetList);
	}, [chainList, sourceChain, setAssetList]);

	const handleChange = (asset: IAssetInfo) => setSourceChainAsset(asset);

	return (<StyledSearchComponent show={props.show}>
		{props.show && <>
            <SearchFilterText
                initialAssetList={initialAssetList}
                callback={(data: IAssetInfo[]) => setAssetList(data)}
                show={props.show}
            />
            <br/>
            <StyledBox>
				{assetList.map(assetInfo => (<AssetOption
						key={assetInfo.assetSymbol}
						assetInfo={assetInfo} onClick={() => {
						handleChange(assetInfo);
						props.handleClose && props.handleClose();
					}}/>
				))}
            </StyledBox>
        </>}
	</StyledSearchComponent>);
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
	&:hover {
		color: black;
	}
	transition: color 1000ms;
`;

const AssetOption = (props: IAssetOption) => {

	const chainInfo = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));

	let image;
	try {
		image = require(`resources/logos/${chainInfo?.chainSymbol}/assets/${props.assetInfo?.assetSymbol}.svg`)?.default;
	} catch (e) {
		image = require(`resources/select-chain-icon-black.svg`)?.default;
	}

	const {assetInfo, onClick}: { assetInfo: IAssetInfo, onClick: any } = props;
	return <StyledToken onClick={() => onClick(assetInfo)}>
		<SVGImage height={"25px"} width={"25px"} src={image}/>
		<span style={{marginLeft: `15px`}}>{assetInfo?.assetName} ({assetInfo?.assetSymbol})</span>
	</StyledToken>;
}

export default SearchMenu;