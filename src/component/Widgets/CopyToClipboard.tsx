import copy from "copy-to-clipboard"
import { SVGImage } from "./SVGImage"
import styled from "styled-components"

const StyledSVGImage = styled(SVGImage)`
  cursor: pointer;
`

interface ICopyToClipboardProps {
  height: string
  width: string
  margin?: string
  textToCopy: string
  showImage: boolean
  JSXToShow?: JSX.Element
  cbOnClick?: (...args: any[]) => void
}

const CopyToClipboardImage = (props: ICopyToClipboardProps) => {
  const { cbOnClick, height, JSXToShow, margin, width, showImage, textToCopy } =
    props

  const onClick = () => {
    copy(textToCopy)
    cbOnClick && cbOnClick()
  }

  return showImage ? (
    <div onClick={onClick}>
      {JSXToShow}
      <StyledSVGImage
        height={height}
        width={width}
        margin={margin}
        src={require(`assets/svg/copy-to-clipboard.svg`).default}
      />
    </div>
  ) : (
    <div onClick={onClick}>{JSXToShow || textToCopy}</div>
  )
}

export default CopyToClipboardImage
