import { useCallback, useState } from "react"
import downstreamServices from "config/downstreamServices"

const useLoadRecaptcha = () => {
  const [isRecaptchaSet, setIsRecaptchaSet] = useState(false)

  const initiateRecaptcha = useCallback(() => {
    const loadScriptByURL = (id: string, url: string, cb: () => void) => {
      const hasScriptDownloaded = document.getElementById(id)

      if (!hasScriptDownloaded) {
        const script = document.createElement("script")
        script.type = "text/javascript"
        script.src = url
        script.id = id
        script.onload = () => cb && cb()
        document.body.appendChild(script)
      }

      if (hasScriptDownloaded && cb) cb()
    }

    loadScriptByURL(
      "recaptcha-key",
      `https://www.google.com/recaptcha/api.js?render=${downstreamServices.RECAPTCHA_V3_SITE_KEY}`,
      () => setIsRecaptchaSet(true)
    )
  }, [])

  return [isRecaptchaSet, initiateRecaptcha] as const
}

export default useLoadRecaptcha
