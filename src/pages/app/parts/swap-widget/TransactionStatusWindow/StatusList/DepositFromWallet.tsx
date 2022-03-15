import React, { useEffect, useState } from "react"
import { ethers } from "ethers"
import styled from "styled-components"
import { AssetInfo, ChainInfo } from "@axelar-network/axelarjs-sdk"
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
  SrcChainDepositTxHash,
  TransactionTraceId,
  DepositAmount,
  DepositTimestamp,
  HasEnoughDepositConfirmation,
} from "state/TransactionStatus"
import { getMinDepositAmount } from "utils/getMinDepositAmount"
import { isValidDecimal } from "utils/isValidDecimal"
import { AXELAR_TRANSFER_GAS_LIMIT, TERRA_IBC_GAS_LIMIT } from "config/gas"
import { ImprovedTooltip } from "components/Widgets/ImprovedTooltip"

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
  depositAddress: AssetInfo
}
export const DepositFromWallet = ({
  isWalletConnected,
  walletBalance,
  walletAddress,
  depositAddress,
}: DepositFromWalletProps) => {
  const sourceChainSelection = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY))
  const destChainSelection = useRecoilValue(
    ChainSelection(DESTINATION_TOKEN_KEY)
  )
  const selectedSourceAsset = useRecoilValue(SourceAsset)
  const [amountToDeposit, setAmountToDeposit] = useState<string>("")
  const [, setDepositAmount] = useRecoilState(DepositAmount)
  const [minDepositAmt] = useState(
    getMinDepositAmount(selectedSourceAsset, sourceChainSelection, destChainSelection) || 0
  )
  const [buttonText, setButtonText] = useState(
    sourceChainSelection?.chainName.toLowerCase() === "terra"
      ? "Deposit via IBC Transfer"
      : "Send Deposit"
  )
  const [sentSuccess, setSentSuccess] = useState(false)
  const [numConfirmations, setNumConfirmations] = useState(0)
  const [hasEnoughInWalletForMin, setHasEnoughInWalletForMin] = useState(true)
  const [hasEnoughDepositConfirmation, setHasEnoughDepositConfirmation] =
    useRecoilState(HasEnoughDepositConfirmation)
  const [txHash, setTxHash] = useRecoilState(SrcChainDepositTxHash)
  const [, setDepositTimestamp] = useRecoilState(DepositTimestamp)
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
      setDepositAmount(amountToDeposit)
      results = await wallet.transferTokens(
        depositAddress?.assetAddress as string,
        (amountToDeposit || 0).toString(),
        selectedSourceAsset as AssetInfo
      )
    } catch (error: any) {
      setDepositAmount("")
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
      setDepositAmount(amountToDeposit)
      if (sourceChainName === "axelar") {
        results = await wallet.transferTokens(
          depositAddress?.assetAddress as string,
          amountToDeposit || "0"
        )
      } else {
        results = await wallet.ibcTransfer(
          depositAddress?.assetAddress as string,
          {
            amount: ethers.utils
              .parseUnits(amountToDeposit, selectedSourceAsset?.decimals || 6)
              .toString(),
            denom: selectedSourceAsset?.common_key?.toString() as string,
          }
        )
      }
    } catch (error: any) {
      setDepositAmount("")
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
      setDepositTimestamp(new Date().getTime())
      SendLogsToServer.info(
        "DEPOSIT_CONFIRMATION",
        "deposit made within app: " + results,
        transactionTraceId
      )
    } else {
      setButtonText("Something went wrong, try again?")
      const msg = "user failed to send tx: " + results
      console.log("message", msg)
      SendLogsToServer.info("DEPOSIT_CONFIRMATION", msg, transactionTraceId)
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
      setDepositTimestamp(new Date().getTime())
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
      SendLogsToServer.info(
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

  const handleMaxClick = () => {
    const highGasPrice = 0.2
    if (
      sourceChainSelection?.chainName?.toLowerCase() === "terra" &&
      selectedSourceAsset?.common_key === "uluna"
    ) {
      const fee = parseFloat(
        ethers.utils.formatUnits(
          highGasPrice * parseInt(TERRA_IBC_GAS_LIMIT),
          selectedSourceAsset?.decimals || 6
        )
      )
      const maxWithFee = walletBalance - fee
      const roundedMax = (Math.floor(maxWithFee * 100) / 100).toFixed(2)
      setAmountToDeposit(roundedMax)
    } else if (
      sourceChainSelection?.chainName?.toLowerCase() === "axelar" &&
      selectedSourceAsset?.common_key === "uaxl"
    ) {
      const fee = parseFloat(
        ethers.utils.formatUnits(
          highGasPrice * parseInt(AXELAR_TRANSFER_GAS_LIMIT),
          selectedSourceAsset?.decimals || 6
        )
      )
      const maxWithFee = walletBalance - fee
      const roundedMax = (Math.floor(maxWithFee * 100) / 100).toFixed(2)
      setAmountToDeposit(roundedMax)
    } else {
      const roundedMax = (Math.floor(walletBalance * 100) / 100).toFixed(2)
      setAmountToDeposit(roundedMax)
    }
  }
  const getMaxButtonText = () => {
    const terraNativeToken: boolean =
      sourceChainSelection?.chainName.toLowerCase() === "terra" &&
      selectedSourceAsset?.common_key === "uluna"
    const axelarNativeToken: boolean =
      sourceChainSelection?.chainName.toLowerCase() === "axelar" &&
      selectedSourceAsset?.common_key === "uaxl"
    if (terraNativeToken || axelarNativeToken) {
      const text: string = "Will deduct a portion for expected gas fees"
      return (
        <ImprovedTooltip
          anchorContent={<div>max</div>}
          tooltipText={text}
          tooltipAltText={text}
        />
      )
    }
    return "max"
  }

  useEffect(() => {
    if (numConfirmations >= (sourceChainSelection?.confirmLevel as number)) {
      setHasEnoughDepositConfirmation(true)
    }
  }, [
    numConfirmations,
    setHasEnoughDepositConfirmation,
    sourceChainSelection?.confirmLevel,
  ])

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
            {hasEnoughDepositConfirmation
              ? `Received (${sourceChainSelection?.confirmLevel}/${sourceChainSelection?.confirmLevel}) confirmations.`
              : `Waiting on (${numConfirmations}/${sourceChainSelection?.confirmLevel}) required confirmations before forwarding to Axelar...`}
          </div>
        ) : null}
      </>
    )

  const disableTransferButton: boolean =
    !amountToDeposit ||
    parseFloat(amountToDeposit) < minDepositAmt ||
    !hasEnoughInWalletForMin ||
    parseFloat(amountToDeposit) > walletBalance ||
    !isValidDecimal(amountToDeposit.toString()) ||
    (buttonText || "").toLowerCase().includes("sending")

  const getDisabledText = (disableTransferButton: boolean) => {
    if (!disableTransferButton)
      return (
        <span>
          <br />
        </span>
      )

    let text = ""

    if (
      !hasEnoughInWalletForMin ||
      (amountToDeposit && parseFloat(amountToDeposit) > walletBalance)
    )
      text = "Not enough funds in this account"
    else if (!amountToDeposit)
      return (
        <span>
          <br />
          <br />
        </span>
      )
    else if (parseFloat(amountToDeposit) < minDepositAmt)
      text = "Amount is below the minimum!"
    else if (!isValidDecimal(amountToDeposit.toString()))
      text = "Too many decimal points"

    return (
      <div>
        <br />
        {text}
        <br />
        <br />
      </div>
    )
  }

  return (
    <div>
      <br />
      {isWalletConnected ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <FlexRow>
            <div style={{ width: `100%`, position: `relative` }}>
              <InputForm
                name={"destination-address-input"}
                value={amountToDeposit}
                placeholder={"Amount to deposit"}
                type={"number"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAmountToDeposit(e.target.value)
                }
              />
              {walletBalance > 0 && (
                <div
                  style={{
                    position: `absolute`,
                    color: "grey",
                    right: `0.5em`,
                    bottom: `0.25em`,
                    fontSize: `0.8em`,
                    cursor: "pointer",
                  }}
                  onClick={handleMaxClick}
                >
                  {getMaxButtonText()}
                </div>
              )}
            </div>
            <div style={{ marginLeft: `0.5em` }}>
              {selectedSourceAsset?.assetSymbol}
            </div>
          </FlexRow>
          {getDisabledText(disableTransferButton)}
          {depositTxDetails(
            disableTransferButton,
            sourceChainSelection as ChainInfo,
            amountToDeposit
          )}
          <br />
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

const depositTxDetails = (
  disableTransferButton: boolean,
  sourceChain: ChainInfo,
  amt: string
) => {
  if (disableTransferButton || !amt) return null

  return (
    <div style={{ fontSize: `0.9em` }}>
      Confirm all of the above info before sending funds. Funds will be lost
      otherwise.
    </div>
  )
}
