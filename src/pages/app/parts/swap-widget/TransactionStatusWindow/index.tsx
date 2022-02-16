import { AssetInfo } from "@axelar-network/axelarjs-sdk"
import styled, { ThemedStyledProps } from "styled-components"
import React, { useCallback, useEffect, useState } from "react"
import { confirm } from "react-confirm-box"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY } from "config/consts"
import screenConfigs from "config/screenConfigs"
import { StyledChainSelectionIconWidget } from "components/CompositeComponents/Selectors/ChainSelector/StyleComponents/StyledChainSelectionIconWidget"
import { SelectedChainLogoAndText } from "components/CompositeComponents/Selectors/ChainSelector/SelectedChainLogoAndText"
import { opacityAnimation } from "components/StyleComponents/animations/OpacityAnimation"
import { FlexRow } from "components/StyleComponents/FlexRow"
import configs from "config/downstreamServices"
import { StyledButton } from "components/StyleComponents/StyledButton"
import BoldSpan from "components/StyleComponents/BoldSpan"
import { PopoutLink } from "components/Widgets/PopoutLink"
import useResetAllState from "hooks/useResetAllState"
import { MetaMaskWallet } from "hooks/wallet/MetaMaskWallet"
import { KeplrWallet } from "hooks/wallet/KeplrWallet"
import { WalletInterface } from "hooks/wallet/WalletInterface"
import {
  MessageShownInCartoon,
  ShowDisclaimer,
  ShowLargeDisclaimer,
} from "state/ApplicationStatus"
import {
  ActiveStep,
  DidWaitingForDepositTimeout,
  IsRecaptchaAuthenticated,
  NumberConfirmations,
  SourceDepositAddress,
} from "state/TransactionStatus"
import { ChainSelection, SourceAsset } from "state/ChainSelection"
import StyledButtonContainer from "../StyledComponents/StyledButtonContainer"
import PlainButton from "../StyledComponents/PlainButton"
import StatusList from "./StatusList"
import Step2InfoForWidget from "./StatusList/Step2InfoForWidget"

interface ITransactionStatusWindowProps {
  isOpen: boolean
  closeResultsScreen: any
}

interface IStyledDivProps extends ThemedStyledProps<any, any> {
  appear?: any
}

const StyledHelperComponent = styled.div<IStyledDivProps>`
  position: absolute;
  z-index: 15;
  top: 10px;
  right: 0px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  box-sizing: border-box;
  padding: 0.4em;
  border-radius: 50px;
  width: auto;
  background-color: ${(props) => props.theme.headerBackgroundColor};
  color: white;
  cursor: pointer;

  @media ${screenConfigs.media.desktop} {
    margin-top: 0.75em;
    font-size: 1.1em;
    top: 0px;
  }
  @media ${screenConfigs.media.laptop} {
    margin-top: 0.5em;
  }
`

const StyledTransactionStatusWindow = styled.div`
  ${opacityAnimation}
  position: relative;
  overflow: hidden;
  margin-bottom: 5px;

  @media ${screenConfigs.media.desktop} {
    width: 100%;
    height: 685px;
    margin-bottom: 5px;
    margin-top: 50px;
  }
  @media ${screenConfigs.media.laptop} {
    width: 100%;
    height: 565px;
    margin-bottom: 20px;
  }
  @media ${screenConfigs.media.tablet} {
    width: 310px;
    height: 435px;
    margin-bottom: 5px;
  }
  @media ${screenConfigs.media.mobile} {
    width: 310px;
    height: 435px;
    margin-bottom: 5px;
  }
`

const StyledFlexRow = styled(FlexRow)`
  padding: 10px;
  box-sizing: border-box;
  border-radius: 9px;
  box-shadow: inset 0 0 3px 1px rgba(0, 0, 0, 0.16);
  background-color: #fefefe;
`

const StyledDialogBox = styled.div`
  height: 50%;
  width: 50%;
  min-width: 400px;
  background-color: white;
  padding: 2em;
  box-sizing: border-box;
  border-radius: 10px;
  font-size: 0.9em;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.22), inset 0 0 3px 0 #262426;
  border: solid 1px #b9bac8;
`

const TransactionStatusWindow = ({
  isOpen,
  closeResultsScreen,
}: ITransactionStatusWindowProps) => {
  const sourceConfirmStatus = useRecoilValue(
    NumberConfirmations(SOURCE_TOKEN_KEY)
  )
  const destinationConfirmStatus = useRecoilValue(
    NumberConfirmations(DESTINATION_TOKEN_KEY)
  )
  const destinationChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY))
  const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY))
  const depositAddress = useRecoilValue(SourceDepositAddress)
  const setCartoonMessage = useSetRecoilState(MessageShownInCartoon)
  const isRecaptchaAuthenticated = useRecoilValue(IsRecaptchaAuthenticated)
  const [activeStep, setActiveStep] = useRecoilState(ActiveStep)
  const resetAllstate = useResetAllState()
  const selectedSourceAsset = useRecoilValue(SourceAsset)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletBalance, setWalletBalance] = useState(0)
  const [walletAddress, setWalletAddress] = useState("")
  const setShowDisclaimer = useSetRecoilState(ShowDisclaimer)
  const setShowLargeDisclaimer = useSetRecoilState(ShowLargeDisclaimer)
  const [userConfirmed, setUserconfirmed] = useState(false)
  const [walletToUse, setWalletToUse] = useState<WalletInterface | null>()
  const didWaitingForDepositTimeout = useRecoilValue(
    DidWaitingForDepositTimeout
  )

  useEffect(() => {
    setShowDisclaimer(false)
    setShowLargeDisclaimer(true)
  }, [setShowDisclaimer, setShowLargeDisclaimer])

  const connectToWallet = async () => {
    if (sourceChain?.module === "evm") {
      let wallet: MetaMaskWallet = new MetaMaskWallet(
        sourceChain?.chainName.toLowerCase() as string
      )
      setWalletToUse(wallet)
      const isWalletInstalled: boolean = wallet.isWalletInstalled() as boolean
      setIsWalletConnected(isWalletInstalled)
      if (!isWalletInstalled) return
      await wallet.connectToWallet()
      const tokenAddress: string = await wallet.getOrFetchTokenAddress(
        selectedSourceAsset as AssetInfo
      )
      const balance = await wallet.getBalance(tokenAddress)
      setWalletBalance(balance)
      setWalletAddress(await wallet.getAddress())
    } else {
      let wallet: KeplrWallet = new KeplrWallet(
        sourceChain?.chainName.toLowerCase() as "axelar" | "terra"
      )
      setWalletToUse(wallet)
      const isWalletInstalled: boolean = wallet.isWalletInstalled() as boolean
      setIsWalletConnected(isWalletInstalled)
      if (!isWalletInstalled) return
      await wallet.connectToWallet()
      const balance: number = await wallet.getBalance(
        selectedSourceAsset?.common_key as string
      )
      setWalletBalance(balance)
      setWalletAddress(await wallet.getAddress())
    }
  }

  const updateBalance = useCallback(async () => {
    if (!walletToUse) return
    if (sourceChain?.module === "evm") {
      const tokenAddress: string = await (
        walletToUse as MetaMaskWallet
      ).getOrFetchTokenAddress(selectedSourceAsset as AssetInfo)
      const balance = await walletToUse.getBalance(tokenAddress)
      setWalletBalance(balance)
    } else {
      const balance: number = await walletToUse.getBalance(
        selectedSourceAsset?.common_key as string
      )
      setWalletBalance(balance)
    }
    setWalletAddress(await walletToUse.getAddress())
  }, [walletToUse, selectedSourceAsset, sourceChain?.module])

  const {
    numberConfirmations: sNumConfirms,
    numberRequiredConfirmations: sReqNumConfirms,
  } = sourceConfirmStatus
  const {
    numberConfirmations: dNumConfirms,
    numberRequiredConfirmations: dReqNumConfirms,
  } = destinationConfirmStatus

  useEffect(() => {
    //todo: need to improve this, the 'right' way of doing something like this is here: https://bugfender.com/blog/react-hooks-common-mistakes/
    console.log("render transaction status screen")
    switch (true) {
      case didWaitingForDepositTimeout:
        setCartoonMessage(null)
        break
      case !!(dNumConfirms && dReqNumConfirms):
        setActiveStep(4)
        break
      case depositAddress &&
        sNumConfirms &&
        sReqNumConfirms &&
        sNumConfirms >= sReqNumConfirms:
        setActiveStep(3)
        setCartoonMessage(null)
        break
      case depositAddress !== null:
        setActiveStep(2)
        setCartoonMessage(
          <Step2InfoForWidget
            isWalletConnected={isWalletConnected}
            walletBalance={walletBalance}
            reloadBalance={updateBalance}
            walletAddress={walletAddress}
            depositAddress={depositAddress as AssetInfo}
          />
        )
        break
      default:
        setActiveStep(1)
        break
    }
  }, [
    dNumConfirms,
    dReqNumConfirms,
    depositAddress,
    isWalletConnected,
    sNumConfirms,
    sReqNumConfirms,
    setCartoonMessage,
    setActiveStep,
    walletBalance,
    updateBalance,
    walletAddress,
    didWaitingForDepositTimeout,
  ])

  useEffect(() => {
    const options = {
      render: (
        message: string,
        onConfirm: () => void,
        onCancel: () => void
      ) => {
        return (
          <StyledDialogBox>
            <div>{message}</div>
            <br />
            <FlexRow>
              <StyledButton
                style={{ margin: `0.5em`, backgroundColor: `grey` }}
                onClick={onCancel}
              >
                {" "}
                Go back{" "}
              </StyledButton>
              <br />
              <StyledButton style={{ margin: `0.5em` }} onClick={onConfirm}>
                {" "}
                Confirm{" "}
              </StyledButton>
            </FlexRow>
          </StyledDialogBox>
        )
      },
    }
    if (sourceChain?.module === "evm" && activeStep === 2 && !userConfirmed) {
      const message: any = (
        <div>
          Be sure to send only the{" "}
          {
            <BoldSpan>
              Axelar version of {selectedSourceAsset?.assetSymbol}
            </BoldSpan>
          }{" "}
          to the deposit address on {sourceChain.chainName}. Any other tokens
          sent to this address will be lost.
          <br />
          <br />
          The correct ERC20 contract address for the Axelar version of{" "}
          {selectedSourceAsset?.assetSymbol} can be verified{" "}
          <PopoutLink
            text={"here"}
            onClick={() =>
              window.open(
                configs.tokenContracts[process.env.REACT_APP_STAGE as string],
                "_blank"
              )
            }
          />
        </div>
      )
      confirm(message, options as any).then((positiveAffirmation) => {
        if (positiveAffirmation) {
          setUserconfirmed(true)
        } else {
          resetAllstate()
          closeResultsScreen()
        }
      })
    }
  }, [
    resetAllstate,
    selectedSourceAsset,
    sourceChain,
    userConfirmed,
    closeResultsScreen,
    activeStep,
  ])

  const showButton: boolean = activeStep > 2

  return (
    <StyledTransactionStatusWindow>
      <FlexRow style={{ color: `white` }}>
        {activeStep < 4 ? "Transferring" : "Complete!"}
      </FlexRow>
      <br />
      <br />
      <StyledHelperComponent
        onClick={() => {
          resetAllstate()
          closeResultsScreen()
        }}
      >
        <div style={{ marginLeft: `5px`, fontSize: `0.75em` }}>Start Over</div>
      </StyledHelperComponent>
      <StyledFlexRow>
        <StyledChainSelectionIconWidget>
          <SelectedChainLogoAndText chainInfo={sourceChain} />
        </StyledChainSelectionIconWidget>
        <img
          src={
            require(`assets/svg/transaction_status_logos/transferring-icon.svg`)
              ?.default
          }
          alt={""}
        />
        <img
          src={
            require(`assets/svg/transaction_status_logos/transferring-icon.svg`)
              ?.default
          }
          alt={""}
        />
        <StyledChainSelectionIconWidget
          style={{ display: `flex`, justifyContent: `flex-end` }}
        >
          <SelectedChainLogoAndText chainInfo={destinationChain} />
        </StyledChainSelectionIconWidget>
      </StyledFlexRow>
      {isRecaptchaAuthenticated ? (
        <StatusList
          activeStep={activeStep}
          isWalletConnected={isWalletConnected}
          connectToWallet={connectToWallet}
        />
      ) : (
        <FlexRow>
          <br />
          The transaction was not initiated. Some error occurred, potentially
          including a failed recaptcha authentication
        </FlexRow>
      )}
      <br />

      <StyledButtonContainer>
        {showButton && (
          <PlainButton
            disabled={!showButton}
            dim={!showButton}
            onClick={() => {
              resetAllstate()
              closeResultsScreen()
            }}
          >
            Start New Transaction
          </PlainButton>
        )}
      </StyledButtonContainer>
    </StyledTransactionStatusWindow>
  )
}

export default TransactionStatusWindow
