import { useRecoilValue } from "recoil"
import { SVGImage } from "components/Widgets/SVGImage"
import { ChainSelection, SourceAsset } from "state/ChainSelection"
import { BaseSelector } from "../BaseSelector"
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
      image={<SVGImage height={"1.55em"} width={"1.55em"} src={image} />}
      label={
        selectedToken
          ? getAssetSymbolToShow(
              sourceChain as ChainInfo,
              destChain as ChainInfo,
              selectedToken,
              selectedToken?.assetName
            )
          : `Select asset`
      }
    />
  )
}

export default AssetSelector
