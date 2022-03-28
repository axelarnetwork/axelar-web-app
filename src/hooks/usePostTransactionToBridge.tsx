/*
This component makes the API call to the SDK
* */

import { useCallback } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { v4 as uuidv4 } from "uuid"
import { TransferAssetBridgeFacade } from "api/TransferAssetBridgeFacade"
import { DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY } from "config/consts"
import {
  ChainSelection,
  DestinationAddress,
  SourceAsset,
} from "state/ChainSelection"
import { IsTxSubmitting, SourceDepositAddress } from "state/TransactionStatus"
import NotificationHandler from "utils/NotificationHandler"
import { ShowTransactionStatusWindow } from "../state/ApplicationStatus"
import usePersonalSignAuthenticate from "./auth/usePersonalSignAuthenticate"

class CustomError {
  private statusCode: number
  private message: string

  constructor(statusCode: number, message: string) {
    this.statusCode = statusCode
    this.message = message
  }
}
export default function usePostTransactionToBridge() {
  const [showTransactionStatusWindow, setShowTransactionStatusWindow] =
    useRecoilState(ShowTransactionStatusWindow)
  const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY))
  const destinationChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY))
  const destinationAddress = useRecoilValue(DestinationAddress)
  const setDepositAddress = useSetRecoilState(SourceDepositAddress)
  const sourceAsset = useRecoilValue(SourceAsset)
  const notificationHandler = NotificationHandler()
  const personalSignAuthenticate = usePersonalSignAuthenticate()
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

  const postRequest = useCallback(
    async (
      traceId: string,
      signature: string,
      otc: string,
      publicAddr: string
    ) => {
      try {
        setDepositAddress(null)

        const depositAddress =
          await TransferAssetBridgeFacade.getDepositAddress({
            payload: {
              fromChain: sourceChain?.chainName || "",
              toChain: destinationChain?.chainName || "",
              asset: sourceAsset?.common_key || "",
              destinationAddress: destinationAddress || "",
            },
          })

        setDepositAddress({
          assetAddress: depositAddress,
        })
      } catch (e: any) {
        e.traceId = traceId
        console.log("usePostTransactionToBridge_postRequest_1", e)
        if (e.statusCode === 504) {
          notificationHandler.notifyInfo(e)
        } else if (e.message === "AxelarJS-SDK uncaught post error") {
          e.statusCode = 429
          notificationHandler.notifyInfo(e)
        } else {
          notificationHandler.notifyError(e)
        }
        setShowTransactionStatusWindow(false)
      }
    },
    [
      destinationAddress,
      destinationChain,
      sourceAsset,
      sourceChain,
      notificationHandler,
      setDepositAddress,
      setShowTransactionStatusWindow,
    ]
  )

  const handleTransactionSubmission = useCallback(() => {
    let traceId: string = uuidv4()

    return new Promise(async (resolve, reject) => {
      if (
        !(
          sourceChain?.chainSymbol &&
          destinationChain?.chainSymbol &&
          destinationAddress &&
          sourceAsset
        )
      ) {
        reject("no input params")
        return
      }

      let isBlockchainAuthenticated, signature, otc, publicAddress

      try {
        const { authenticateWithMetamask } = personalSignAuthenticate
        const res = await authenticateWithMetamask()
        signature = res.signature
        otc = res.otc
        publicAddress = res.publicAddress
        isBlockchainAuthenticated = res.isBlockchainAuthenticated
      } catch (e: any) {
        setShowTransactionStatusWindow(false)
        setIsSubmitting(false)
        if (e?.code === 4001) {
          return // case of user hitting cancel on metamask signature request
        } else if (e?.toString().includes("missing provider")) {
          return // case of user not having metamask
        }
        const error = new CustomError(403.1, "Network error from servers")
        notificationHandler.notifyInfo(error)
        reject(error)
      }

      setIsSubmitting(false)

      if (!isBlockchainAuthenticated) {
        reject("You did not sign")
        return
      }

      try {
        setShowTransactionStatusWindow(true)
        const res = await postRequest(traceId, signature, otc, publicAddress)
        resolve(res)
      } catch (e: any) {
        /*note: all notifications for postRequest failures are caught directly in that method*/
        setShowTransactionStatusWindow(false)
        if (!e.traceId) {
          e.traceId = traceId
        }
        reject(e)
        throw new Error(e)
      }
    })
  }, [
    sourceChain,
    destinationChain,
    destinationAddress,
    setShowTransactionStatusWindow,
    sourceAsset,
    postRequest,
    personalSignAuthenticate,
    notificationHandler,
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
