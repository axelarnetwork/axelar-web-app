import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { AssetInfo } from "@axelar-network/axelarjs-sdk"
import { useRecoilState, useRecoilValue } from "recoil"
import { SendLogsToServer } from "api/SendLogsToServer"
import downstreamServices from "config/downstreamServices"
import { DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY } from "config/consts"
import { InputForm } from "components/CompositeComponents/InputForm"
import { StyledButton } from "components/StyleComponents/StyledButton"
import { FlexRow } from "components/StyleComponents/FlexRow"
import Link from "components/Widgets/Link"
import { KeplrWallet } from "hooks/wallet/KeplrWallet"
import {
  MetamaskTransferEvent,
  MetaMaskWallet,
} from "hooks/wallet/MetaMaskWallet"
import { ChainSelection, SourceAsset } from "state/ChainSelection"
import {
  SourceDepositAddress,
  SrcChainDepositTxHash,
  TransactionTraceId,
} from "state/TransactionStatus"
import { getMinDepositAmount } from "utils/getMinDepositAmount"
import { isValidDecimal } from "utils/isValidDecimal"
import LoadingWidget from "components/Widgets/LoadingWidget"
import { getShortenedWord } from "utils/wordShortener"
import BoldSpan from "components/StyleComponents/BoldSpan"

const TransferButton = styled(StyledButton)`
  color: ${(props) => (props.dim ? "#565656" : "white")};
  cursor: ${(props) => (props.dim ? "not-allowed" : "pointer")};
  font-size: small;
`

interface DepositFromWalletProps {
  isWalletConnected: boolean
  walletBalance: number
  reloadBalance: () => void
  walletAddress: string
}
export const DepositFromWallet = ({
  isWalletConnected,
  walletBalance,
  reloadBalance,
  walletAddress,
}: DepositFromWalletProps) => {
  const sourceChainSelection = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY))
  const destChainSelection = useRecoilValue(
    ChainSelection(DESTINATION_TOKEN_KEY)
  )
  const selectedSourceAsset = useRecoilValue(SourceAsset)
  const [amountToDeposit, setAmountToDeposit] = useState(null)
  const depositAddress = useRecoilValue(SourceDepositAddress)
  const [minDepositAmt] = useState(
    getMinDepositAmount(selectedSourceAsset, destChainSelection) || 0
  )
  const [buttonText, setButtonText] = useState(
    sourceChainSelection?.chainName.toLowerCase() === "terra"
      ? "Deposit via IBC Transfer"
      : "Send Deposit"
  )
  const [sentSuccess, setSentSuccess] = useState(false)
  const [numConfirmations, setNumConfirmations] = useState(0)
  const [hasEnoughInWalletForMin, setHasEnoughInWalletForMin] = useState(true)
  const [txHash, setTxHash] = useRecoilState(SrcChainDepositTxHash)
  const transactionTraceId = useRecoilValue(TransactionTraceId)

  useEffect(() => {
    setHasEnoughInWalletForMin(walletBalance >= minDepositAmt)
  }, [minDepositAmt, walletBalance])

  const transferMetamask = async () => {
    let wallet: MetaMaskWallet = new MetaMaskWallet(
      sourceChainSelection?.chainName.toLowerCase() as string
    )
    await wallet.connectToWallet()
    await wallet.switchChain(
      sourceChainSelection?.chainName.toLowerCase() as string
    )
    const tokenAddress: string = await wallet.getOrFetchTokenAddress(
      selectedSourceAsset as AssetInfo
    )
    setButtonText("Sending...")
    let results: MetamaskTransferEvent
    try {
      results = await wallet.transferTokens(
        depositAddress?.assetAddress as string,
        (amountToDeposit || 0).toString(),
        selectedSourceAsset as AssetInfo
      )
    } catch (error: any) {
      results = error
    }
    handleMetamaskTxResult(wallet, results)

    console.log(
      "token address on",
      sourceChainSelection?.chainName,
      tokenAddress,
      results
    )
  }
  const transferKeplr = async () => {
    const sourceChainName: "axelar" | "terra" =
      sourceChainSelection?.chainName.toLowerCase() as "axelar" | "terra"
    let wallet: KeplrWallet = new KeplrWallet(sourceChainName)
    await wallet.connectToWallet()
    setButtonText("Sending...")

    let results
    try {
      if (sourceChainName === "axelar") {
        results = await wallet.transferTokens(
          depositAddress?.assetAddress as string,
          (amountToDeposit || 0).toString()
        )
      } else {
        results = await wallet.ibcTransferFromTerra(
          depositAddress?.assetAddress as string,
          {
            amount: ((amountToDeposit || 0) * 1000000).toString(),
            denom: selectedSourceAsset?.common_key?.toString() as string,
          }
        )
      }
    } catch (error: any) {
      results = error
    }
    handleKeplrTxResult(results)
  }

  const handleKeplrTxResult = (results: any) => {
    // this is the case where you get immediate feedback in the results
    let stringifiedResults: string = results?.toString()?.toLowerCase() || ""

    // this is the case where the request is sent to the network and raw logs are returned, so we also want to check this for any of the below issues
    if (results?.rawLog) {
      stringifiedResults += results.rawLog.toString()
    }
    const outOfGas: boolean = stringifiedResults.includes("out of gas")
    const accountSequenceMismatch: boolean = stringifiedResults.includes(
      "account sequence mismatch"
    )
    const inSufficientFunds: boolean =
      stringifiedResults.includes("insufficient funds")
    const requestRejected: boolean =
      stringifiedResults.includes("request rejected")

    const hasAnyErrors =
      outOfGas ||
      accountSequenceMismatch ||
      inSufficientFunds ||
      requestRejected

    if (results && results.transactionHash && results.height && !hasAnyErrors) {
      setSentSuccess(true)
      setTxHash(results.transactionHash)
      SendLogsToServer.info(
        "DEPOSIT_CONFIRMATION",
        "deposit made within app: " + results,
        transactionTraceId
      )
    } else {
      setButtonText("Something went wrong, try again?")
      const msg = "user failed to send tx: " + results
      console.log("message", msg)
      SendLogsToServer.error("DEPOSIT_CONFIRMATION", msg, transactionTraceId)
    }
  }

  const handleMetamaskTxResult = (wallet: MetaMaskWallet, results: any) => {
    let stringifiedResults = results?.toString().toLowerCase()
    if (results?.message)
      stringifiedResults += results.message.toString().toLowerCase()

    const userDenied: boolean = stringifiedResults.includes("user denied")
    const gasTooLow: boolean =
      stringifiedResults.includes("intrinsic gas too low") ||
      stringifiedResults.includes("out of gas")
    const insufficientFunds: boolean =
      stringifiedResults.includes("insufficient funds")
    const transactionFailed: boolean =
      stringifiedResults.includes("transaction failed")
    const hasAnyErrors: boolean =
      userDenied || transactionFailed || gasTooLow || insufficientFunds

    if (results.txHash && results.blockNumber && !hasAnyErrors) {
      setSentSuccess(true)
      setTxHash(results.txHash)
      const confirmInterval: number =
        sourceChainSelection?.chainName.toLowerCase() === "ethereum" ? 15 : 2
      wallet.confirmEtherTransaction(
        results.txHash,
        sourceChainSelection?.confirmLevel as number,
        confirmInterval,
        ({ numConfirmations }: any) => setNumConfirmations(numConfirmations)
      )
      SendLogsToServer.info(
        "DEPOSIT_CONFIRMATION",
        "deposit made within app: " + JSON.stringify(results),
        transactionTraceId
      )
    } else if (results?.error?.length > 0 || hasAnyErrors) {
      setButtonText("Something went wrong, try again?")
      SendLogsToServer.error(
        "DEPOSIT_CONFIRMATION",
        "user failed to send tx: " + JSON.stringify(results),
        transactionTraceId
      )
    }
  }

  const transfer = async () => {
    return sourceChainSelection?.module === "evm"
      ? await transferMetamask()
      : await transferKeplr()
  }

  const LinkToExplorer = () => {
    const blockExplorer: { name: string; url: string } =
      downstreamServices.blockExplorers[
        process.env.REACT_APP_STAGE as string
      ] &&
      downstreamServices.blockExplorers[process.env.REACT_APP_STAGE as string][
        sourceChainSelection?.chainName?.toLowerCase() as string
      ]

    return txHash && blockExplorer ? (
      <span>
        See it <Link href={`${blockExplorer.url}${txHash}`}>here</Link> on{" "}
        {blockExplorer.name}.
        <br />
        <br />
      </span>
    ) : null
  }

  if (sentSuccess)
    return (
      <>
        <br />
        <div>
          {`Deposit transaction found! `}
          <LinkToExplorer />
        </div>
        {sourceChainSelection?.module === "evm" ? (
          <div>
            {numConfirmations >= (sourceChainSelection?.confirmLevel as number)
              ? `Received (${sourceChainSelection?.confirmLevel}/${sourceChainSelection?.confirmLevel}) confirmations.`
              : `Waiting on (${numConfirmations}/${sourceChainSelection?.confirmLevel}) required confirmations before forwarding to Axelar...`}
          </div>
        ) : null}
      </>
    )

  const disableTransferButton: boolean =
    !amountToDeposit ||
    amountToDeposit < minDepositAmt ||
    !hasEnoughInWalletForMin ||
    amountToDeposit > walletBalance ||
    !isValidDecimal(amountToDeposit as string)

  const getDisabledText = (disableTransferButton: boolean) => {
    if (!disableTransferButton)
      return (
        <span>
          <br />
          <br />
        </span>
      )

    let text = ""

    if (
      !hasEnoughInWalletForMin ||
      (amountToDeposit && amountToDeposit > walletBalance)
    )
      text = "Not enough funds in this account"
    else if (!amountToDeposit)
      return (
        <span>
          <br />
          <br />
        </span>
      )
    else if (amountToDeposit < minDepositAmt)
      text = "Amount is below the minimum!"
    else if (!isValidDecimal(amountToDeposit as string))
      text = "Too many decimal points"

    return (
      <div>
        {text}
        <br />
        <br />
      </div>
    )
  }

  return (
    <div style={{ width: `95%` }}>
      <br />
      {isWalletConnected ? (
        <div>
          <FlexRow>
            <InputForm
              name={"destination-address-input"}
              value={amountToDeposit || ""}
              placeholder={"Enter amount to deposit"}
              type={"number"}
              onChange={(e: any) => setAmountToDeposit(e.target.value)}
            />
            <div style={{ marginLeft: `0.5em` }}>
              {selectedSourceAsset?.assetSymbol}
            </div>
          </FlexRow>
          <br />
          <div>
            {walletAddress?.length > 0 && (
              <>
                <BoldSpan>Connected Wallet:</BoldSpan>{" "}
                {getShortenedWord(walletAddress, 4)}
              </>
            )}
            <div>
              <BoldSpan>Balance:</BoldSpan> {walletBalance}{" "}
              {selectedSourceAsset?.assetSymbol}
              <LoadingWidget cb={reloadBalance} />
            </div>
          </div>
          <br />
          {getDisabledText(disableTransferButton)}
          <TransferButton
            dim={disableTransferButton}
            disabled={disableTransferButton}
            onClick={transfer}
          >
            {buttonText}
          </TransferButton>
        </div>
      ) : null}
    </div>
  )
}
