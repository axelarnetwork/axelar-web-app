import { useRecoilValue } from "recoil"
import { FlexRow } from "components/StyleComponents/FlexRow"
import { SVGImage } from "components/Widgets/SVGImage"
import { ChainSelection, SourceAsset } from "state/ChainSelection"
import { BaseSelector } from "../BaseSelector"
import { ReactElement } from "react"
import { DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY } from "config/consts"
import { getAssetSymbolToShow } from "utils/getAssetSymbolToShow"
import { ChainInfo } from "@axelar-network/axelarjs-sdk"

const AssetSelector = () => {
  const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY))
  const destChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY))
  const selectedToken = useRecoilValue(SourceAsset)

  let image

  try {
    image =
      require(`assets/svg/tokenAssets/${selectedToken?.common_key}.svg`)?.default
  } catch (e) {
    image = require(`assets/svg/select-asset-eyes.svg`)?.default
  }

  /**
   * For the label, if source chain is cosmos and token is native to the destination chain,
   * then use the symbol representation for the destination chain
   */
  return (
    <BaseSelector
      image={<SVGImage height={"1.75em"} width={"1.75em"} src={image} />}
      label={
        selectedToken
          ? getAssetSymbolToShow(
              sourceChain as ChainInfo,
              destChain as ChainInfo,
              selectedToken,
              wrapAssetName(selectedToken?.assetName || "")
            )
          : `Select asset`
      }
    />
  )
}

const wrapAssetName = (assetName: string): ReactElement => {
  const splitName = assetName?.split(" ") || []

  return (
    <>
      {splitName.length > 1 ? (
        <FlexRow style={{ justifyContent: `flex-start` }}>
          <span>{splitName[0]} </span>
          <span
            style={{
              fontSize: `0.55em`,
              width: `45%`,
              overflowWrap: `break-word`,
              marginLeft: `0.5em`,
              whiteSpace: "normal",
            }}
          >
            {splitName[1]?.replace("-", " ")}
          </span>
        </FlexRow>
      ) : (
        assetName
      )}
    </>
  )
}

export default AssetSelector
