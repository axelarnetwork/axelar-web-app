import { useRecoilValue } from "recoil"
import styled, { ThemedStyledProps } from "styled-components"
import BoldSpan from "components/StyleComponents/BoldSpan"
import { DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY } from "config/consts"
import screenConfigs from "config/screenConfigs"
import { ChainSelection, SourceAsset } from "state/ChainSelection"
import { getMinDepositAmount } from "utils/getMinDepositAmount"
import { getAssetSymbolToShow } from "utils/getAssetSymbolToShow"
import { AssetInfo, ChainInfo } from "@axelar-network/axelarjs-sdk"
import { feeBySourceChain } from "config/feeBySourceChain"

interface IStyledTransferFeeDividerProps extends ThemedStyledProps<any, any> {
  nextState?: boolean
  showContents?: boolean
}

export const StyledTransferFeeDivider = styled.div<IStyledTransferFeeDividerProps>`
  position: relative;
  width: 99%;
  padding: 0.25em;
  box-sizing: border-box;
  height: auto;
  font-size: 0.7em;
  border-radius: 5px;
  border: solid 1px #e2e1e2;
  opacity: ${(props) => (props.showContents ? `1` : `0`)};
  ${(props) => (props.showContents ? `transition: opacity 1000ms;` : ``)}

  @media ${screenConfigs.media.desktop} {
    font-size: 0.9em;
  }
  @media ${screenConfigs.media.laptop} {
  }
  @media ${screenConfigs.media.tablet} {
    margin-top: -10px;
  }
  @media ${screenConfigs.media.mobile} {
    margin-top: -10px;
  }
`

const TransactionInfo = () => {
  const srcChainSelection = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY))
  const destChainSelection = useRecoilValue(
    ChainSelection(DESTINATION_TOKEN_KEY)
  )
  const selectedSrcAsset = useRecoilValue(SourceAsset)
  // const [srcFee, setSrcFee] = useState(0)
  // const [destFee, setDestFee] = useState(0)

  const minDeposit: number | null = getMinDepositAmount(
    selectedSrcAsset,
    srcChainSelection,
    destChainSelection
  )

  // async function getFees(chainName: string, assetCommonKey: string, cb: any) {
  //   let response = await TransferAssetBridgeFacade.getFeeForChainAndAsset(chainName, assetCommonKey)
  //   cb(response?.fee_info?.min_fee)
  // }

  // useEffect(() => {
  //   if (srcChainSelection && selectedSrcAsset?.common_key) getFees(srcChainSelection.chainName.toLowerCase(), selectedSrcAsset.common_key, setSrcFee)
  //   if (destChainSelection && selectedSrcAsset?.common_key) getFees(destChainSelection.chainName.toLowerCase(), selectedSrcAsset.common_key, setDestFee)

  // }, [srcChainSelection, destChainSelection, selectedSrcAsset])

  return (
    <StyledTransferFeeDivider
      showContents={
        !!(srcChainSelection && selectedSrcAsset && destChainSelection)
      }
    >
      <div style={{ display: `flex`, flexDirection: `column` }}>
        {generateInfoLine(
          "Relayer Gas Fee",
          `${minDeposit} 
          ${getAssetSymbolToShow(
            srcChainSelection as ChainInfo,
            destChainSelection as ChainInfo,
            selectedSrcAsset as AssetInfo,
            selectedSrcAsset?.assetSymbol
          )}`
        )}
        {generateInfoLine(
          "Wait Time",
          feeBySourceChain(srcChainSelection as ChainInfo)
        )}
      </div>
    </StyledTransferFeeDivider>
  )
}

const generateInfoLine = (headerColumn: string, contents: string) => (
  <div style={{ display: `flex`, justifyContent: `space-between` }}>
    <div style={{ margin: `3px`, color: `#898994` }}>{headerColumn}</div>
    <div>
      <BoldSpan>{contents}</BoldSpan>
    </div>
  </div>
)

export default TransactionInfo
