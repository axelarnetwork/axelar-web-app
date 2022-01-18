import React, {useMemo, useState}                from "react";
import {useRecoilValue, useSetRecoilState}       from "recoil";
import styled, {ThemedStyledProps}               from "styled-components";
import {AssetInfo, ChainInfo}                    from "@axelar-network/axelarjs-sdk";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY} from "config/consts";
import screenConfigs                             from "config/screenConfigs";
import {topFlowOptions}                          from "config/topFlowOptions";
import {FlexRow}                                 from "component/StyleComponents/FlexRow";
import BoldSpan                                  from "component/StyleComponents/BoldSpan";
import {SVGImage}                                from "component/Widgets/SVGImage";
import Tooltip                                   from "component/Widgets/Tooltip";
import {ChainList}                               from "state/ChainList";
import {ChainSelection, SourceAsset}             from "state/ChainSelection";

interface IStyledDivProps extends ThemedStyledProps<any, any> {
	appear?: any;
}

const StyledHelperComponent = styled.div<IStyledDivProps>`
    position: absolute;
    z-index: 15;
    top: 0px;
    right: 0px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    box-sizing: border-box;
	padding: 0.4em;
	border-radius: ${props => props.appear ? `7px` : `50px`};
	width: ${props => props.appear ? `70%` : `auto`};
	background-color: ${props => props.appear ? `none` : props.theme.headerBackgroundColor};
	color: ${props => props.appear ? `black` : `white`};

    @media ${screenConfigs.media.desktop} {
        margin-top: 0.75em;
        font-size: 1.1em;
	}
`;

const TopFlowsPopup = styled.div<IStyledDivProps>`
	overflow-wrap: break-word;
    font-size: 0.9em;
    border-radius: 50px 0px 50px 50px;
	opacity: ${props => props.appear ? 1 : 0};
	height: 100%;
	width: ${props => props.appear ? `100%` : `0px`};
	margin-top: ${props => props.appear ? `5px` : `0px`};
	background-color: ${props => props.appear ? `rgba(0, 0, 0, 0.05)` : `none`};
	transform: ${props => props.appear ? `translateY(0px); translateX(0px)` : `translateY(-10px); translateX(-50px)`};
    transition: all 500ms;
`;

const TopFlowsToggle = styled(FlexRow)`
	cursor: pointer;
`;

const FlowOptionList = styled(FlexRow)`
	box-sizing: border-box;
	padding: 0.5em;
	flex-wrap: wrap;
`;

const FlowOptionChainContainer = styled(FlexRow)`
`;

const StyledFlowOption = styled.div`
	cursor: pointer;
	font-size: 0.75em;
	border-radius: 10px;
	border: solid 0.6px #b9bac8;
	box-sizing: border-box;
	padding: 5px;
	background-color: white;
`;

interface IFlowOptionProps {
	assetCommonKey: string;
	assetSymbol: string;
	sourceChainName: string;
	destinationChainName: string;
	sourceChainSymbol: string;
	destinationChainSymbol: string;
	onClick: any;
}

const FlowOption = (props: IFlowOptionProps) => {

	const {
		assetCommonKey,
		assetSymbol,
		sourceChainName,
		sourceChainSymbol,
		destinationChainSymbol,
		destinationChainName
	} = props;
	const dimension: string = `1.75em`;

	return <Tooltip
		anchorContent={<StyledFlowOption onClick={() => props.onClick(props)}>
			<FlexRow style={{marginBottom: `10px`}}>
				<SVGImage width={dimension} height={dimension}
				          src={require(`resources/tokenAssets/${assetCommonKey}.svg`).default}
				/>
				<BoldSpan style={{marginLeft: `10px`}}>{assetSymbol}</BoldSpan>
			</FlexRow>
			<FlowOptionChainContainer>
				<SVGImage width={dimension} height={dimension}
				          src={require(`resources/logos/${sourceChainSymbol}.svg`).default}/>
				<div style={{margin: `0px 10px 0px 10px`}}><img
					src={require(`resources/transaction_status_logos/transferring-icon.svg`)?.default} alt={""}/></div>
				<SVGImage width={dimension} height={dimension}
				          src={require(`resources/logos/${destinationChainSymbol}.svg`).default}/>
			</FlowOptionChainContainer>
		</StyledFlowOption>}
		tooltipText={`${sourceChainName} to ${destinationChainName}`}
		tooltipAltText={""}
	/>
}

const TopFlowsSelector = ({closeAllSearchWindows}: { closeAllSearchWindows: () => void }) => {

	const [showFlows, setShowFlows] = useState(false);

	const chainList = useRecoilValue<ChainInfo[]>(ChainList);
	const setSourceChain = useSetRecoilState(ChainSelection(SOURCE_TOKEN_KEY));
	const setDestinationChain = useSetRecoilState(ChainSelection(DESTINATION_TOKEN_KEY));
	const setSourceAsset = useSetRecoilState(SourceAsset);

	const topChainsMap = useMemo(() => {

		const map: { [key: string]: ChainInfo } = {};
		map.Terra = chainList.find(chainInfo => chainInfo.chainName === "Terra") as ChainInfo;
		map.Ethereum = chainList.find(chainInfo => chainInfo.chainName === "Ethereum") as ChainInfo;
		map.Axelar = chainList.find(chainInfo => chainInfo.chainName === "Axelar") as ChainInfo;
		map.Fantom = chainList.find(chainInfo => chainInfo.chainName === "Fantom") as ChainInfo;
		map.Avalanche = chainList.find(chainInfo => chainInfo.chainName === "Avalanche") as ChainInfo;
		return map;

	}, [chainList]);

	const onClick = (selection: IFlowOptionProps) => {
		const map = topChainsMap;
		setSourceChain(map[selection.sourceChainName]);
		setDestinationChain(map[selection.destinationChainName]);
		setSourceAsset(map[selection.sourceChainName]?.assets?.find(asset => asset.common_key === selection.assetCommonKey) as AssetInfo);
		setShowFlows(false);
		closeAllSearchWindows();
	};

	return <StyledHelperComponent appear={showFlows}
	                              onMouseLeave={() => setShowFlows(false)}
	                              onMouseEnter={() => !showFlows && setShowFlows(true)}
	                              className={"joyride-top-flows"}
	>
		<TopFlowsToggle onClick={() => setShowFlows(!showFlows)}>
			<img src={require(`resources/active-eye-blue.svg`).default} alt={""} width={`12px`} height={`12px`}/>
			<div style={{marginLeft: `5px`, fontSize: `0.75em`}}>Top Flows</div>
		</TopFlowsToggle>

		<TopFlowsPopup appear={showFlows}>
			{showFlows && <FlowOptionList>{
				topFlowOptions.map((flowOption) => {
					return <FlowOption
						key={`flow-option-${flowOption.common_key}-${flowOption.sourceChainSymbol}-${flowOption.destinationChainSymbol}`}
						onClick={onClick}
						assetCommonKey={flowOption.common_key}
						assetSymbol={flowOption.assetSymbol}
						sourceChainName={flowOption.sourceChainName}
						sourceChainSymbol={flowOption.sourceChainSymbol}
						destinationChainName={flowOption.destinationChainName}
						destinationChainSymbol={flowOption.destinationChainSymbol}
					/>
				})
			}</FlowOptionList>}
		</TopFlowsPopup>
	</StyledHelperComponent>;
}

export default TopFlowsSelector;