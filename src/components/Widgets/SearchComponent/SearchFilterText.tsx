import { useState } from "react"
import styled, { ThemedStyledProps } from "styled-components"
import { StyledInput } from "components/StyleComponents/StyledInput"
import { SVGImage } from "components/Widgets/SVGImage"
import screenConfigs from "config/screenConfigs"
import { ISearchItem } from "./index"

interface IStyledSearchBoxProps extends ThemedStyledProps<any, any> {
  show: boolean
}

const StyledSearchBox = styled.div<IStyledSearchBoxProps>`
  position: relative;
  & > svg {
    position: absolute;
    left: 2px;
    top: 7px;
    fill: black;
    transition: 0.3s;
    @media ${screenConfigs.media.desktop} {
      top: 17px;
    }
    @media ${screenConfigs.media.laptop} {
      top: 13px;
    }
  }

  input:focus + svg {
    fill: dodgerBlue;
  }
  visibility: ${(props) => (props.show ? "visible" : "hidden")};
  width: 100%;
  padding: 5px;
  margin-top: 5px;
  border-top: solid 0.2px lightgray;

  transition: all 1000ms;
  @media ${screenConfigs.media.desktop} {
    transition: none;
  }
`

const StyledSearchInputBox = styled(StyledInput)`
  width: 100%;
  outline: none;
  padding: 8px;
  box-sizing: border-box;
  font-style: italic;
  padding-left: 2em !important;
`

interface IAssetSearchComponentProps {
  unfilteredList: ISearchItem[]
  callback: (filteredAssets: ISearchItem[]) => void
  show: boolean
  handleOnEnterPress: any
}

const SearchFilterText = (props: IAssetSearchComponentProps) => {
  const { callback, show, unfilteredList } = props

  const initialSearchState: string = ""
  const [searchText, setSearchText] = useState(initialSearchState)

  const filterPredicate = (searchItem: ISearchItem, criteriaString: string) => {
    return (
      searchItem?.title
        ?.toLowerCase()
        ?.includes(criteriaString.toLowerCase()) ||
      searchItem?.symbol?.toLowerCase()?.includes(criteriaString.toLowerCase())
    )
  }

  const handleChange = (e: any) => {
    setSearchText(e.target.value)
    callback(
      unfilteredList?.filter((item: any) =>
        filterPredicate(item, e.target.value)
      )
    )
  }

  return (
    <StyledSearchBox show={show}>
      {show && (
        <>
          <SVGImage
            height={"0.75em"}
            width={"0.75em"}
            margin={"0.25em 0px 0px 0.5em"}
            src={require(`assets/svg/search.svg`)?.default}
          />
          <StyledSearchInputBox
            name="filter-asset-input"
            placeholder="Search"
            type="text"
            value={searchText}
            onChange={handleChange}
            onKeyDown={props.handleOnEnterPress}
            autoFocus={true}
          />
        </>
      )}
    </StyledSearchBox>
  )
}

export default SearchFilterText
