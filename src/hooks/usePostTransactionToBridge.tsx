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
import {
  IsTxSubmitting,
  SourceDepositAddress,
  TransactionTraceId,
} from "state/TransactionStatus"
import { ShowTransactionStatusWindow } from "../state/ApplicationStatus"
import { v4 as uuid } from "uuid"

import { datadogLogs } from "@datadog/browser-logs"

export default function usePostTransactionToBridge() {
  const [showTransactionStatusWindow, setShowTransactionStatusWindow] =
    useRecoilState(ShowTransactionStatusWindow)
  const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY))
  const destinationChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY))
  const destinationAddress = useRecoilValue(DestinationAddress)
  const setDepositAddress = useSetRecoilState(SourceDepositAddress)
  const sourceAsset = useRecoilValue(SourceAsset)
  const setIsSubmitting = useSetRecoilState(IsTxSubmitting)
  const setTransactionsTraceId = useSetRecoilState(TransactionTraceId)

  const handleTransactionSubmission = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      setIsSubmitting(false)
      const _traceId = uuid()

      try {
        setShowTransactionStatusWindow(true)
        setDepositAddress(null)
        const assetAddress = await TransferAssetBridgeFacade.getDepositAddress(
          sourceChain?.chainName || "",
          destinationChain?.chainName || "",
          destinationAddress || "",
          sourceAsset?.common_key || "",
          { _traceId }
        )
        const log = {
          sourceChain: sourceChain?.chainName,
          destinationChain: destinationChain?.chainName,
          destinationAddress,
          asset: sourceAsset?.common_key,
          traceId: _traceId,
        }
        datadogLogs.logger.info("LINK_EVENT", log)
        setTransactionsTraceId(_traceId)
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
    setTransactionsTraceId,
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
