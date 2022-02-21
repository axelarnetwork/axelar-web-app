import React, { useImperativeHandle, useState } from "react"
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil"
import { AssetInfo, ChainInfo } from "@axelar-network/axelarjs-sdk"
import { DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY } from "config/consts"
import AssetSelector from "components/CompositeComponents/Selectors/AssetSelector"
import { FlexSpaceBetween } from "components/StyleComponents/FlexSpaceBetween"
import SearchComponent, {
  ISearchItem,
} from "components/Widgets/SearchComponent"
import { SVGImage } from "components/Widgets/SVGImage"
import { ChainSelection, SourceAsset } from "state/ChainSelection"
import { ChainList } from "state/ChainList"
import { StyledChainSelectionComponent } from "./StyleComponents/StyledChainSelectionComponent"
import { StyledChainSelectionIconWidget } from "./StyleComponents/StyledChainSelectionIconWidget"
import { SelectedChainLogoAndText } from "./SelectedChainLogoAndText"

interface IChainSelectorProps {
  id: string
  label: string
  animate?: boolean
  hideContents?: boolean
  ref: any
  closeOtherWindow: () => void
}

const ChainSelector = React.forwardRef((props: IChainSelectorProps, ref) => {
  const isSourceChain: boolean = props.id === SOURCE_TOKEN_KEY
  const [selectedChain, setSelectedChain] = useRecoilState<ChainInfo | null>(
    ChainSelection(props.id)
  )
  const sourceChain = useRecoilValue<ChainInfo | null>(
    ChainSelection(SOURCE_TOKEN_KEY)
  )
  const destinationChain = useRecoilValue<ChainInfo | null>(
    ChainSelection(DESTINATION_TOKEN_KEY)
  )
  const resetDestinationChain = useResetRecoilState(
    ChainSelection(DESTINATION_TOKEN_KEY)
  )
  const chainList = useRecoilValue(ChainList)
  const [sourceAsset, setSourceAsset] = useRecoilState(SourceAsset)
  const resetSourceAsset = useResetRecoilState(SourceAsset)
  const [showAssetSearchBox, setShowAssetSearchBox] = useState<boolean>(false)
  const [showChainSelectorSearchBox, setShowChainSelectorSearchBox] =
    useState<boolean>(false)
  const initialAssetList: AssetInfo[] =
    chainList?.find((chain) => chain?.chainName === sourceChain?.chainName)
      ?.assets || []

  /*closeAllSearchWindows is a ref method called
	  from the parent component (UserInputWindow/index.tsx)
	  to programmatically close the asset search windows */
  useImperativeHandle(ref, () => ({
    closeAllSearchWindows() {
      setShowChainSelectorSearchBox(false)
      setShowAssetSearchBox(false)
    },
  }))

  let filteredChainList: ChainInfo[] = chainList

  /*for the destination chain, if source chain and source asset are selected,
   * only enable chains which also have that asset, based on common_key
   * */
  if (!!sourceChain && !!sourceAsset && !isSourceChain) {
    filteredChainList = filteredChainList.filter((supportedChain) => {
      const assetsInSupportedChain: AssetInfo[] = supportedChain.assets || []
      return assetsInSupportedChain
        .map((asset) => asset.common_key)
        .includes(sourceAsset.common_key)
    })
  }
  const chainDropdownOptions: ISearchItem[] = filteredChainList.map(
    (supportedChain: ChainInfo) => ({
      title: supportedChain.chainName,
      active: false,
      icon: require(`assets/svg/logos/${supportedChain?.chainSymbol}.svg`)
        ?.default,
      disabled: false,
      onClick: () => {
        setSelectedChain(supportedChain)

        /* if the selected chain is the source token and the chain only
					has a single asset, select that asset */
        if (isSourceChain) {
          supportedChain?.assets?.length === 1
            ? setSourceAsset(supportedChain.assets[0])
            : resetSourceAsset()
        }
      },
    })
  )

  /*only show the chain selector widget if the asset selector search box is not open*/
  const chainSelectorWidget = () => {
    const onClick = () => {
      props.closeOtherWindow()
      /*if you're about to toggle open the chain selector search box
       * and the asset search box is already open, close the asset search box first */
      if (!showChainSelectorSearchBox && showAssetSearchBox)
        setShowAssetSearchBox(false)
      setShowChainSelectorSearchBox(!showChainSelectorSearchBox)
    }
    return (
      <StyledChainSelectionIconWidget>
        <div style={{ cursor: `pointer` }} onClick={onClick}>
          <SelectedChainLogoAndText chainInfo={selectedChain} />
        </div>
        <SVGImage
          style={{ cursor: `pointer` }}
          onClick={onClick}
          src={
            require(showChainSelectorSearchBox
              ? `assets/svg/drop-up-arrow.svg`
              : `assets/svg/drop-down-arrow.svg`)?.default
          }
          height={"0.75em"}
          width={"0.75em"}
        />
      </StyledChainSelectionIconWidget>
    )
  }

  /*only show the asset selector widget if the chain selector search box is not open*/
  const assetSelectorWidget = (shouldHide: boolean) => {
    const onClick = () => {
      props.closeOtherWindow()
      /*if you're about to toggle open the asset selector search box
       * and the chain search box is already open, close the chain search box first */
      if (!showAssetSearchBox && showChainSelectorSearchBox)
        setShowChainSelectorSearchBox(false)
      setShowAssetSearchBox(!showAssetSearchBox)
    }
    return (
      <StyledChainSelectionIconWidget hide={shouldHide}>
        <div style={{ cursor: `pointer` }} onClick={onClick}>
          <AssetSelector />
        </div>
        <SVGImage
          style={{ cursor: `pointer` }}
          onClick={onClick}
          src={
            require(showAssetSearchBox
              ? `assets/svg/drop-up-arrow.svg`
              : `assets/svg/drop-down-arrow.svg`)?.default
          }
          height={"0.75em"}
          width={"0.75em"}
        />
      </StyledChainSelectionIconWidget>
    )
  }

  return (
    <StyledChainSelectionComponent>
      <div style={{ margin: `10px`, color: `#898994`, fontSize: `0.8em` }}>
        {props.label}
      </div>
      <FlexSpaceBetween style={{ width: `100%`, marginRight: `5px` }}>
        {chainSelectorWidget()}
        {isSourceChain ? assetSelectorWidget(!sourceChain) : <></>}
      </FlexSpaceBetween>

      {/*search dropdown for chain selection*/}
      <SearchComponent
        show={showChainSelectorSearchBox}
        allItems={chainDropdownOptions}
        handleClose={() => setShowChainSelectorSearchBox(false)}
      />

      {/*search dropdown for asset selection*/}
      <SearchComponent
        show={showAssetSearchBox}
        allItems={initialAssetList
          .filter((asset: AssetInfo) =>
            process.env.REACT_APP_STAGE === "mainnet"
              ? asset.fullySupported
              : true
          )
          .map((asset: AssetInfo) => {
            return {
              title: asset.assetName as string,
              symbol: asset.assetSymbol as string,
              active: false,
              icon: require(`assets/svg/tokenAssets/${asset?.common_key}.svg`)
                ?.default,
              disabled: false,
              onClick: () => {
                // if you happen to select a source asset that isn't supported on the destination chain, reset the dest chain selection
                if (
                  isSourceChain &&
                  !destinationChain?.assets?.find(
                    (destAsset) => destAsset?.common_key === asset?.common_key
                  )
                ) {
                  resetDestinationChain()
                }
                setSourceAsset(asset)
              },
            }
          })}
        handleClose={() => setShowAssetSearchBox(false)}
      />
    </StyledChainSelectionComponent>
  )
})

export default ChainSelector
