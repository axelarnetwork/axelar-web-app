import React from "react"
import { ChainInfo } from "@axelar-network/axelarjs-sdk"
import styled from "styled-components"
import screenConfigs from "config/screenConfigs"
import { useRecoilValue } from "recoil"
import { DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY } from "config/consts"
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
  IConfirmationStatus,
  NumberConfirmations,
  SourceDepositAddress,
  SrcChainDepositTxHash,
} from "state/TransactionStatus"
import { getShortenedWord } from "utils/wordShortener"
import BigNumber from "decimal.js"

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
  const selectedSourceAsset = useRecoilValue(SourceAsset)
  const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY))
  const destinationChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY))
  const depositAddress = useRecoilValue(SourceDepositAddress)
  const destNumConfirm: IConfirmationStatus = useRecoilValue(
    NumberConfirmations(DESTINATION_TOKEN_KEY)
  )
  const destinationAddress = useRecoilValue(DestinationAddress)
  const srcChainDepositHash = useRecoilValue(SrcChainDepositTxHash)

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
                          {getShortenedWord(depositAddress?.assetAddress, 4)}{" "}
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
        text={
          activeStep >= 3 ? (
            <div>
              <div>
                <BoldSpan>
                  {+amountConfirmedAdjusted.toFixed(2)}{" "}
                  {sourceAsset?.assetSymbol}
                </BoldSpan>{" "}
                deposit confirmed. Sending
              </div>
              <div>
                <BoldSpan>
                  {+afterFees.toFixed(2)} {sourceAsset?.assetSymbol}
                </BoldSpan>{" "}
                to {destinationChain?.chainName} within the next ~
                {destinationChain?.chainName.toLowerCase() === "ethereum"
                  ? 30
                  : 3}{" "}
                min.
              </div>
            </div>
          ) : (
            `Detecting your deposit on ${sourceChain?.chainName}.`
          )
        }
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
      <Link href={`${blockExplorer.url}${txHash}`}>Deposit Confirmation</Link>
    </div>
  ) : null
}

export default StatusList
