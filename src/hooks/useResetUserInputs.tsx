import { useResetRecoilState } from "recoil"
import { DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY } from "config/consts"
import {
  ChainSelection,
  DestinationAddress,
  SourceAsset,
} from "state/ChainSelection"
import {
  DidWaitingForDepositTimeout,
  HasEnoughDepositConfirmation,
  NumberConfirmations,
  SourceDepositAddress,
} from "state/TransactionStatus"

const useResetUserInputs = () => {
  const resetSourceTokenKey = useResetRecoilState(
    ChainSelection(SOURCE_TOKEN_KEY)
  )
  const resetDestTokenKey = useResetRecoilState(
    ChainSelection(DESTINATION_TOKEN_KEY)
  )
  const resetSourceNumConfirmations = useResetRecoilState(
    NumberConfirmations(SOURCE_TOKEN_KEY)
  )
  const resetDestNumConfirmations = useResetRecoilState(
    NumberConfirmations(DESTINATION_TOKEN_KEY)
  )
  const resetSourceDepositAddress = useResetRecoilState(SourceDepositAddress)
  const resetDestAddress = useResetRecoilState(DestinationAddress)
  const resetSourceAsset = useResetRecoilState(SourceAsset)
  const resetHasEnoughDepositonfirmation = useResetRecoilState(HasEnoughDepositConfirmation)
  const resetTransactionTimeout = useResetRecoilState(
    DidWaitingForDepositTimeout
  )

  return () => {
    resetSourceTokenKey()
    resetDestTokenKey()
    resetDestAddress()
    resetSourceAsset()
    resetSourceNumConfirmations()
    resetDestNumConfirmations()
    resetSourceDepositAddress()
    resetTransactionTimeout()
    resetHasEnoughDepositonfirmation()
  }
}

export default useResetUserInputs
