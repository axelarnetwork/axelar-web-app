import React                                                                    from "react";
import {useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState} from "recoil";
import {IChainInfo}                                                             from "@axelar-network/axelarjs-sdk";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}             from "config/consts";
import AssetSelector
                                            from "component/CompositeComponents/Selectors/AssetSelector";
import {FlexRow}                            from "component/StyleComponents/FlexRow";
import DropdownComponent, {IDropdownOption} from "component/Widgets/DropdownComponent";
import {ChainSelection, SourceAsset}        from "state/ChainSelection";
import {ChainList}                          from "state/ChainList";
import {StyledChainSelectionComponent}      from "../StyledChainSelectionComponent";
import {StyledChainSelectionIconWidget}     from "./StyleComponents/StyledChainSelectionIconWidget";
import {SelectedChainComponent}             from "./SelectedChainComponent";
import AssetMenu                            from "../AssetSelector/AssetMenu";
import ModalContainer                       from "../../../Widgets/BasicModal/ModalContainer";

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
	const setSourceAsset = useSetRecoilState(SourceAsset);
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

	const assetSelectorWidget = (shouldHide: boolean) => <StyledChainSelectionIconWidget hide={shouldHide}>
			<AssetSelector/>
			<ModalContainer>
				<AssetMenu />
			</ModalContainer>
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
	</StyledChainSelectionComponent>

}

export default ChainSelector;