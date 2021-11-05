import {useEffect, createRef, useState}       from "react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import styled                        from "styled-components";
import {IAssetInfo}                  from "@axelar-network/axelarjs-sdk";
import {SOURCE_TOKEN_KEY}            from "config/consts";
import {GridDisplay}                 from "component/StyleComponents/GridDisplay";
import {SVGImage}                    from "component/Widgets/SVGImage";
import svg                           from "resources/select-asset-component.svg";
import {ChainList}                   from "state/ChainList";
import {ChainSelection, SourceAsset} from "state/ChainSelection";
import {SelectedChainComponent}      from "../ChainSelector/SelectedChainComponent";
import AssetSearchComponent          from "./AssetSearchComponent";

/*TODO: commenting this out for now... but we'll want to use this for custom scrolling of StyleBox*/
// import {useScrollPosition}           from "@n8tb1t/use-scroll-position";

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
	overflow-y: auto;
	position: relative;
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

	const elRef = createRef() as React.MutableRefObject<HTMLInputElement>;
	const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const setSourceChainAsset = useSetRecoilState(SourceAsset);
	const chainList = useRecoilValue(ChainList);
	const initialAssetList: IAssetInfo[] = chainList?.find(chain => chain?.chainName === sourceChain?.chainName)?.assets || [];
	const [assetList, setAssetList] = useState<IAssetInfo[]>(initialAssetList);
	// const [scrollbarPosition, setScrollbarPosition] = useState<any>(null)

	useEffect(() => {
		const newAssetList = chainList?.find(chain => chain?.chainName === sourceChain?.chainName)?.assets || [];
		setAssetList(newAssetList);
	}, [chainList, sourceChain,setAssetList]);

	// useScrollPosition(
	// 	({ prevPos, currPos }) => {
	// 		const isVisible = currPos.y > prevPos.y
	//
	// 		console.log("currPos.y",currPos.y);
	//
	// 		const shouldBeStyle = {
	// 			visibility: isVisible ? 'visible' : 'hidden',
	// 			transition: `all 200ms ${isVisible ? 'ease-in' : 'ease-out'}`,
	// 			transform: isVisible ? 'none' : 'translate(0, -100%)'
	// 		}
	//
	// 		// if (JSON.stringify(shouldBeStyle) === JSON.stringify(scrollbarPosition)) return
	//
	// 		setScrollbarPosition(shouldBeStyle)
	// 	},
	// 	[scrollbarPosition], elRef as React.MutableRefObject<HTMLInputElement>
	// )
	//
	// console.log("element ref",elRef);

	const handleChange = (asset: IAssetInfo) => setSourceChainAsset(asset);

	return (<StyledAssetMenu>
		<StyledCloseButton
			onClick={props.handleClose}
			height={"12px"} width={"12px"}
			src={require(`resources/close-icon.svg`)?.default}
		/>
		<div style={{ marginLeft: `30px`, fontSize: `18px` }}>
			<SelectedChainComponent chainInfo={sourceChain} />
		</div>
		<br />
		<AssetSearchComponent
			initialAssetList={initialAssetList}
			callback={(data: IAssetInfo[]) => setAssetList(data)}
		/>
		<br />
		<StyledBox ref={elRef}>
			{assetList.map(assetInfo => (<AssetOption
					key={assetInfo.assetSymbol}
					assetInfo={assetInfo} onClick={() => {
					handleChange(assetInfo);
					props.handleClose && props.handleClose();
				}}/>
			))}
		</StyledBox>
		{/*{*/}
		{/*	scrollbarPosition*/}
		{/*		? <div style={{ position: `relative`, height: `80px`, width: `10px`, background: `grey` }}>*/}
		{/*			<div style={{ position: `relative`, top: `${Math.floor(100 * scrollbarPosition)}%` }}>x</div>*/}
		{/*		</div>*/}
		{/*		: null*/}
		{/*}*/}
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
		<SVGImage height={"25px"} width={"25px"} src={image} />
		<span style={{ marginLeft: `15px` }}>{assetInfo?.assetName} ({assetInfo?.assetSymbol})</span>
	</StyledToken>;
}

export default AssetMenu;