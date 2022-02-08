import { useRecoilValue } from "recoil"
import { FlexRow } from "component/StyleComponents/FlexRow"
import { SVGImage } from "component/Widgets/SVGImage"
import { SourceAsset } from "state/ChainSelection"
import { BaseSelector } from "../BaseSelector"
import { ReactElement } from "react"

const AssetSelector = () => {
  const selectedToken = useRecoilValue(SourceAsset)

  let image

  try {
    image =
      require(`resources/tokenAssets/${selectedToken?.common_key}.svg`)?.default
  } catch (e) {
    image = require(`resources/select-asset-eyes.svg`)?.default
  }

  return (
    <BaseSelector
      image={<SVGImage height={"1.75em"} width={"1.75em"} src={image} />}
      label={
        selectedToken
          ? wrapAssetName(selectedToken?.assetName || "")
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
