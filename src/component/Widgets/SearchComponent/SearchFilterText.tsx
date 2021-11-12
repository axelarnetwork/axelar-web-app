import {useState}                  from "react";
import styled, {ThemedStyledProps} from "styled-components";
import {IAssetInfo}                from "@axelar-network/axelarjs-sdk";
import {Input}                     from "component/StyleComponents/Input";
import {SVGImage}                  from "component/Widgets/SVGImage";

interface IStyledSearchBoxProps extends ThemedStyledProps<any, any> {
	show: boolean;
}

const StyledSearchBox = styled.div<IStyledSearchBoxProps>`
	position: relative;
	& > svg {
		position: absolute;
		left: 2px;
		top: 7px;
		fill: black;
		transition: 0.3s;
	}
	
	input:focus + svg {
		fill: dodgerBlue;
	}
	visibility: ${props => props.show ? 'visible' : 'hidden'};
	transition: all 1000ms;
`;

const StyledInput = styled(Input)`
	width: 100%;
	outline: none;
	padding: 8px;
	box-sizing: border-box;
	font-style: italic;
	font-size: 13px;
	padding-left: 25px !important;
`;

interface IAssetSearchComponentProps {
	initialAssetList: IAssetInfo[];
	callback: (filteredAssets: IAssetInfo[]) => void;
	show: boolean;
}

const SearchFilterText = (props: IAssetSearchComponentProps) => {

	const initialSearchState: string = "";
	const [searchText, setSearchText] = useState(initialSearchState);

	const predicate = (asset: IAssetInfo, match: string) => {
		return !!(asset?.assetName?.toLowerCase()?.includes(match.toLowerCase()) || asset?.assetSymbol?.toLowerCase()?.includes(match.toLowerCase()));
	};

	const handleChange = (e: any) => {
		setSearchText(e.target.value);
		const filteredItems = props.initialAssetList?.filter((asset: IAssetInfo) => predicate(asset, e.target.value));
		props.callback(filteredItems);
	}

	return <StyledSearchBox show={props.show}>
		{props.show && <>
            <SVGImage height={"15px"} width={"15px"} margin={"2.5px"}
                      src={require(`resources/search.svg`)?.default}
            />
            <StyledInput
                name="filter-asset-input"
                placeholder="Search Assets"
                type="text"
                value={searchText}
                onChange={handleChange}
            />
        </>
		}
	</StyledSearchBox>;

}

export default SearchFilterText;