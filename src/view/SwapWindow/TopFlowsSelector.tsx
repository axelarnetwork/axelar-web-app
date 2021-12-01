import React, {useCallback}                from "react";
import Dropdown                            from "react-dropdown";
import {FlexRow}                           from "component/StyleComponents/FlexRow";
import {SVGImage}                          from "component/Widgets/SVGImage";
import styled                              from "styled-components";
import "./UserInputWindow/dropdown.css";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {IAssetInfo, IChainInfo}            from "@axelar-network/axelarjs-sdk";
import {ChainList}                         from "../../state/ChainList";
import {ChainSelection, SourceAsset}             from "../../state/ChainSelection";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY} from "../../config/consts";

const TopFlowSelector = styled.div`
	position: absolute;
	width: 100%; 
	top: 0px;
	right: 0px;
	z-index: 10;
`;

const TopFlowOptionsToggle = styled(FlexRow)`
	background-color: white;
	border: 3px solid black;
	border-radius: 5px;
	box-sizing: border-box;
	padding: 2.5px;
`;

const TopFlowsSelectorWidget = () => {

	const chainList = useRecoilValue<IChainInfo[]>(ChainList);
	const setSourceChain = useSetRecoilState(ChainSelection(SOURCE_TOKEN_KEY));
	const setDestinationChain = useSetRecoilState(ChainSelection(DESTINATION_TOKEN_KEY));
	const setSourceAsset = useSetRecoilState(SourceAsset);
	const getChainMap = useCallback(() => {

		const map: { [key: string]: IChainInfo } = {};
		map.terra = chainList.find(chainInfo => chainInfo.chainName.toLowerCase() === "terra") as IChainInfo;
		map.ethereum = chainList.find(chainInfo => chainInfo.chainName.toLowerCase() === "ethereum") as IChainInfo;
		return map;

	}, [chainList]);
	const onChange = (e: any) => {
		const map = getChainMap();
		const options = JSON.parse(e.value);
		setSourceChain(map[options.sourceChain]);
		setDestinationChain(map[options.destinationChain]);
		setSourceAsset(map[options.sourceChain]?.assets?.find(asset => asset.common_key === options.common_key) as IAssetInfo);

	};



	return <TopFlowSelector>
		<Dropdown
			options={ [
				{"label": "UST (Terra >> Ethereum)", "value": JSON.stringify({common_key: "uusd", sourceChain: "terra", destinationChain: "ethereum"}) },
				{"label": "UST (Ethereum >> Terra)", "value": JSON.stringify({common_key: "uusd", sourceChain: "ethereum", destinationChain: "terra"}) }
			] }
			onChange={onChange}
			arrowClosed={<TopFlowOptionsToggle>
				<div>Preselected popular flows </div>
				<SVGImage
					style={{cursor: `pointer`}}
					src={require(`resources/drop-down-arrow.svg`)?.default}
					height={"0.875em"}
					width={"0.875em"}
				/>
			</TopFlowOptionsToggle>}
			arrowOpen={<span className="arrow-open" />}
		/>
	</TopFlowSelector>
}

export default TopFlowsSelectorWidget;