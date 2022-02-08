import styled, { ThemedStyledProps } from "styled-components"
import { cloneElement, useCallback, useState } from "react"
import { StyledCentered } from "../StyleComponents/Centered"

const AnchorText = styled.div`
  cursor: pointer;
  padding: 1px;
  box-sizing: border-box;
  &:hover {
    background-color: rgba(82, 82, 82, 0.5);
    border-radius: 5px;
    color: black;
  }
`

const TooltipText = styled.div`
  white-space: nowrap;
  bottom: 0;
  visibility: hidden;
  color: transparent;
  background-color: transparent;
  padding: 0.1em 0.1em;
  margin: 0.25em 0.25em;
  border-radius: 4px;
  width: 100%;
  ${StyledCentered}
  transform: translateY(-5px);
  transition: all 0.1s ease-in-out;
`

export interface ITooltipProps extends ThemedStyledProps<any, any> {
  margin: string
}

const TooltipContainer = styled.div<ITooltipProps>`
  position: relative;
  background-color: transparent;
  & ${AnchorText}:hover + ${TooltipText} {
    visibility: visible;
    transform: translateY(0px);
  }
  width: ${(props) => (props.width ? props.width : `100%`)};
`

const SpanText = styled.span`
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 2.5px;
  border-radius: 5px;
`

interface ITooltip {
  anchorContent: JSX.Element | string
  tooltipText: string
  tooltipAltText: string
  width?: string
}

const Tooltip = ({
  anchorContent,
  tooltipText,
  tooltipAltText,
  width,
}: ITooltip) => {
  const [textToShow, setTextToShow] = useState(tooltipText)

  const updateTextToShow = useCallback(() => {
    setTextToShow(tooltipAltText)
    setTimeout(() => setTextToShow(tooltipText), 2000)
  }, [setTextToShow, tooltipText, tooltipAltText])

  return (
    <TooltipContainer width={width}>
      <AnchorText>
        {cloneElement(anchorContent as JSX.Element, {
          cbOnClick: updateTextToShow,
        })}
      </AnchorText>
      <TooltipText>
        <SpanText>{textToShow}</SpanText>
      </TooltipText>
    </TooltipContainer>
  )
}

export default Tooltip
