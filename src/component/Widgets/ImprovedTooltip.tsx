import { cloneElement, useCallback, useState } from "react"
import ReactTooltip from "react-tooltip"

interface ITooltip {
  anchorContent: JSX.Element | string
  tooltipText: string
  tooltipAltText: string
}

export const ImprovedTooltip = ({
  anchorContent,
  tooltipText,
  tooltipAltText,
}: ITooltip) => {
  const [clicked, setClicked] = useState(false)

  const updateTextToShow = useCallback(() => {
    setClicked(true)
    setTimeout(() => setClicked(false), 2000)
  }, [setClicked])

  return (
    <div>
      <div
        style={{ cursor: `pointer`, display: `inline-block` }}
        data-tip={tooltipText}
      >
        {cloneElement(anchorContent as JSX.Element, {
          cbOnClick: updateTextToShow,
        })}
      </div>
      <ReactTooltip
        className={"width-override"}
        getContent={() => {
          return clicked ? tooltipAltText : tooltipText
        }}
      />
    </div>
  )
}
