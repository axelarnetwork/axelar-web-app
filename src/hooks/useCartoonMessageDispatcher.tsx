import { useCallback } from "react"
import { useSetRecoilState } from "recoil"
import { MessageShownInCartoon } from "state/ApplicationStatus"

/*
TODO: not currently used but we may want to in the future. It's cute!
* */
const useCartoonMessageDispatcher = () => {
  const setMessageShownInCartoon = useSetRecoilState(MessageShownInCartoon)

  const setThenResetMessage = useCallback(
    (message: string) => {
      setMessageShownInCartoon(message)
      setTimeout(() => setMessageShownInCartoon(null), 60000)
    },
    [setMessageShownInCartoon]
  )

  return setThenResetMessage
}

export default useCartoonMessageDispatcher
