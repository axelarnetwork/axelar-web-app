import { cloneElement, useCallback, useState } from "react"
import ReactTooltip from "react-tooltip"
import { v4 } from "uuid"

interface ITooltip {
  anchorContent: JSX.Element | string
  tooltipText: JSX.Element | string
  tooltipAltText: JSX.Element | string
}

export const ImprovedTooltip = ({
  anchorContent,
  tooltipText,
  tooltipAltText,
}: ITooltip) => {
  const [clicked, setClicked] = useState(false)
  const [id,] = useState(v4())

  const updateTextToShow = useCallback(() => {
    setClicked(true)
    setTimeout(() => setClicked(false), 5000)
  }, [setClicked])

  return (
    <span>
      <span
        style={{ cursor: `pointer`, display: `inline-block` }}
        data-tip={tooltipText}
        data-for={id}
      >
        {cloneElement(anchorContent as JSX.Element, {
          cbOnClick: updateTextToShow,
        })}
      </span>
      <ReactTooltip
        className={"width-override"}
        id={id}
        getContent={() => {
          return clicked ? tooltipAltText : tooltipText
        }}
      />
    </span>
  )
}
