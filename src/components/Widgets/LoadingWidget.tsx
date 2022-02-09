import React, { useCallback, useState } from "react"
import { SVGImage } from "components/Widgets/SVGImage"

const LoadingWidget = ({ cb }: { cb: () => void }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onClick = useCallback(() => {
    setIsLoading(true)
    cb && cb()
    setTimeout(() => setIsLoading(false), 1000)
  }, [cb])

  return (
    <span onClick={onClick}>
      {isLoading ? (
        <SVGImage
          src={require(`assets/svg/refresh-loading.svg`).default}
          width={`1em`}
          height={`1em`}
          style={{ marginLeft: `0.5em` }}
        />
      ) : (
        <SVGImage
          src={require(`assets/svg/refresh.svg`).default}
          width={`1em`}
          height={`1em`}
          style={{ cursor: `pointer`, marginLeft: `0.5em` }}
        />
      )}
    </span>
  )
}

export default LoadingWidget
