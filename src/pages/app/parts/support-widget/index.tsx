import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import {
  ActiveStep,
  SourceDepositAddress,
  SrcChainDepositTxHash,
  TransactionTraceId,
} from "state/TransactionStatus"
import styled, { css } from "styled-components"
import Tooltip from "components/Widgets/Tooltip"
import CopyToClipboard from "components/Widgets/CopyToClipboard"
import BoldSpan from "components/StyleComponents/BoldSpan"
import { FlexRow } from "components/StyleComponents/FlexRow"
import { SVGImage } from "components/Widgets/SVGImage"
import { DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY } from "config/consts"
import configs from "config/downstreamServices"
import { Nullable } from "interface/Nullable"
import {
  ShowDisclaimer,
  ShowDisclaimerFromFAQ,
  ShowLargeDisclaimer,
} from "state/ApplicationStatus"
import { ChainSelection, DestinationAddress } from "state/ChainSelection"
import {
  ShowFAQ,
  ShowGettingStartedWidget,
  ShowSupportWidget,
} from "state/FAQWidget"
import { toProperCase } from "utils/toProperCase"
import { getShortenedWord } from "utils/wordShortener"
import { QASection } from "./QA"
import { AssetInfo, ChainInfo } from "@axelar-network/axelarjs-sdk"
import { ReactElement } from "react"
import StyledLink from "components/Widgets/Link"

const StyledHelperComponent = styled.div`
  position: absolute;
  z-index: 15;
  bottom: 70px;
  right: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 30%;
  min-width: 275px;
  max-width: 500px;
`

const StyledPopup = styled.div`
  background-color: rgb(255, 255, 255, 0.9);
  color: ${(props) => props.theme.headerBackgroundColor};
  box-sizing: border-box;
  border: 2px solid #b9bac8;
  border-radius: 10px;
  overflow-wrap: break-word;
  background-color: white;
  width: 100%;
  font-size: 0.9em;
`

export const StyledHeader = styled.div`
  position: relative;
  width: 100%;
  background-color: ${(props) => props.theme.headerBackgroundColor};
  border-radius: 7px 7px 0px 0px;
  color: white;
  text-align: center;
  font-size: large;
  box-sizing: border-box;
  padding: 0.25em;
  margin-bottom: 1em;
`

const SupportSection = styled.div`
  box-sizing: border-box;
  padding: 0.75em;
`

const ContactUsSection = styled(SupportSection)`
  background-color: #bab9c8;
  padding-bottom: 0.1em;
`

export const SupportWidget = () => {
  const transactionTraceId = useRecoilValue(TransactionTraceId)
  const setShowDisclaimer = useSetRecoilState(ShowDisclaimer)
  const setShowLargeDisclaimer = useSetRecoilState(ShowLargeDisclaimer)
  const setShowDisclaimerFromFAQ = useSetRecoilState(ShowDisclaimerFromFAQ)
  const depositAddress = useRecoilValue(SourceDepositAddress)
  const [showSupport, setShowSupport] = useRecoilState(ShowSupportWidget)
  const [showGettingStarted, setShowGettingStarted] = useRecoilState(
    ShowGettingStartedWidget
  )
  const [showFAQ, setShowFAQ] = useRecoilState(ShowFAQ)
  const destAddr = useRecoilValue(DestinationAddress)
  const srcChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY))
  const destChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY))
  const srcChainDepositTxHash = useRecoilValue(SrcChainDepositTxHash)
  const [activeStep] = useRecoilState(ActiveStep)
  // const setShowTransactionHistory = useSetRecoilState(ShowTransactionHistoryPage);

  return (
    <StyledHelperComponent>
      {showFAQ && (
        <StyledPopup>
          <StyledHeader>
            <span>Frequently Asked Questions</span>
            <div
              style={{
                position: `absolute`,
                right: 8,
                top: 5,
                cursor: `pointer`,
              }}
              onClick={() => setShowFAQ(false)}
            >
              <img
                src={require(`assets/svg/close-icon.svg`).default}
                alt={""}
              />
            </div>
          </StyledHeader>
          <div
            style={{
              width: `100%`,
              height: `100%`,
              boxSizing: `border-box`,
              padding: `1em`,
              marginTop: `-1em`,
            }}
          >
            <QASection />
          </div>
        </StyledPopup>
      )}
      {showGettingStarted && (
        <StyledPopup>
          <StyledHeader>
            <span>Getting Started</span>
            <div
              style={{
                position: `absolute`,
                right: 8,
                top: 5,
                cursor: `pointer`,
              }}
              onClick={() => setShowGettingStarted(false)}
            >
              <img
                src={require(`assets/svg/close-icon.svg`).default}
                alt={""}
              />
            </div>
          </StyledHeader>
          <SupportSection>
            <NewLink
              text={"Instructional Video"}
              onClick={() =>
                window.open(
                  "https://www.youtube.com/watch?v=KYmWEbW69LQ",
                  "_blank"
                )
              }
            />
            <DescriptorText>
              One of our devs records himself walking through a transaction from
              start to finish.
            </DescriptorText>
            <NewLink
              text={"Medium Instructional Guide"}
              onClick={() =>
                window.open(
                  "https://socialaxl.medium.com/f6480c7ff20c",
                  "_blank"
                )
              }
            />
            <DescriptorText>
              A step-by-step Medium post with screenshots at each step of the
              way through a transaction.
            </DescriptorText>
            <NewLink
              text={`Token Contracts & Channel IDs (${toProperCase(
                process.env.REACT_APP_STAGE as string
              )})`}
              onClick={() =>
                window.open(
                  configs.tokenContracts[process.env.REACT_APP_STAGE as string],
                  "_blank"
                )
              }
            />
            <DescriptorText>
              An IMPORTANT document with the token contract addresses for all
              assets across EVM chains. Also includes our channel ID on Terra.{" "}
            </DescriptorText>
            <NewLink
              text={`Minimum Transfer Amounts`}
              onClick={() =>
                window.open(
                  configs.tokenContracts[
                    process.env.REACT_APP_STAGE as string
                  ] + "#minimum-transfer-amounts",
                  "_blank"
                )
              }
            />
            <DescriptorText>
              Minimum amounts depend on the selected destination chain. This
              document lists all of them in a table.{" "}
            </DescriptorText>
            <NewLink
              text={`Transaction Fees`}
              onClick={() =>
                window.open(
                  configs.tokenContracts[
                    process.env.REACT_APP_STAGE as string
                  ] + "#transaction-fees",
                  "_blank"
                )
              }
            />
            <DescriptorText>
              Note regarding relevant processing fees for any transaction that
              flows through the network.{" "}
            </DescriptorText>
            <NewLink
              text={`Axelar Website`}
              onClick={() => window.open("https://axelar.network", "_blank")}
            />
            <DescriptorText>
              <div>A little more about us.</div>
            </DescriptorText>
          </SupportSection>
        </StyledPopup>
      )}
      {showSupport && (
        <StyledPopup>
          <StyledHeader>
            <span>Support</span>
            <div
              style={{
                position: `absolute`,
                right: 8,
                top: 5,
                cursor: `pointer`,
              }}
              onClick={() => setShowSupport(false)}
            >
              <img
                src={require(`assets/svg/close-icon.svg`).default}
                alt={""}
              />
            </div>
          </StyledHeader>
          <SupportSection>
            <StyledBoldText>AXELAR SOCIAL LINKS</StyledBoldText>
            <br />
            <SubLink
              text="Discord"
              onClick={() =>
                window.open("https://discord.com/invite/aRZ3Ra6f7D", "_blank")
              }
              description={
                <>
                  <BoldSpan>#satellite-cross-chain-chat</BoldSpan> for general
                  support.
                </>
              }
            />
            <SubLink
              text="Twitter (@axl_satellite)"
              onClick={() =>
                window.open("https://twitter.com/axl_satellite", "_blank")
              }
              description={<>Latest updates on Satellite.</>}
            />
            <SubLink
              text="Twitter (@axl_status)"
              onClick={() =>
                window.open("https://twitter.com/axl_status", "_blank")
              }
              description={<>Latest updates on Axelar.</>}
            />
            <br />
            <NewLink
              text={"TRANSACTION SEARCH"}
              onClick={() =>
                window.open("https://crosschain.axelarscan.io", "_blank")
              }
            />
            <DescriptorText>
              <div>
                Search transaction history by destination and/or deposit address.
              </div>
            </DescriptorText>
            <br />
            <NewLink
              text={"TERMS OF USE"}
              onClick={() => {
                setShowDisclaimer(true)
                setShowLargeDisclaimer(true)
                setShowDisclaimerFromFAQ(true)
              }}
            />
            <DescriptorText>
              <div>
                Before using Satellite, you should be comfortable with our Terms
                of Use.
              </div>
            </DescriptorText>
          </SupportSection>
          {transactionTraceId && (
            <ContactUsSection>
              <h3>Issues with a live transaction?</h3>
              <h4>Manual Deposit Confirmation</h4>
              <div style={{ marginBottom: `1em` }}>
                Open our {" "}
                <StyledLink
                  href={
                    configs.txConfirmationTool[
                      process.env.REACT_APP_STAGE as string
                    ]
                  }
                >
                  <BoldSpan>Deposit Recovery Tool</BoldSpan>
                </StyledLink>{" "}
                to manually confirm your deposit transaction, or:
              </div>
              <h4>Create a Zendesk ticket</h4>
              <div style={{ marginBottom: `1em` }}>
                <StyledLink href="https://axelar.zendesk.com/hc/en-us">
                  <BoldSpan>Open Zendesk</BoldSpan>
                </StyledLink>{" "}
                and include these Support Details:
              </div>
              <Tooltip
                anchorContent={
                  <CopyToClipboard
                    JSXToShow={
                      <>
                        <div>
                          <BoldSpan>Trace ID: </BoldSpan>
                          {getShortenedWord(transactionTraceId, 5)}
                        </div>
                        {activeStep > 0 && (
                          <div>
                            <BoldSpan>Stuck on Step: </BoldSpan>
                            {activeStep}
                          </div>
                        )}
                        {srcChain && (
                          <div>
                            <BoldSpan>Source Chain: </BoldSpan>
                            {srcChain.chainName}
                          </div>
                        )}
                        {depositAddress && (
                          <div>
                            <BoldSpan>Deposit Address: </BoldSpan>
                            {getShortenedWord(depositAddress?.assetAddress, 5)}
                          </div>
                        )}
                        {srcChainDepositTxHash && (
                          <div>
                            <BoldSpan>
                              Deposit TxHash on {srcChain?.chainName}:{" "}
                            </BoldSpan>
                            {getShortenedWord(srcChainDepositTxHash, 5)}
                          </div>
                        )}
                        {destChain && (
                          <div>
                            <BoldSpan>Destination Chain: </BoldSpan>
                            {destChain.chainName}
                          </div>
                        )}
                        {destAddr && (
                          <div>
                            <BoldSpan>Destination Address: </BoldSpan>
                            {getShortenedWord(destAddr, 5)}
                          </div>
                        )}
                      </>
                    }
                    height={`12px`}
                    width={`10px`}
                    textToCopy={getTextToCopy(
                      transactionTraceId,
                      depositAddress,
                      srcChain,
                      destChain,
                      srcChainDepositTxHash,
                      activeStep,
                      destAddr || ""
                    )}
                    showImage={false}
                  />
                }
                tooltipText={
                  transactionTraceId && depositAddress
                    ? "Copy Data to Clipboard"
                    : "Copy to Clipboard"
                }
                tooltipAltText={"Copied to Clipboard!"}
              />
            </ContactUsSection>
          )}
        </StyledPopup>
      )}
    </StyledHelperComponent>
  )
}

const getTextToCopy = (
  transactionTraceId: string,
  depositAddress: Nullable<AssetInfo>,
  srcChain: Nullable<ChainInfo>,
  destChain: Nullable<ChainInfo>,
  srcChainDepositTxHash: string | null,
  activeStep: number,
  destAddr: string
) => {
  return `* Trace ID: ${transactionTraceId}
${activeStep > 0 ? `* Stuck on Step: ${activeStep}\n` : ""}\
${depositAddress ? `* Asset: ${depositAddress.assetSymbol}\n` : ""}\
${srcChain ? `* Source Chain: ${srcChain.chainName}\n` : ""}\
${depositAddress ? `* Deposit Address: ${depositAddress.assetAddress}\n` : ""}\
${
  srcChainDepositTxHash
    ? `* Deposit TxHash on ${srcChain?.chainName}: ${srcChainDepositTxHash}\n`
    : ""
}\
${destChain ? `* Destination Chain: ${destChain.chainName}\n` : ""}\
${destAddr ? `* Destination Address: ${destAddr}\n` : ""}\
`
}
const StyledText = styled(FlexRow)`
  justify-content: flex-start;
  margin-bottom: 0.25em;
`
const Italics = css`
  font-style: italic;
  margin-bottom: 1em;
  color: #898994;
  font-size: 0.9em;
`

const DescriptorText = styled(StyledText)`
  ${Italics}
`

const StyledBoldText = styled(StyledText)`
  font-weight: bold;
`

const LinkStyles = css`
  cursor: pointer;
  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: underline;
  }
`
const StyledNewLink = styled(StyledBoldText)`
  ${LinkStyles}
`

export const NewLink = ({
  text,
  onClick,
  link,
}: {
  text: string
  onClick?: any
  link?: string
}) => {
  return (
    <StyledNewLink onClick={onClick}>
      {text}
      {"  "}
      <SVGImage
        style={{ marginLeft: `5px` }}
        src={require(`assets/svg/link-new-tab.svg`).default}
        height={`1em`}
        width={`1em`}
      />
    </StyledNewLink>
  )
}

const StyledAnchor = styled.span`
  ${LinkStyles}
`
const StyledDescription = styled.span`
  ${Italics}
`
export const SubLink = ({
  text,
  onClick,
  description,
}: {
  text: string
  onClick?: any
  description: string | ReactElement
}) => {
  return (
    <div style={{ marginBottom: `0.5em` }}>
      <StyledAnchor onClick={onClick} style={{ marginRight: `0.25em` }}>
        <BoldSpan>{text}</BoldSpan>
      </StyledAnchor>
      <StyledDescription>{description}</StyledDescription>
    </div>
  )
}
