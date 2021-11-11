import React, {useState}                                     from "react";
import {useRecoilState, useRecoilValue, useResetRecoilState} from "recoil";
import {IAssetInfo, IChainInfo}                              from "@axelar-network/axelarjs-sdk";
import {SOURCE_TOKEN_KEY}                                    from "config/consts";
import AssetSelector
                                                             from "component/CompositeComponents/Selectors/AssetSelector";
import {FlexRow}                                             from "component/StyleComponents/FlexRow";
import DropdownComponent, {IDropdownOption}                  from "component/Widgets/DropdownComponent";
import SearchComponent                                       from "component/Widgets/SearchComponent";
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
}

const ChainSelector = (props: IChainSelectorProps) => {

	const isSourceChain: boolean = props.id === SOURCE_TOKEN_KEY;
	const [selectedChain, setSelectedChain] = useRecoilState<IChainInfo | null>(ChainSelection(props.id));
	const sourceChain = useRecoilValue<IChainInfo | null>(ChainSelection(SOURCE_TOKEN_KEY));
	const chainList = useRecoilValue(ChainList);
	const [sourceAsset, setSourceAsset] = useRecoilState(SourceAsset);
	const resetSourceAsset = useResetRecoilState(SourceAsset);
	const [showAssetSearchBox, setShowAssetSearchBox] = useState<boolean>(false);

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
	const chainDropdownOptions: IDropdownOption[] = filteredChainList.map((supportedChain: IChainInfo) => ({
		title: supportedChain.chainName,
		symbol: supportedChain.chainSymbol,
		active: false,
		disabled: false,
		action: (param: IDropdownOption) => {
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

	const chainSelectorWidget = () => <StyledChainSelectionIconWidget>
		<SelectedChainComponent chainInfo={selectedChain}/>
		{<DropdownComponent
			id={"dropdown-for-" + props.id}
			dropdownOptions={chainDropdownOptions}
		/>}
	</StyledChainSelectionIconWidget>;

	const assetSelectorWidget = (shouldHide: boolean) => <StyledChainSelectionIconWidget hide={shouldHide}>
		<div style={{cursor: `pointer`}} onClick={() => setShowAssetSearchBox(!showAssetSearchBox)}>
			<AssetSelector/>
		</div>
		<SVGImage
			style={{cursor: `pointer`}}
			onClick={() => setShowAssetSearchBox(!showAssetSearchBox)}
			src={require(showAssetSearchBox ? `resources/chevron-up-black.svg` : `resources/chevron-down-black.svg`)?.default}
			height={"8px"}
			width={"20px"}
		/>
	</StyledChainSelectionIconWidget>;

	return <StyledChainSelectionComponent>
		<div style={{marginLeft: `10px`, marginBottom: `2px`}}>{props.label}</div>
		{isSourceChain
			? <FlexRow style={{width: `100%`}}>
				{chainSelectorWidget()}
				{assetSelectorWidget(!sourceChain)}
			</FlexRow>
			: chainSelectorWidget()
		}
		{isSourceChain
		&& <SearchComponent
            show={showAssetSearchBox}
            handleClose={() => setShowAssetSearchBox(false)}
        />
		}
	</StyledChainSelectionComponent>

}

export default ChainSelector;