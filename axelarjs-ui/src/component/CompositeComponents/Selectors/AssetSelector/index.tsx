import {useRecoilValue} from "recoil";
import {SVGImage}       from "component/Widgets/SVGImage";
import {SourceAsset}    from "state/ChainSelection";
import {BaseSelector}   from "../BaseSelector";

const AssetSelector = () => {

	const selectedToken = useRecoilValue(SourceAsset);

	// const image = chainId
	// 	? <SVGImage height={"25px"} width={"25px"}
	// 	            src={require(`assets/logos/${props.chainInfo?.chainSymbol}.svg`)?.default}
	// 	/>
	// 	: <SVGImage height={"20px"} width={"20px"} margin={"2.5px"}
	// 	            src={require(`assets/select-chain-icon-black.svg`)?.default}
	// 	/>;
	const image = <SVGImage height={"20px"} width={"20px"} margin={"2.5px"}
	                        src={require(`appAssets/select-chain-icon-black.svg`)?.default}
	/>;
	return <BaseSelector
		image={image}
		label={selectedToken
			? `${selectedToken?.assetSymbol}`
			: `Select asset`}
	/>;

};

export default AssetSelector;