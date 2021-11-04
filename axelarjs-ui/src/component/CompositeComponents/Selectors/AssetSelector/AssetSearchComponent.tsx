import {useState}         from "react";
import {IAssetInfo}       from "@axelar-network/axelarjs-sdk";
import {Input}            from "component/StyleComponents/Input";

interface IAssetSearchComponentProps {
	initialAssetList: IAssetInfo[];
	callback: (filteredAssets: IAssetInfo[]) => void;
}
const AssetSearchComponent = (props: IAssetSearchComponentProps) => {
	const [searchText, setSearchText] = useState("");

	const predicate = (asset: IAssetInfo, match: string) => {
		return !!(asset?.assetName?.toLowerCase()?.includes(match.toLowerCase()) || asset?.assetSymbol?.toLowerCase()?.includes(match.toLowerCase()));
	};

	const handleChange = (e: any) => {
		setSearchText(e.target.value);
		const filteredItems = props.initialAssetList?.filter((asset: IAssetInfo) => predicate(asset, e.target.value));
		props.callback(filteredItems);
	}

	return <Input
		name="filter-asset-input"
		placeholder="Search Assets"
		type="text"
		value={searchText}
		onChange={handleChange}
	/>;

}

export default AssetSearchComponent;