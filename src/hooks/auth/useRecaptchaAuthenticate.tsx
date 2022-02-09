import { RefObject, useCallback, useEffect, useState } from "react"
import downstreamServices from "config/downstreamServices"
import { useRecoilState } from "recoil"
import { IsRecaptchaAuthenticated } from "state/TransactionStatus"
import { SendLogsToServer } from "../../api/SendLogsToServer"

declare const grecaptcha: any

const useRecaptchaAuthenticate = (inputRef?: RefObject<any>) => {
  const [isRecaptchaAuthenticated, setIsRecaptchaAuthenticated] =
    useRecoilState(IsRecaptchaAuthenticated)
  const [recaptchaV2Ref, setRecaptchaV2Ref] = useState<RefObject<any>>()

  useEffect(() => {
    if (inputRef) {
      const element = inputRef.current
      setRecaptchaV2Ref(element)
    }
  }, [inputRef])

  const authenticateWithRecaptchaV3 = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      grecaptcha.ready(async () => {
        try {
          const token: string = await grecaptcha.execute(
            downstreamServices.RECAPTCHA_V3_SITE_KEY
          )
          setIsRecaptchaAuthenticated(true)
          resolve(token)
        } catch (e: any) {
          setIsRecaptchaAuthenticated(false)
          // SendLogsToServer.error("authenticateWithRecaptchaV3_FRONTEND_ERROR_1", JSON.stringify(e), "NO_UUID");
          reject(e)
        }
      })
    })
  }, [setIsRecaptchaAuthenticated])

  const authenticateWithRecaptchaV2 = useCallback((): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        const token = await (recaptchaV2Ref as any).getValue()
        ;(recaptchaV2Ref as any).reset()
        setIsRecaptchaAuthenticated(true)
        resolve(token)
      } catch (e: any) {
        setIsRecaptchaAuthenticated(false)
        // SendLogsToServer.error("authenticateWithRecaptchaV3_FRONTEND_ERROR_2", JSON.stringify(e), "NO_UUID");
      }
    })
  }, [recaptchaV2Ref, setIsRecaptchaAuthenticated])

  return {
    isRecaptchaAuthenticated,
    authenticateWithRecaptchaV3,
    authenticateWithRecaptchaV2,
  } as const
}

export default useRecaptchaAuthenticate
