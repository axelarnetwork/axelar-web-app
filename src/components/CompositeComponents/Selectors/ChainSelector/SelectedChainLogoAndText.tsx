import { ChainInfo } from "@axelar-network/axelarjs-sdk"
import { SVGImage } from "components/Widgets/SVGImage"
import { BaseSelector } from "../BaseSelector"

interface IChainComponentProps {
  chainInfo: ChainInfo | null
}

export const SelectedChainLogoAndText = (props: IChainComponentProps) => {
  let image
  try {
    image =
      require(`assets/svg/logos/${props.chainInfo?.chainSymbol}.svg`)?.default
  } catch (e) {
    image = require(`assets/svg/select-chain-eye.svg`)?.default
  }

  return (
    <BaseSelector
      image={<SVGImage height={`1.5em`} width={`1.5em`} src={image} />}
      label={props.chainInfo?.chainName || "Select Chain"}
    />
  )
}
