/*
This component makes the API call to the SDK
* */
import { useCallback } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { TransferAssetBridgeFacade } from "api/TransferAssetBridgeFacade"
import { DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY } from "config/consts"
import {
  ChainSelection,
  DestinationAddress,
  SourceAsset,
} from "state/ChainSelection"
import { IsTxSubmitting, SourceDepositAddress } from "state/TransactionStatus"
import { ShowTransactionStatusWindow } from "../state/ApplicationStatus"

export default function usePostTransactionToBridge() {
  const [showTransactionStatusWindow, setShowTransactionStatusWindow] =
    useRecoilState(ShowTransactionStatusWindow)
  const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY))
  const destinationChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY))
  const destinationAddress = useRecoilValue(DestinationAddress)
  const setDepositAddress = useSetRecoilState(SourceDepositAddress)
  const sourceAsset = useRecoilValue(SourceAsset)
  const setIsSubmitting = useSetRecoilState(IsTxSubmitting)

  // const sCb: (
  //   status: any,
  //   setConfirms: any,
  //   traceId: string,
  //   source: boolean
  // ) => void = useCallback(
  //   (status: any, setConfirms: any, traceId: string, source: boolean): void => {
  //     //only show this message if we got a timeout before the rest of the flow has transpired
  //     if (
  //       source &&
  //       status?.timedOut &&
  //       activeStep <= 2
  //     ) {
  //       const msg = {
  //         statusCode: 408,
  //         message:
  //           "Timed out waiting for your deposit... If you believe you made your deposit before seeing this message, please reach out.",
  //         traceId,
  //       }
  //       notificationHandler.notifyInfo(msg, 0)
  //       setDidWaitingForDepositTimeout(true)
  //       return
  //     }
  //     const confirms: IConfirmationStatus = {
  //       numberConfirmations: depositConfirmCbMap[
  //         sourceChain?.chainSymbol.toLowerCase() as string
  //       ]
  //         ? depositConfirmCbMap[
  //             sourceChain?.chainSymbol.toLowerCase() as string
  //           ](status)
  //         : 1,
  //       numberRequiredConfirmations: status.axelarRequiredNumConfirmations,
  //       transactionHash: status?.transactionHash,
  //       amountConfirmedString: status?.Attributes?.amount,
  //     }
  //     setConfirms(confirms)
  //   },
  //   [
  //     activeStep,
  //     sourceChain,
  //     notificationHandler,
  //     setDidWaitingForDepositTimeout,
  //   ]
  // )

  const handleTransactionSubmission = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      setIsSubmitting(false)

      try {
        setShowTransactionStatusWindow(true)
        setDepositAddress(null)
        const payload = {
          fromChain: sourceChain?.chainName || "",
          toChain: destinationChain?.chainName || "",
          asset: sourceAsset?.common_key || "",
          destinationAddress: destinationAddress || "",
        }
        const assetAddress = await TransferAssetBridgeFacade.getDepositAddress({
          payload,
        })
        setDepositAddress({ assetAddress })
        resolve(true)
      } catch (e: any) {
        /*note: all notifications for postRequest failures are caught directly in that method*/
        setShowTransactionStatusWindow(false)
        reject(e)
      }
    })
  }, [
    setDepositAddress,
    sourceChain,
    destinationChain,
    destinationAddress,
    setShowTransactionStatusWindow,
    sourceAsset,
    setIsSubmitting,
  ])

  const closeResultsScreen = () => {
    setShowTransactionStatusWindow(false)
    window.location.reload()
  }

  return [
    showTransactionStatusWindow as boolean,
    handleTransactionSubmission as () => Promise<string>,
    closeResultsScreen as () => void,
  ] as const
}
