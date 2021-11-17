import {useState}                  from "react";
import styled, {ThemedStyledProps} from "styled-components";
import {Input}                     from "component/StyleComponents/Input";
import {SVGImage}                  from "component/Widgets/SVGImage";
import {ISearchItem}               from "./index";

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
	width: 100%;
    padding: 5px;
    border-top: solid 0.2px lightgray;
`;

const StyledInput = styled(Input)`
	width: 100%;
	height: 25px;
	outline: none;
	padding: 8px;
	box-sizing: border-box;
	font-style: italic;
	font-size: 13px;
	padding-left: 25px !important;
`;

interface IAssetSearchComponentProps {
	unfilteredList: ISearchItem[];
	callback: (filteredAssets: ISearchItem[]) => void;
	show: boolean;
	filterPredicate: (item: ISearchItem, matchStringCriteria: string) => boolean;
	handleOnEnterPress: any;
}

const SearchFilterText = (props: IAssetSearchComponentProps) => {

	const { callback, filterPredicate, show, unfilteredList } = props;

	const initialSearchState: string = "";
	const [searchText, setSearchText] = useState(initialSearchState);

	const handleChange = (e: any) => {
		setSearchText(e.target.value);
		callback(unfilteredList?.filter((item: any) => filterPredicate(item, e.target.value)));
	}

	return <StyledSearchBox show={show}>
		{show && <>
            <SVGImage height={"12px"} width={"12px"} margin={"5px 0px 0px 10px"}
                      src={require(`resources/search.svg`)?.default}
            />
            <StyledInput
                name="filter-asset-input"
                placeholder="Search"
                type="text"
                value={searchText}
                onChange={handleChange}
                onKeyDown={props.handleOnEnterPress}
            />
        </>
		}
	</StyledSearchBox>;

}

export default SearchFilterText;