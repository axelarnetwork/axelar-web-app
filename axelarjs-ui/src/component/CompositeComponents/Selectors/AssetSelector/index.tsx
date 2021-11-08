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
		image = require(`resources/select-chain-icon-black.svg`)?.default;
	}

	return <BaseSelector
		image={<SVGImage height={"25px"} width={"25px"} src={image} />}
		label={selectedToken
			? `${selectedToken?.assetSymbol}`
			: `Select asset`}
	/>;

};

export default AssetSelector;