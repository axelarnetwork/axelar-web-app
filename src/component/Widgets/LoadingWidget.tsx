import React, { useCallback, useState } from "react"
import { SVGImage } from "component/Widgets/SVGImage"

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
          src={require(`resources/refresh-loading.svg`).default}
          width={`1em`}
          height={`1em`}
          style={{ marginLeft: `0.5em` }}
        />
      ) : (
        <SVGImage
          src={require(`resources/refresh.svg`).default}
          width={`1em`}
          height={`1em`}
          style={{ cursor: `pointer`, marginLeft: `0.5em` }}
        />
      )}
    </span>
  )
}

export default LoadingWidget
