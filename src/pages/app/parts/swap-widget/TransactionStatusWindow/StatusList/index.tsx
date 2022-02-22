import React, { useCallback, useState } from "react"
import { ChainInfo } from "@axelar-network/axelarjs-sdk"
import styled from "styled-components"
import screenConfigs from "config/screenConfigs"
import { useRecoilValue } from "recoil"
import {
  MS_UNTIL_CONFIRM_BTN_VISIBLE,
  DESTINATION_TOKEN_KEY,
  SOURCE_TOKEN_KEY,
} from "config/consts"
import downstreamServices from "config/downstreamServices"
import CopyToClipboard from "components/Widgets/CopyToClipboard"
import Link from "components/Widgets/Link"
import BoldSpan from "components/StyleComponents/BoldSpan"
import { FlexRow } from "components/StyleComponents/FlexRow"
import { ImprovedTooltip } from "components/Widgets/ImprovedTooltip"
import { SVGImage } from "components/Widgets/SVGImage"
import { Nullable } from "interface/Nullable"
import {
  ChainSelection,
  DestinationAddress,
  SourceAsset,
} from "state/ChainSelection"
import {
  DepositAmount,
  DepositTimestamp,
  IConfirmationStatus,
  NumberConfirmations,
  SourceDepositAddress,
  SrcChainDepositTxHash,
} from "state/TransactionStatus"
import { getShortenedWord } from "utils/wordShortener"
import BigNumber from "decimal.js"
import useInterval from "hooks/useInterval"
import { confirmDeposit } from "api/ConfirmDepositAPI"
import { ConfirmDepositRequest } from "interface/confirmDepositTypes"
import { broadcastCosmosTx } from "utils/cosmos"
import {
  BroadcastTxResponse,
  isBroadcastTxFailure,
  isBroadcastTxSuccess,
} from "@cosmjs/stargate"
import { getAxelarTxLink } from "utils/explorer"
import { ethers } from "ethers"

const StyledStatusList = styled.div`
  width: 100%;
  height: 65%;
  @media ${screenConfigs.media.desktop} {
    margin-top: 20px;
  }
`
const StyledSVGImage = styled(SVGImage)`
  cursor: pointer;
`
const HelperWidget = styled.div`
  box-sizing: border-box;
  padding: 0.5em 1em 0.5em 1em;
  text-align: center;
  background-color: ${(props) => props.theme.headerBackgroundColor};
  border-radius: 50px;
  color: white;
  cursor: pointer;
  font-size: smaller;
  margin-bottom: 0.5em;
`
const StyledListItem = styled.div`
  height: 25%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media ${screenConfigs.media.desktop} {
    font-size: 18px;
  }
  @media ${screenConfigs.media.laptop} {
    font-size: 15px;
  }
  @media ${screenConfigs.media.tablet} {
    font-size: 12px;
  }
  @media ${screenConfigs.media.mobile} {
    font-size: 10px;
  }
`

const StyledImage = styled.object`
  height: 75%;
  width: 75%;
`

interface IListItemProps {
  activeStep: number
  step: number
  text: any
  className?: string
}

const ListItem = (props: IListItemProps) => {
  const { activeStep, className, step, text } = props
  let suffix: string

  if (activeStep > step) {
    suffix = "complete"
  } else if (activeStep === step) {
    suffix = "active"
  } else {
    suffix = "inactive"
  }

  return (
    <StyledListItem className={className}>
      <div
        style={{
          width: `20%`,
          height: `100%`,
          display: `flex`,
          alignItems: `center`,
          justifyContent: `center`,
        }}
      >
        <StyledImage
          data={
            require(`assets/svg/transaction_status_logos/step-${step}-${suffix}.svg`)
              ?.default
          }
        />
      </div>
      <div
        style={{
          width: `80%`,
          height: `100%`,
          display: `flex`,
          alignItems: `center`,
          color: activeStep >= step ? "black" : "lightgray",
        }}
      >
        {text}
      </div>
    </StyledListItem>
  )
}

interface IStatusListProps {
  activeStep: number
  isWalletConnected: boolean
  connectToWallet: () => void
}

const StatusList = (props: IStatusListProps) => {
  const { activeStep } = props
  const [showConfirmButton, setShowConfirmButton] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [confirmedTx, setConfirmedTx] = useState<BroadcastTxResponse | null>(
    null
  )
  const selectedSourceAsset = useRecoilValue(SourceAsset)
  const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY))
  const destinationChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY))
  const depositAddress = useRecoilValue(SourceDepositAddress)
  const depositTimestamp = useRecoilValue(DepositTimestamp)
  const depositAmount = useRecoilValue(DepositAmount)
  const destNumConfirm: IConfirmationStatus = useRecoilValue(
    NumberConfirmations(DESTINATION_TOKEN_KEY)
  )
  const destinationAddress = useRecoilValue(DestinationAddress)
  const srcChainDepositHash = useRecoilValue(SrcChainDepositTxHash)
  useInterval(() => {
    if (depositTimestamp > 0 && !confirmedTx && !showConfirmButton) {
      const currentTimestamp = new Date().getTime()
      const shouldShowConfirmButton =
        currentTimestamp - depositTimestamp > MS_UNTIL_CONFIRM_BTN_VISIBLE
      setShowConfirmButton(shouldShowConfirmButton)
    }
  }, 3000)

  const sourceAsset = useRecoilValue(SourceAsset)
  const sourceNumConfirmations = useRecoilValue(
    NumberConfirmations(SOURCE_TOKEN_KEY)
  )

  const amountConfirmedAtomicUnits: number = parseFloat(
    (sourceNumConfirmations.amountConfirmedString || "").replace(/[^\d.]*/g, "")
  )
  const amountConfirmedAdjusted: number =
    amountConfirmedAtomicUnits *
    BigNumber.pow(10, -1 * (sourceAsset?.decimals || 1)).toNumber()
  const afterFees: number = new BigNumber(1)
    .minus(new BigNumber(sourceChain?.txFeeInPercent || 0).div(100))
    .times(amountConfirmedAdjusted)
    .toNumber()

  const WalletLogo = () => (
    <StyledSVGImage
      height={`1em`}
      width={`1em`}
      margin={`0em 0em -0.125em 0em`}
      src={
        sourceChain?.module === "axelarnet"
          ? require(`assets/svg/keplr.svg`).default
          : require(`assets/svg/metamask.svg`).default
      }
    />
  )

  const confirmDepositTransaction = useCallback(async () => {
    if (!srcChainDepositHash) return
    if (!sourceChain?.chainName) return
    if (!depositAddress?.assetAddress) return
    if (!depositAddress?.common_key) return
    if (!depositAmount) return

    setConfirming(true)
    const req: ConfirmDepositRequest = {
      hash: srcChainDepositHash,
      from: sourceChain?.chainName!,
      depositAddress: depositAddress.assetAddress,
      amount: ethers.utils
        .parseUnits(depositAmount, selectedSourceAsset?.decimals || 6)
        .toString(),
      token: depositAddress.common_key,
    }
    try {
      const base64SignedTx = await confirmDeposit(req)
      const tx = await broadcastCosmosTx(base64SignedTx)
      console.log("confirmed tx", tx)
      setConfirmedTx(tx)
      setConfirming(false)
      setShowConfirmButton(false)
    } catch (e) {
      console.log(e)
      setConfirming(false)
    }
  }, [
    depositAddress?.assetAddress,
    depositAddress?.common_key,
    depositAmount,
    selectedSourceAsset?.decimals,
    sourceChain?.chainName,
    srcChainDepositHash,
  ])

  const renderStep3 = () => {
    if (activeStep >= 3) {
      return (
        <div>
          <div>
            <BoldSpan>
              {+amountConfirmedAdjusted.toFixed(2)} {sourceAsset?.assetSymbol}
            </BoldSpan>{" "}
            deposit confirmed. Sending
          </div>
          <div>
            <BoldSpan>
              {+afterFees.toFixed(2)} {sourceAsset?.assetSymbol}
            </BoldSpan>{" "}
            to {destinationChain?.chainName} within the next ~
            {destinationChain?.chainName.toLowerCase() === "ethereum" ? 30 : 3}{" "}
            min.
          </div>
          {confirmedTx && isBroadcastTxSuccess(confirmedTx) && (
            <a
              href={getAxelarTxLink(confirmedTx.transactionHash)}
              target="_blank"
              rel="noreferrer"
            >
              View Tx
            </a>
          )}
        </div>
      )
    } else {
      if (showConfirmButton) {
        return (
          <div>
            <p style={{ color: "black" }}>
              Your deposit has not been confirmed yet.{" "}
            </p>
            <div style={{ display: "flex" }}>
              <button
                onClick={confirmDepositTransaction}
                style={{ fontSize: 12, borderRadius: "4px", cursor: "pointer" }}
              >
                {confirming ? "Confirming..." : "Force Confirm"}
              </button>
            </div>
          </div>
        )
      } else if (confirmedTx && isBroadcastTxFailure(confirmedTx)) {
        return (
          <a
            style={{ color: "red", marginLeft: "8px" }}
            href={getAxelarTxLink(confirmedTx?.transactionHash || "")}
            rel="noreferrer"
          >
            Confirm tx failed
          </a>
        )
      } else {
        return `Detecting your deposit on ${sourceChain?.chainName}.`
      }
    }
  }

  return (
    <StyledStatusList>
      <ListItem
        className={"joyride-status-step-1"}
        step={1}
        activeStep={activeStep}
        text={
          <span>
            Generating a one-time deposit address for recipient:{" "}
            <BoldSpan>
              {getShortenedWord(destinationAddress as string, 5)}
            </BoldSpan>
            .
          </span>
        }
      />
      <ListItem
        className={"joyride-status-step-2"}
        step={2}
        activeStep={activeStep}
        text={
          activeStep >= 2 ? (
            <div
              style={{
                overflowWrap: `break-word`,
                overflow: `hidden`,
                width: `100%`,
              }}
            >
              {sourceChain?.chainName.toLowerCase() === "terra"
                ? `Send ${selectedSourceAsset?.assetSymbol} from Terra to Axelar via IBC:`
                : `Deposit ${selectedSourceAsset?.assetSymbol} on ${sourceChain?.chainName} to this address:`}
              <div style={{ margin: `5px 0px 0px 0px` }}>
                <ImprovedTooltip
                  anchorContent={
                    <CopyToClipboard
                      JSXToShow={
                        <BoldSpan>
                          {getShortenedWord(depositAddress?.assetAddress, 5)}{" "}
                        </BoldSpan>
                      }
                      height={`12px`}
                      width={`10px`}
                      textToCopy={depositAddress?.assetAddress || ""}
                      showImage={true}
                    />
                  }
                  tooltipText={"Copy to Clipboard"}
                  tooltipAltText={"Copied to Clipboard!"}
                />
              </div>
              {activeStep >= 3 && srcChainDepositHash ? (
                linkToExplorer(sourceChain as ChainInfo, srcChainDepositHash)
              ) : (
                <FlexRow
                  style={{
                    height: `1.5em`,
                    width: `100%`,
                    justifyContent: `space-between`,
                  }}
                >
                  <div>OR deposit from here!</div>
                  {!props.isWalletConnected ? (
                    <HelperWidget onClick={props.connectToWallet}>
                      Connect{" "}
                      {sourceChain?.module === "evm" ? "Metamask" : "Keplr"}{" "}
                      <WalletLogo />
                    </HelperWidget>
                  ) : null}
                </FlexRow>
              )}
            </div>
          ) : (
            `Waiting for your deposit into a temporary deposit account.`
          )
        }
      />
      <ListItem
        className={"joyride-status-step-3"}
        step={3}
        activeStep={activeStep}
        text={renderStep3()}
      />
      <ListItem
        className={"joyride-status-step-4"}
        step={4}
        activeStep={activeStep}
        text={
          activeStep >= 4
            ? ShowTransactionComplete({ destNumConfirm, destinationChain })
            : `Detecting your transfer on ${destinationChain?.chainName}`
        }
      />
    </StyledStatusList>
  )
}

const ShowTransactionComplete = ({
  destNumConfirm,
  destinationChain,
}: {
  destNumConfirm: IConfirmationStatus
  destinationChain: Nullable<ChainInfo>
}) => {
  const blockExplorer: { name: string; url: string } =
    downstreamServices.blockExplorers[process.env.REACT_APP_STAGE as string] &&
    downstreamServices.blockExplorers[process.env.REACT_APP_STAGE as string][
      destinationChain?.chainName?.toLowerCase() as string
    ]
  console.log(
    "block explorer",
    blockExplorer,
    destNumConfirm,
    process.env.REACT_APP_STAGE
  )
  return destNumConfirm.transactionHash && blockExplorer ? (
    <div style={{ overflowWrap: `break-word`, overflow: `hidden` }}>
      Transaction completed - see it{" "}
      <Link href={`${blockExplorer.url}${destNumConfirm.transactionHash}`}>
        here
      </Link>{" "}
      on {blockExplorer.name}!
    </div>
  ) : (
    "Transfer Completed!"
  )
}

const linkToExplorer = (sourceChainSelection: ChainInfo, txHash: string) => {
  const blockExplorer: { name: string; url: string } =
    downstreamServices.blockExplorers[process.env.REACT_APP_STAGE as string] &&
    downstreamServices.blockExplorers[process.env.REACT_APP_STAGE as string][
      sourceChainSelection?.chainName?.toLowerCase() as string
    ]

  return txHash && blockExplorer ? (
    <div style={{ marginTop: `0.35em` }}>
      <Link href={`${blockExplorer.url}${txHash}`}>Deposit Transaction</Link>
    </div>
  ) : null
}

export default StatusList
