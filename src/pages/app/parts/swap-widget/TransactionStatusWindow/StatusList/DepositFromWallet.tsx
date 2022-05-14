import React, { useEffect, useState } from "react"
import { ethers } from "ethers"
import styled from "styled-components"
import { AssetInfo, ChainInfo } from "@axelar-network/axelarjs-sdk"
import { useRecoilState, useRecoilValue } from "recoil"
import { SendLogsToServer } from "api/SendLogsToServer"
import { DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY } from "config/consts"
import { InputForm } from "components/CompositeComponents/InputForm"
import { StyledButton } from "components/StyleComponents/StyledButton"
import { FlexRow } from "components/StyleComponents/FlexRow"
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
import { TerraWallet } from "hooks/wallet/TerraWallet"
import {
  useConnectedWallet,
  useLCDClient,
  useWallet,
} from "@terra-money/wallet-provider"
import { SelectedWallet, WalletType } from "state/Wallet"
import { hasSelectedNativeAssetForChain } from "utils/hasSelectedNativeAssetOnChain"
import LoadingWidget from "components/Widgets/LoadingWidget"
import { getShortenedWord } from "utils/wordShortener"
import BoldSpan from "components/StyleComponents/BoldSpan"
import { FlexColumn } from "components/StyleComponents/FlexColumn"
import { getNumber } from "utils/formatNumber"
import { getAssetSymbolToShow } from "utils/getAssetSymbolToShow"

const TransferButton = styled(StyledButton)`
  color: ${(props) => (props.dim ? "#565656" : "white")};
  height: 2em;
  cursor: ${(props) => (props.dim ? "not-allowed" : "pointer")};
  font-size: 0.9em;
  margin: 0.5em 0em 0em -1em;
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
  reloadBalance,
}: DepositFromWalletProps) => {
  const sourceChainSelection = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY))
  const destChainSelection = useRecoilValue(
    ChainSelection(DESTINATION_TOKEN_KEY)
  )
  const selectedSourceAsset = useRecoilValue(SourceAsset)
  const [amountToDeposit, setAmountToDeposit] = useState<string>("")
  const [, setDepositAmount] = useRecoilState(DepositAmount)
  const selectedWallet = useRecoilValue(SelectedWallet)
  const [minDepositAmt] = useState(
    getMinDepositAmount(
      selectedSourceAsset,
      sourceChainSelection,
      destChainSelection
    ) || 0
  )
  const [buttonText, setButtonText] = useState("Send")
  const [sentSuccess, setSentSuccess] = useState(false)
  const [numConfirmations, setNumConfirmations] = useState(0)
  const [hasEnoughInWalletForMin, setHasEnoughInWalletForMin] = useState(true)
  const [hasEnoughDepositConfirmation, setHasEnoughDepositConfirmation] =
    useRecoilState(HasEnoughDepositConfirmation)
  const [, setTxHash] = useRecoilState(SrcChainDepositTxHash)
  const [, setDepositTimestamp] = useRecoilState(DepositTimestamp)
  const transactionTraceId = useRecoilValue(TransactionTraceId)
  const terraWallet = useWallet()
  const lcdClient = useLCDClient()
  const connectedWallet = useConnectedWallet()
  const [inputHasChanged, setInputHasChanged] = useState(false)

  const [assetSymbolToShow, setAssetSymbolToShow] = useState("");

  useEffect(() => {
    setAssetSymbolToShow(getAssetSymbolToShow(
      sourceChainSelection as ChainInfo,
      destChainSelection as ChainInfo,
      selectedSourceAsset as AssetInfo,
      selectedSourceAsset?.assetSymbol
    ))
  }, [selectedSourceAsset, sourceChainSelection, destChainSelection]);

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
      if (
        hasSelectedNativeAssetForChain(
          selectedSourceAsset as AssetInfo,
          sourceChainSelection?.chainName
        )
      ) {
        results = await wallet.transferNativeTokens(
          depositAddress.assetAddress as string,
          (amountToDeposit || 0).toString(),
          selectedSourceAsset as AssetInfo,
          sourceChainSelection?.chainName as string
        )
      } else {
        results = await wallet.transferTokens(
          depositAddress.assetAddress as string,
          (amountToDeposit || 0).toString(),
          selectedSourceAsset as AssetInfo
        )
      }
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
    if (!sourceChainSelection?.chainName) return
    const sourceChainName = sourceChainSelection.chainName.toLowerCase()
    let wallet
    if (selectedWallet === WalletType.KEPLR) {
      wallet = new KeplrWallet(sourceChainName)
    } else {
      wallet = new TerraWallet(terraWallet, lcdClient, connectedWallet)
    }

    setButtonText("Sending...")

    let results
    try {
      if (!depositAddress?.assetAddress) return
      if (!selectedSourceAsset?.common_key) return

      const recipientAddress = depositAddress.assetAddress

      setDepositAmount(amountToDeposit)
      if (sourceChainName === "axelar") {
        results = await wallet.transferTokens(recipientAddress, amountToDeposit)
      } else {
        results = await wallet.ibcTransfer(
          recipientAddress,
          amountToDeposit,
          selectedSourceAsset.common_key,
          selectedSourceAsset.decimals || 6
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

    if (
      results &&
      (results.transactionHash || results.txhash) &&
      results.height >= 0 &&
      !hasAnyErrors
    ) {
      setSentSuccess(true)
      setTxHash(results.transactionHash || results.txhash)
      setHasEnoughDepositConfirmation(true)
      setDepositTimestamp(new Date().getTime())
      SendLogsToServer.info(
        "DEPOSIT_CONFIRMATION",
        "deposit made within app: " + results,
        transactionTraceId
      )
    } else {
      setButtonText("Hmm, try again")
      const msg = "user failed to send tx: " + results
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

    console.log("results", results)

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
      setButtonText("Hmm, try again")
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

  if (sentSuccess) {
    return sourceChainSelection?.module === "evm" &&
      !hasEnoughDepositConfirmation ? (
      <div>
        Waiting on ({numConfirmations}/{sourceChainSelection?.confirmLevel})
        required confirmations before forwarding to Axelar...
      </div>
    ) : null
  }

  const disableTransferButton: boolean =
    !amountToDeposit ||
    isNaN(parseFloat(amountToDeposit)) ||
    parseFloat(amountToDeposit) <= minDepositAmt ||
    !hasEnoughInWalletForMin ||
    parseFloat(amountToDeposit) > walletBalance ||
    !isValidDecimal(amountToDeposit.toString()) ||
    (buttonText || "").toLowerCase().includes("sending")

  const getDisabledText = (disableTransferButton: boolean) => {
    let text = ""

    if (
      !hasEnoughInWalletForMin ||
      (amountToDeposit && parseFloat(amountToDeposit) > walletBalance)
    )
      text = "Insufficient funds"
    else if (!amountToDeposit) return <br />
    else if (parseFloat(amountToDeposit) <= minDepositAmt)
      text = "Amount should be greater than the fee"
    else if (!isValidDecimal(amountToDeposit.toString()))
      text = "Too many decimal points"

    return text.length > 0 ? <div style={{ width: `98%` }}>{text}</div> : <br />
  }

  const userHasSelectedNativeAssetForChain = hasSelectedNativeAssetForChain(
    selectedSourceAsset as AssetInfo,
    sourceChainSelection?.chainName
  )

  return isWalletConnected ? (
    <FlexColumn>
      <FlexRow style={{ justifyContent: `flex-start`, width: `95%` }}>
        <FlexColumn>
          <div
            style={{
              width: `100%`,
              position: `relative`,
              marginRight: `1em`,
            }}
          >
            <InputForm
              name={"destination-address-input"}
              value={
                amountToDeposit
                  ?.replace(/[^.0-9]/g, "")
                  ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || ""
              }
              placeholder={"Amount"}
              type={"text"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setAmountToDeposit(e.target.value?.replace(/,/g, ""))
                if (!inputHasChanged) setInputHasChanged(true)
              }}
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
          <TransferButton
            dim={disableTransferButton}
            disabled={disableTransferButton}
            onClick={transfer}
          >
            {buttonText}
          </TransferButton>
        </FlexColumn>
        <FlexColumn
          style={{
            alignItems: `flex-start`,
            fontSize: `0.8em`,
            border: `1px solid lightgrey`,
            borderRadius: `5px`,
            display: `flex`,
            boxSizing: `border-box`,
            padding: `0.5em`,
            margin: `0em -0.5em 0em 0.5em`,
            width: `70%`,
          }}
        >
          <span style={{ marginBottom: `0.5em` }}>
            Fee:{" "}
            <BoldSpan>
              {minDepositAmt} {assetSymbolToShow}
            </BoldSpan>
          </span>

          <span style={{ marginBottom: `0.5em` }}>
            Wallet: <BoldSpan>{getShortenedWord(walletAddress)}</BoldSpan>
          </span>
          <span style={{ marginBottom: `0.5em` }}>
            {userHasSelectedNativeAssetForChain
              ? sourceChainSelection?.chainSymbol
              : assetSymbolToShow}{" "}
            balance: <BoldSpan>~{getNumber(walletBalance)} </BoldSpan>
            <LoadingWidget cb={reloadBalance} />
          </span>
        </FlexColumn>
      </FlexRow>
      {inputHasChanged ? getDisabledText(disableTransferButton) : <br />}
    </FlexColumn>
  ) : null
}
