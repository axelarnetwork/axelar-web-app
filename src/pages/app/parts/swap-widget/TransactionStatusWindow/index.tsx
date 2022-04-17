import {
  AssetInfo,
  ChainInfo,
  getConfigs,
} from "@axelar-network/axelarjs-sdk"
import styled, { ThemedStyledProps } from "styled-components"
import { useCallback, useEffect, useState } from "react"
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
import {
  terraConfigMainnet,
  terraConfigTestnet,
  TerraWallet,
} from "hooks/wallet/TerraWallet"
import { WalletInterface } from "hooks/wallet/WalletInterface"
import {
  MessageShownInCartoon,
  ShowDisclaimer,
  ShowLargeDisclaimer,
} from "state/ApplicationStatus"
import {
  ActiveStep,
  DidWaitingForDepositTimeout,
  HasEnoughDepositConfirmation,
  IConfirmationStatus,
  NumberConfirmations,
  SourceDepositAddress,
  SrcChainDepositTxHash,
} from "state/TransactionStatus"
import {
  ChainSelection,
  DestinationAddress,
  SourceAsset,
} from "state/ChainSelection"
import StyledButtonContainer from "../StyledComponents/StyledButtonContainer"
import PlainButton from "../StyledComponents/PlainButton"
import StatusList from "./StatusList"
import Step2InfoForWidget from "./StatusList/Step2InfoForWidget"
import {
  useConnectedWallet,
  useLCDClient,
  useWallet,
  WalletLCDClientConfig,
} from "@terra-money/wallet-provider"
import { IsKeplrWalletConnected, SelectedWallet, WalletType } from "state/Wallet"
import {
  buildDepositConfirmationRoomId,
} from "api/AxelarEventListener"
import { SocketService } from "api/WaitService/SocketService"
import { transferEvent } from "api/WaitService"
import { FlexColumn } from "components/StyleComponents/FlexColumn"

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
  width: 25%;
  min-width: 400px;
  background-color: white;
  padding: 2em;
  box-sizing: border-box;
  border-radius: 10px;
  font-size: 0.9em;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.22), inset 0 0 3px 0 #262426;
  border: solid 1px #b9bac8;
`
const options = {
  render: (message: string, onConfirm: () => void, onCancel: () => void) => {
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

const TransactionStatusWindow = ({
  isOpen,
  closeResultsScreen,
}: ITransactionStatusWindowProps) => {
  const [, setSourceConfirmStatus] = useRecoilState(
    NumberConfirmations(SOURCE_TOKEN_KEY)
  )
  const [destinationConfirmStatus, setDestinationConfirmStatus] =
    useRecoilState(NumberConfirmations(DESTINATION_TOKEN_KEY))
  const destinationChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY))
  const destinationAddress = useRecoilValue(DestinationAddress)
  const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY))
  const depositAddress = useRecoilValue(SourceDepositAddress)
  const setCartoonMessage = useSetRecoilState(MessageShownInCartoon)
  const [activeStep, setActiveStep] = useRecoilState(ActiveStep)
  const [selectedWallet, setSelectedWallet] =
    useRecoilState<WalletType>(SelectedWallet)
  const resetAllstate = useResetAllState()
  const selectedSourceAsset = useRecoilValue(SourceAsset)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletBalance, setWalletBalance] = useState(0)
  const [walletAddress, setWalletAddress] = useState("")
  const setShowDisclaimer = useSetRecoilState(ShowDisclaimer)
  const setShowLargeDisclaimer = useSetRecoilState(ShowLargeDisclaimer)
  const [userConfirmed, setUserconfirmed] = useState(false)
  const [walletToUse, setWalletToUse] = useState<WalletInterface | null>()
  const terraWallet = useWallet()
  const [, setIsKeplrWalletConnected] = useRecoilState(IsKeplrWalletConnected);
  const txHash = useRecoilValue(SrcChainDepositTxHash)
  const [hasEnoughDepositConfirmation,] =
    useRecoilState(HasEnoughDepositConfirmation)
  const lcdClient = useLCDClient(
    (process.env.REACT_APP_STAGE === "mainnet"
      ? terraConfigMainnet
      : terraConfigTestnet) as WalletLCDClientConfig
  )
  const connectedWallet = useConnectedWallet()
  const didWaitingForDepositTimeout = useRecoilValue(
    DidWaitingForDepositTimeout
  )

  useEffect(() => {
    if (selectedWallet !== WalletType.TERRA) return

    let msg = ""

    const isMainnet = process.env.REACT_APP_STAGE === "mainnet"

    if (isMainnet && terraWallet?.network?.chainID !== "columbus-5") {
      msg =
        "Your Terra Station extension is not set to mainnet. Please switch those settings before trying to send any funds."
    } else if (!isMainnet && terraWallet?.network?.chainID !== "bombay-12") {
      msg =
        "Your Terra Station extension is not set to testnet. Please switch those settings before trying to send any funds."
    } else return

    const message: any = (
      <FlexColumn>
        <h3>
          <BoldSpan>Warning</BoldSpan>
        </h3>
        {msg}
      </FlexColumn>
    )
    confirm(message, options as any).then((positiveAffirmation) => {
      if (!positiveAffirmation) {
        resetAllstate()
        closeResultsScreen()
      }
    })
  }, [selectedWallet, terraWallet, closeResultsScreen, resetAllstate])

  useEffect(() => {
    setShowDisclaimer(false)
    setShowLargeDisclaimer(true)
  }, [setShowDisclaimer, setShowLargeDisclaimer])

  const connectToWallet = async (walletType: WalletType) => {
    setSelectedWallet(walletType)
    if (walletType === WalletType.METAMASK) {
      let wallet: MetaMaskWallet = new MetaMaskWallet(
        sourceChain?.chainName.toLowerCase() as string
      )
      setWalletToUse(wallet)
      const isWalletInstalled: boolean = wallet.isWalletInstalled() as boolean
      setIsWalletConnected(isWalletInstalled)
      if (!isWalletInstalled) return
      await wallet.connectToWallet()
      const balance = await wallet.getBalance(selectedSourceAsset as AssetInfo, sourceChain?.chainName)
      setWalletBalance(balance)
      setWalletAddress(await wallet.getAddress())
    } else {
      let wallet: WalletInterface
      if (!sourceChain?.chainName) return

      if (walletType === WalletType.TERRA) {
        wallet = new TerraWallet(terraWallet, lcdClient, connectedWallet)
      } else {
        wallet = new KeplrWallet(sourceChain?.chainName.toLowerCase())
      }

      const isWalletInstalled: boolean = wallet.isWalletInstalled() as boolean
      if (!isWalletInstalled) return
      await wallet.connectToWallet(walletType === WalletType.KEPLR ? () => setIsKeplrWalletConnected(true) : null)

      const address = await wallet.getAddress()
      if (!address) return
      setWalletToUse(wallet)
      setIsWalletConnected(isWalletInstalled)
      const balance: number = await wallet.getBalance(
        selectedSourceAsset as AssetInfo
      )
      setWalletBalance(balance)
      setWalletAddress(address)
    }
  }

  const updateBalance = useCallback(async () => {
    if (!walletToUse) return

    const balance = await walletToUse.getBalance(
      selectedSourceAsset as AssetInfo,
      sourceChain?.chainName
    )
    setWalletBalance(balance)
    setWalletAddress(await walletToUse.getAddress())
  }, [walletToUse, selectedSourceAsset, sourceChain?.chainName])


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
      case txHash && txHash.length > 0 && hasEnoughDepositConfirmation:
        setActiveStep(3)
        setCartoonMessage(null)
        break
      case depositAddress !== null:
        setActiveStep(2)
        break
      default:
        setActiveStep(1)
        break
    }
  }, [
    dNumConfirms,
    dReqNumConfirms,
    depositAddress,
    setCartoonMessage,
    setActiveStep,
    didWaitingForDepositTimeout,
    txHash,
    hasEnoughDepositConfirmation
  ])

  useEffect(() => {
    if (activeStep !== 2) return

    setCartoonMessage(
      <Step2InfoForWidget
        isWalletConnected={isWalletConnected}
        walletBalance={walletBalance}
        reloadBalance={updateBalance}
        walletAddress={walletAddress}
        depositAddress={depositAddress as AssetInfo}
      />
    )
  }, [
    activeStep,
    depositAddress,
    isWalletConnected,
    setCartoonMessage,
    updateBalance,
    walletAddress,
    walletBalance,
  ])

  useEffect(() => {
    ;(async () => {
      if (activeStep !== 2) return

      const roomId = buildDepositConfirmationRoomId(
        sourceChain?.module as string,
        depositAddress?.assetAddress as string,
        sourceChain?.chainName as string,
        destinationChain?.chainName as string,
        selectedSourceAsset?.common_key as string
      )

      const res = await new SocketService(
        getConfigs(process.env.REACT_APP_STAGE as string).resourceUrl
      ).joinRoomAndWaitForEvent(roomId)

      const confirms: IConfirmationStatus = {
        numberConfirmations: 1,
        numberRequiredConfirmations: 1,
        transactionHash: "",
        amountConfirmedString: res?.Attributes?.amount,
      }
      setSourceConfirmStatus(confirms)
    })()
  }, [
    activeStep,
    depositAddress,
    selectedSourceAsset,
    sourceChain,
    destinationChain,
    setSourceConfirmStatus,
  ])

  useEffect(() => {
    ;(async () => {
      if (activeStep !== 3) return

      const res = await transferEvent(destinationChain as ChainInfo, selectedSourceAsset as AssetInfo, destinationAddress as string)

      const confirms: IConfirmationStatus = {
        numberConfirmations: 1,
        numberRequiredConfirmations: 1,
        transactionHash: res.transactionHash,
        amountConfirmedString: "",
      }
      setDestinationConfirmStatus(confirms)
    })()
  }, [
    activeStep,
    destinationChain,
    sourceChain,
    selectedSourceAsset,
    destinationAddress,
    setDestinationConfirmStatus,
  ])

  useEffect(() => {
    if (
      sourceChain?.module === "evm" &&
      activeStep === 2 &&
      !userConfirmed &&
      sourceChain.chainName.toLowerCase() !== selectedSourceAsset?.native_chain
    ) {
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
        {activeStep < 3 ? "Transferring" : "Complete!"}
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
      <StatusList
        activeStep={activeStep}
        isWalletConnected={isWalletConnected}
        connectToWallet={connectToWallet}
      />
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
