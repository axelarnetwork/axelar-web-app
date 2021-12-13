import React, {useImperativeHandle, useState}                from "react";
import {useRecoilState, useRecoilValue, useResetRecoilState} from "recoil";
import {IAssetInfo, IChainInfo}                              from "@axelar-network/axelarjs-sdk";
import {SOURCE_TOKEN_KEY}                                    from "config/consts";
import AssetSelector
                                                             from "component/CompositeComponents/Selectors/AssetSelector";
import {FlexSpaceBetween}                                    from "component/StyleComponents/FlexSpaceBetween";
import SearchComponentGeneric, {ISearchItem}                 from "component/Widgets/SearchComponent";
import {SVGImage}                                            from "component/Widgets/SVGImage";
import {ChainSelection, SourceAsset}                         from "state/ChainSelection";
import {ChainList}                                           from "state/ChainList";
import {StyledChainSelectionComponent}                       from "../StyledChainSelectionComponent";
import {StyledChainSelectionIconWidget}                      from "./StyleComponents/StyledChainSelectionIconWidget";
import {SelectedChainComponent}                              from "./SelectedChainComponent";

interface IChainSelectorProps {
	id: string;
	label: string;
	animate?: boolean;
	hideContents?: boolean;
	ref: any;
}

const ChainSelector = React.forwardRef((props: IChainSelectorProps, ref) => {

	const isSourceChain: boolean = props.id === SOURCE_TOKEN_KEY;
	const [selectedChain, setSelectedChain] = useRecoilState<IChainInfo | null>(ChainSelection(props.id));
	const sourceChain = useRecoilValue<IChainInfo | null>(ChainSelection(SOURCE_TOKEN_KEY));
	const chainList = useRecoilValue(ChainList);
	const [sourceAsset, setSourceAsset] = useRecoilState(SourceAsset);
	const resetSourceAsset = useResetRecoilState(SourceAsset);
	const [showAssetSearchBox, setShowAssetSearchBox] = useState<boolean>(false);
	const [showChainSelectorSearchBox, setShowChainSelectorSearchBox] = useState<boolean>(false);
	const initialAssetList: IAssetInfo[] = chainList?.find(chain => chain?.chainName === sourceChain?.chainName)?.assets || [];

	/*closeAllSearchWindows is a ref method called
	from the parent component (UserInputWindow/index.tsx)
	to programmatically close the asset search windows */
	useImperativeHandle(ref, () => ({
		closeAllSearchWindows() {
			setShowChainSelectorSearchBox(false);
			setShowAssetSearchBox(false);
		}
	}))

	let filteredChainList: IChainInfo[] = chainList;

	/*for the destination chain, if source chain and source asset are selected,
	* only enable chains which also have that asset, based on common_key
	* */
	if (!!sourceChain && !!sourceAsset && !isSourceChain) {
		filteredChainList = filteredChainList.filter((supportedChain) => {
			const assetsInSupportedChain: IAssetInfo[] = supportedChain.assets || [];
			return assetsInSupportedChain.map(asset => asset.common_key).includes(sourceAsset.common_key);
		});
	}
	const chainDropdownOptions: ISearchItem[] = filteredChainList.map((supportedChain: IChainInfo) => ({
		title: supportedChain.chainName,
		active: false,
		icon: require(`resources/logos/${supportedChain?.chainSymbol}.svg`)?.default,
		disabled: false,
		onClick: () => {
			setSelectedChain(supportedChain);

			/* if the selected chain is the source token and the chain only
			has a single asset, select that asset */
			if (isSourceChain) {
				supportedChain?.assets?.length === 1
					? setSourceAsset(supportedChain.assets[0])
					: resetSourceAsset();
			}
		}
	}));

	/*only show the chain selector widget if the asset selector search box is not open*/
	const chainSelectorWidget = () => <StyledChainSelectionIconWidget>
		<div style={{cursor: `pointer`}} onClick={() => setShowChainSelectorSearchBox(!showChainSelectorSearchBox)}>
			<SelectedChainComponent chainInfo={selectedChain}/>
		</div>
		<SVGImage
			style={{cursor: `pointer`}}
			onClick={() => setShowChainSelectorSearchBox(!showChainSelectorSearchBox)}
			src={require(showChainSelectorSearchBox ? `resources/drop-up-arrow.svg` : `resources/drop-down-arrow.svg`)?.default}
			height={"0.75em"}
			width={"0.75em"}
		/>
	</StyledChainSelectionIconWidget>;

	/*only show the asset selector widget if the chain selector search box is not open*/
	const assetSelectorWidget = (shouldHide: boolean) => <StyledChainSelectionIconWidget hide={shouldHide}>
		<div style={{cursor: `pointer`}} onClick={() => setShowAssetSearchBox(!showAssetSearchBox)}>
			<AssetSelector/>
		</div>
		<SVGImage
			style={{cursor: `pointer`}}
			onClick={() => setShowAssetSearchBox(!showAssetSearchBox)}
			src={require(showAssetSearchBox ? `resources/drop-up-arrow.svg` : `resources/drop-down-arrow.svg`)?.default}
			height={"0.75em"}
			width={"0.75em"}
		/>
	</StyledChainSelectionIconWidget>;

	return <StyledChainSelectionComponent>
		<div style={{margin: `10px`, color: `#898994`, fontSize: `0.8em`}}>{props.label}</div>
		<FlexSpaceBetween style={{width: `100%`, marginRight: `5px`}}>
			{chainSelectorWidget()}
			{isSourceChain
				? assetSelectorWidget(!sourceChain)
				: <></>
			}
		</FlexSpaceBetween>
		<SearchComponentGeneric
			show={showChainSelectorSearchBox}
			allItems={chainDropdownOptions}
			handleClose={() => setShowChainSelectorSearchBox(false)}
		/>
		<SearchComponentGeneric
			show={showAssetSearchBox}
			allItems={initialAssetList.map((asset: IAssetInfo) => {
				return {
					title: asset.assetName as string,
					symbol: asset.assetSymbol as string,
					active: false,
					icon: require(`resources/tokenAssets/${asset?.common_key}.svg`)?.default,
					disabled: false,
					onClick: () => {
						setSourceAsset(asset);
					}
				}
			})}
			handleClose={() => setShowAssetSearchBox(false)}
		/>
	</StyledChainSelectionComponent>

});

export default ChainSelector;