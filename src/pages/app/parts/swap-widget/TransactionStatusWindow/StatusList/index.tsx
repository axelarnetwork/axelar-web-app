import { useState } from "react"
import { AssetInfo, ChainInfo } from "@axelar-network/axelarjs-sdk"
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
  DepositTimestamp,
  HasEnoughDepositConfirmation,
  IConfirmationStatus,
  NumberConfirmations,
  SourceDepositAddress,
  SrcChainDepositTxHash,
} from "state/TransactionStatus"
import { getShortenedWord } from "utils/wordShortener"
import BigNumber from "decimal.js"
import useInterval from "hooks/useInterval"
import {
  BroadcastTxResponse,
  isBroadcastTxFailure,
  isBroadcastTxSuccess,
} from "@cosmjs/stargate"
import { getAxelarTxLink } from "utils/explorer"
import logoKeplr from "assets/svg/keplr.svg"
import logoMetamask from "assets/svg/metamask.svg"
import logoTerraStation from "assets/svg/terra-station.svg"
import { WalletType } from "state/Wallet"
import { getMinDepositAmount } from "utils/getMinDepositAmount"
import { hasSelectedNativeAssetForChain } from "utils/hasSelectedNativeAssetOnChain"

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
const HelperWidget = styled.span`
  box-sizing: border-box;
  padding: 0.5em 1em 0.5em 1em;
  text-align: center;
  background-color: ${(props) => props.theme.headerBackgroundColor};
  border-radius: 50px;
  color: white;
  cursor: pointer;
  font-size: smaller;
  transition: opacity 0.2s ease;
  &:hover {
    opacity: 0.8;
  }
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
  connectToWallet: (walletType: WalletType) => void
}

const StatusList = (props: IStatusListProps) => {
  const { activeStep } = props
  const [showConfirmButton, setShowConfirmButton] = useState(false)
  const [confirming] = useState(false)
  const [confirmedTx] = useState<BroadcastTxResponse | null>(null)
  const selectedSourceAsset = useRecoilValue(SourceAsset)
  const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY))
  const destinationChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY))
  const depositAddress = useRecoilValue(SourceDepositAddress)
  const depositTimestamp = useRecoilValue(DepositTimestamp)
  // const depositAmount = useRecoilValue(DepositAmount)
  const hasEnoughDepositConfirmation = useRecoilValue(
    HasEnoughDepositConfirmation
  )
  const destNumConfirm: IConfirmationStatus = useRecoilValue(
    NumberConfirmations(DESTINATION_TOKEN_KEY)
  )
  const destinationAddress = useRecoilValue(DestinationAddress)
  const srcChainDepositHash = useRecoilValue(SrcChainDepositTxHash)
  useInterval(() => {
    if (depositTimestamp > 0 && !confirmedTx && !showConfirmButton) {
      const currentTimestamp = new Date().getTime()
      let overWaitTime =
        currentTimestamp - depositTimestamp > MS_UNTIL_CONFIRM_BTN_VISIBLE
      if (sourceChain?.module === "evm") {
        if (hasEnoughDepositConfirmation && overWaitTime) {
          setShowConfirmButton(true)
        }
      } else if (overWaitTime) {
        setShowConfirmButton(true)
      }
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
  // const afterFees: number = new BigNumber(1)
  //   .minus(new BigNumber(sourceChain?.txFeeInPercent || 0).div(100))
  //   .times(amountConfirmedAdjusted)
  //   .toNumber()

  const afterFees: number = new BigNumber(amountConfirmedAdjusted)
    .minus(
      getMinDepositAmount(sourceAsset, sourceChain, destinationChain) as number
    )
    .toNumber()

  const WalletLogo = ({ src }: { src: any }) => (
    <StyledSVGImage
      height={`1em`}
      width={`1em`}
      margin={`0em 0em -0.125em 0em`}
      src={src}
    />
  )

  const renderWalletButton = () => {
    if (props.isWalletConnected) return null

    if (sourceChain?.chainName?.toLowerCase() !== "terra") {
      const logo = sourceChain?.module === "evm" ? logoMetamask : logoKeplr
      const walletName = sourceChain?.module === "evm" ? "Metamask" : "Keplr"
      const walletType =
        sourceChain?.module === "evm" ? WalletType.METAMASK : WalletType.KEPLR
      return (
        <div>
          <FlexRow
            style={{
              width: `100%`,
              justifyContent: `flex-start`,
              marginTop: `0.5em`,
            }}
          >
            <div style={{ marginRight: `5px` }}>
              Send{" "}
              {sourceChain?.module === "axelarnet" ? "IBC transfer" : "deposit"}{" "}
              here via:
            </div>
            <HelperWidget onClick={() => props.connectToWallet(walletType)}>
              <WalletLogo src={logo} />
              <span style={{ marginLeft: "0.5em" }}>{walletName}</span>
            </HelperWidget>
          </FlexRow>
          {hasSelectedNativeAssetForChain(
            selectedSourceAsset as AssetInfo,
            sourceChain?.chainName
          ) && (
            <div
              style={{
                width: `100%`,
                justifyContent: `flex-start`,
                marginTop: `0.5em`,
                fontStyle: `italic`,
                fontSize: `0.8em`,
              }}
            >
              (Satellite accepts native {sourceChain?.chainSymbol} tokens and
              automatically converts them to W{sourceChain?.chainSymbol} for the
              required deposit.)
            </div>
          )}
        </div>
      )
    } else {
      return (
        <div style={{ marginTop: `0.5em` }}>
          <p>Send IBC transfer here via:</p>
          <FlexRow
            style={{
              justifyContent: `space-between`,
              width: `80%`,
            }}
          >
            <HelperWidget
              onClick={() => props.connectToWallet(WalletType.KEPLR)}
              style={{ marginRight: "2px" }}
            >
              <span style={{ marginRight: "5px" }}>Keplr Wallet</span>
              <WalletLogo src={logoKeplr} />
            </HelperWidget>
            <p style={{ marginRight: "2px" }}>OR</p>
            <HelperWidget
              onClick={() => props.connectToWallet(WalletType.TERRA)}
            >
              <span style={{ marginRight: "5px" }}>Terra Station</span>
              <WalletLogo src={logoTerraStation} />
            </HelperWidget>
          </FlexRow>
        </div>
      )
    }
  }

  const renderStep3 = () => {
    if (activeStep >= 3) {
      return (
        <div>
          <div>
            <BoldSpan>
              {+amountConfirmedAdjusted.toFixed(3)} {sourceAsset?.assetSymbol}
            </BoldSpan>{" "}
            deposit confirmed. Sending
          </div>
          <div>
            <BoldSpan>
              {+afterFees.toFixed(3)} {sourceAsset?.assetSymbol}
            </BoldSpan>{" "}
            to {destinationChain?.chainName} within the next ~
            {destinationChain?.chainName.toLowerCase() === "ethereum" ? 5 : 3}{" "}
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
              This is taking longer than expected...{" "}
            </p>
            <div style={{ display: "flex" }}>
              <HelperWidget
                onClick={() =>
                  window.open(
                    downstreamServices.txConfirmationTool[
                      process.env.REACT_APP_STAGE as string
                    ],
                    "_blank"
                  )
                }
                style={{ opacity: confirming ? 0.7 : 1 }}
              >
                {confirming
                  ? "Confirming..."
                  : "Open our Deposit Recovery Tool"}
              </HelperWidget>
            </div>
          </div>
        )
      } else if (confirmedTx && isBroadcastTxFailure(confirmedTx)) {
        return (
          <div>
            <a
              style={{ color: "rgb(252,68,68)" }}
              href={getAxelarTxLink(confirmedTx?.transactionHash || "")}
              target={"_blank"}
              rel="noreferrer"
            >
              Confirm tx failed
            </a>
          </div>
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
            Generating a one-time deposit address for{" "}
            {selectedSourceAsset?.assetSymbol} recipient:{" "}
            <BoldSpan>
              {getShortenedWord(destinationAddress as string, 5)}
            </BoldSpan>
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
              <div>
                Deposit address:{" "}
                <BoldSpan style={{ marginRight: `10px`}}>
                  {getShortenedWord(depositAddress?.assetAddress, 5)}
                </BoldSpan>
                <ImprovedTooltip
                  anchorContent={
                    <CopyToClipboard
                      JSXToShow={<span></span>}
                      height={`12px`}
                      width={`10px`}
                      textToCopy={depositAddress?.assetAddress || ""}
                      showImage={true}
                    />
                  }
                  tooltipText={"Advanced Usage: Copy this address to make this deposit from outside Satellite."}
                  tooltipAltText={"Copied! Please be sure you send the correct assets to this address."}
                />
              </div>
              {activeStep >= 3 && srcChainDepositHash
                ? linkToExplorer(sourceChain as ChainInfo, srcChainDepositHash)
                : renderWalletButton()}
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
