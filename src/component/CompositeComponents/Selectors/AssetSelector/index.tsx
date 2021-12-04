import {useRecoilValue}              from "recoil";
import {SVGImage}                    from "component/Widgets/SVGImage";
import {SOURCE_TOKEN_KEY}            from "config/consts";
import {ChainSelection, SourceAsset} from "state/ChainSelection";
import {BaseSelector}                from "../BaseSelector";

const AssetSelector = () => {

	const selectedToken = useRecoilValue(SourceAsset);
	const chainInfo = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));

	let image;

	try {
		image = require(`resources/logos/${chainInfo?.chainSymbol}/assets/${selectedToken?.assetSymbol}.svg`)?.default;
	} catch (e) {
		image = require(`resources/select-asset-eyes.svg`)?.default;
	}

	return <BaseSelector
		image={<SVGImage height={"1.5em"} width={"1.5em"} src={image}/>}
		label={selectedToken
			? `${selectedToken?.assetName}`
			: `Select asset`}
	/>;

};

export default AssetSelector;