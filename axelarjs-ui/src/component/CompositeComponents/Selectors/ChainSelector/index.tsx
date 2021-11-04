import React                                                 from "react";
import {useRecoilState, useRecoilValue, useResetRecoilState} from "recoil";
import {IChainInfo}                                          from "@axelar-network/axelarjs-sdk";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}             from "config/consts";
import ModalWidget                                           from "component/CompositeComponents/ModalWidget";
import AssetSelector
                                                             from "component/CompositeComponents/Selectors/AssetSelector";
import {FlexRow}                                             from "component/StyleComponents/FlexRow";
import DropdownComponent, {IDropdownOption}                  from "component/Widgets/DropdownComponent";
import {ChainSelection, SourceAsset}                         from "state/ChainSelection";
import {ChainList}                                           from "state/ChainList";
import {StyledChainSelectionComponent}                       from "../StyledChainSelectionComponent";
import {StyledChainSelectionIconWidget}                      from "./StyleComponents/StyledChainSelectionIconWidget";
import {SelectedChainComponent} from "./SelectedChainComponent";
import AssetMenu                from "../AssetSelector/AssetMenu";

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
	const destinationChain = useRecoilValue<IChainInfo | null>(ChainSelection(DESTINATION_TOKEN_KEY));
	const chainList = useRecoilValue(ChainList);
	const [sourceAsset, setSourceAsset] = useRecoilState(SourceAsset);
	const resetSourceAsset = useResetRecoilState(SourceAsset);

	const dropdownOptions: IDropdownOption[] = chainList
	.map((supportedChain: IChainInfo) => ({
		title: supportedChain.chainName,
		symbol: supportedChain.chainSymbol,
		active: false,
		disabled: (isSourceChain ? destinationChain : sourceChain)?.chainName === supportedChain.chainName,
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
			dropdownOptions={dropdownOptions}
		/>}
	</StyledChainSelectionIconWidget>;

	const assetSelectorWidget = () => <StyledChainSelectionIconWidget>
		<AssetSelector/>
		<ModalWidget
			modaltext={sourceAsset
				? `${sourceAsset?.assetName} (${sourceAsset?.assetSymbol})`
				: `Select asset`}
			children={<AssetMenu/>}
		/>
	</StyledChainSelectionIconWidget>;

	const contents = <>
		<div style={{marginLeft: `10px`, marginBottom: `10px`}}>{props.label}</div>
		{isSourceChain
			? <FlexRow style={{width: `100%`}}>
				{chainSelectorWidget()}
				{assetSelectorWidget()}
			</FlexRow>
			: chainSelectorWidget()
		}
	</>;

	return <StyledChainSelectionComponent animate={props.animate}>
		{!props.hideContents && contents}
	</StyledChainSelectionComponent>

}

export default ChainSelector;