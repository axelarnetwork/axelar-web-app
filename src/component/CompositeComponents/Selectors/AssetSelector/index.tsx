import {useRecoilValue} from "recoil";
import {SVGImage}       from "component/Widgets/SVGImage";
import {SourceAsset}    from "state/ChainSelection";
import {BaseSelector}   from "../BaseSelector";

const AssetSelector = () => {

	const selectedToken = useRecoilValue(SourceAsset);

	let image;

	try {
		image = require(`resources/tokenAssets/${selectedToken?.common_key}.svg`)?.default;
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