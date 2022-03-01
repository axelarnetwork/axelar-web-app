import React, {
  createRef,
  KeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import styled from "styled-components"
import {
  AssetInfo,
  ChainInfo,
  validateDestinationAddress,
} from "@axelar-network/axelarjs-sdk"
import { InputForm } from "components/CompositeComponents/InputForm"
import ChainSelector from "components/CompositeComponents/Selectors/ChainSelector"
import SwapChains from "components/CompositeComponents/SwapChains"
import TransactionInfo from "components/CompositeComponents/TransactionInfo"
import { FlexColumn } from "components/StyleComponents/FlexColumn"
import { SVGImage } from "components/Widgets/SVGImage"
import ValidationErrorWidget from "components/Widgets/ValidationErrorWidget"
import { DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY } from "config/consts"
import screenConfigs from "config/screenConfigs"
import useResetUserInputs from "hooks/useResetUserInputs"
import { MetaMaskWallet } from "hooks/wallet/MetaMaskWallet"
import { KeplrWallet } from "hooks/wallet/KeplrWallet"
import { WalletInterface } from "hooks/wallet/WalletInterface"
import {
  ChainSelection,
  DestinationAddress,
  IsValidDestinationAddress,
  SourceAsset,
} from "state/ChainSelection"
import StyledButtonContainer from "../StyledComponents/StyledButtonContainer"
import PlainButton from "../StyledComponents/PlainButton"
import TopFlowsSelectorWidget from "../TopFlowsSelector"
import { SendLogsToServer } from "api/SendLogsToServer"
import { BannedAddresses } from "state/ChainList"
import { IsTxSubmitting } from "state/TransactionStatus"

interface IUserInputWindowProps {
  handleTransactionSubmission: () => Promise<string>
}

const StyledUserInputWindow = styled.div`
  position: relative;
  overflow-y: hidden;

  @media ${screenConfigs.media.desktop} {
    width: 100%;
    margin-top: 50px;
    height: 685px;
  }
  @media ${screenConfigs.media.laptop} {
    width: 100%;
    height: 545px;
  }
  @media ${screenConfigs.media.tablet} {
    width: 310px;
    height: 425px;
  }
  @media ${screenConfigs.media.mobile} {
    width: 310px;
    height: 425px;
  }
`

const StyledChainSelectorSection = styled.div`
  overflow-y: hidden;
  @media ${screenConfigs.media.desktop} {
    max-height: 500px;
    margin-top: 25px;
  }
  @media ${screenConfigs.media.laptop} {
    max-height: 425px;
  }
  @media ${screenConfigs.media.tablet} {
    max-height: 350px;
  }
  @media ${screenConfigs.media.mobile} {
    max-height: 350px;
  }
`

const StyledInputFormSection = styled(FlexColumn)`
  @media ${screenConfigs.media.desktop} {
    margin-top: 50px;
    margin-bottom: 25px;
  }
  @media ${screenConfigs.media.laptop} {
    margin-top: 30px;
    margin-bottom: 20px;
  }
  @media ${screenConfigs.media.tablet} {
    margin-top: 5px;
    margin-bottom: 0px;
  }
  @media ${screenConfigs.media.mobile} {
    margin-top: 5px;
    margin-bottom: 0px;
  }
`

const StyledSVGImage = styled(SVGImage)`
  cursor: pointer;
`

const UserInputWindow = ({
  handleTransactionSubmission,
}: IUserInputWindowProps) => {
  const sourceChainSelection = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY))
  const destChainSelection = useRecoilValue(
    ChainSelection(DESTINATION_TOKEN_KEY)
  )
  const selectedSourceAsset = useRecoilValue(SourceAsset)
  const [destAddr, setDestAddr] = useRecoilState(DestinationAddress)
  const [isValidDestinationAddress, setIsValidDestinationAddress] =
    useRecoilState(IsValidDestinationAddress)
  const resetUserInputs = useResetUserInputs()
  const [showValidationErrors, setShowValidationErrors] = useState(false)
  const bannedAddresses = useRecoilValue<string[]>(BannedAddresses)
  const [isSubmitting, setIsSubmitting] = useRecoilState(IsTxSubmitting)
  const srcChainComponentRef = createRef()
  const destChainComponentRef = createRef()

  useEffect(() => {
    const destToken: AssetInfo = {
      assetAddress: destAddr as string,
      assetSymbol: destChainSelection?.chainSymbol,
    }
    const validAddr: boolean = validateDestinationAddress(
      destChainSelection?.chainSymbol as string,
      destToken
    )
    setIsValidDestinationAddress(validAddr)
  }, [destAddr, destChainSelection, setIsValidDestinationAddress])

  const onInitiateTransfer = useCallback(async () => {
    if (!(destAddr && isValidDestinationAddress)) return

    setIsSubmitting(true)
    try {
      await handleTransactionSubmission()
    } catch (e: any) {
      if (![403.1].includes(e.statusCode)) resetUserInputs()
      SendLogsToServer.error(
        "UserInputWindow_onInitiateTransfer",
        JSON.stringify(e),
        "NO_UUID"
      )
    }
  }, [
    destAddr,
    isValidDestinationAddress,
    handleTransactionSubmission,
    resetUserInputs,
    setIsSubmitting
  ])

  const renderValidationErrors = useCallback(() => {
    if (!sourceChainSelection)
      return <ValidationErrorWidget text={`Select a source chain.`} />
    if (!selectedSourceAsset)
      return (
        <ValidationErrorWidget text={`Select an asset on the source chain.`} />
      )
    if (!destChainSelection)
      return <ValidationErrorWidget text={`Select a destination chain.`} />
    if (sourceChainSelection.chainName === destChainSelection.chainName)
      return (
        <ValidationErrorWidget
          text={`Source and destination chains can't be equal.`}
        />
      )
    if (!isValidDestinationAddress)
      return (
        <ValidationErrorWidget
          text={`Invalid input address for ${destChainSelection.chainName}.`}
        />
      )
    if (destAddr && bannedAddresses.includes(destAddr))
      return <ValidationErrorWidget text={`Cannot send to a Token Contract`} />
  }, [
    sourceChainSelection,
    destChainSelection,
    selectedSourceAsset,
    isValidDestinationAddress,
    bannedAddresses,
    destAddr,
  ])

  const enableSubmitBtn =
    sourceChainSelection &&
    destChainSelection &&
    sourceChainSelection.chainName !== destChainSelection.chainName &&
    selectedSourceAsset &&
    isValidDestinationAddress &&
    destAddr &&
    !bannedAddresses.includes(destAddr)

  const handleOnEnterPress = (e: KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation()
    ;(e.code === "Enter" || e.code === "NumpadEnter") &&
      enableSubmitBtn &&
      onInitiateTransfer()
  }

  const getDestinationAddressFromWallet = async (
    destinationChain: ChainInfo
  ) => {
    let wallet: WalletInterface
    const isEvm: boolean = destinationChain.module === "evm"
    wallet = isEvm
      ? new MetaMaskWallet(destinationChain.chainName.toLowerCase())
      : new KeplrWallet(destinationChain.chainName.toLowerCase())
    if (!wallet.isWalletInstalled() || !isEvm) await wallet.connectToWallet()
    wallet.isWalletInstalled() && setDestAddr(await wallet.getAddress())
  }

  /*closeAllSearchWindows is a method inside ChainSelector children called
	to programmatically close the asset search windows, i.e. when TopFlowsSelectorWidget is made */
  const closeAllSearchWindows = () => {
    ;(srcChainComponentRef?.current as any)?.closeAllSearchWindows()
    ;(destChainComponentRef?.current as any)?.closeAllSearchWindows()
  }

  return (
    <StyledUserInputWindow>
      <br />
      <br />
      <TopFlowsSelectorWidget closeAllSearchWindows={closeAllSearchWindows} />
      <StyledChainSelectorSection className={"joyride-chain-selector"}>
        <ChainSelector
          ref={srcChainComponentRef}
          id={SOURCE_TOKEN_KEY}
          label={"Source Chain"}
          closeOtherWindow={() =>
            (destChainComponentRef?.current as any)?.closeAllSearchWindows()
          }
        />
        <div>
          <SwapChains />
        </div>
        <ChainSelector
          ref={destChainComponentRef}
          id={DESTINATION_TOKEN_KEY}
          label={"Destination Chain"}
          closeOtherWindow={() =>
            (srcChainComponentRef?.current as any)?.closeAllSearchWindows()
          }
        />
        <br />
        <TransactionInfo />
        <StyledInputFormSection>
          <InputForm
            name={"destination-address-input"}
            value={destAddr || ""}
            placeholder={"Enter Destination Address"}
            type={"text"}
            handleOnEnterPress={handleOnEnterPress}
            onChange={(e: any) => setDestAddr(e.target.value)}
          />
          {destChainSelection && (
            <div
              style={{
                width: `100%`,
                height: `100%`,
                color: `#898994`,
                marginTop: `0.5em`,
                textAlign: `right`,
                fontSize: `0.8em`,
                display: `flex`,
                justifyContent: `flex-end`,
                alignItems: `flex-start`,
              }}
            >
              <span
                style={{ cursor: `pointer` }}
                onClick={() =>
                  getDestinationAddressFromWallet(
                    destChainSelection as ChainInfo
                  )
                }
              >
                Autofill Destination Address (optional)
              </span>
              <StyledSVGImage
                onClick={() =>
                  getDestinationAddressFromWallet(
                    destChainSelection as ChainInfo
                  )
                }
                height={`1.25em`}
                width={`1.25em`}
                margin={`0em 0.75em 0em 0.5em`}
                src={
                  destChainSelection.module === "axelarnet"
                    ? require(`assets/svg/keplr.svg`).default
                    : require(`assets/svg/metamask.svg`).default
                }
              />
            </div>
          )}
        </StyledInputFormSection>
      </StyledChainSelectorSection>
      {showValidationErrors && renderValidationErrors()}
      <StyledButtonContainer className={"joyride-input-button"}>
        <PlainButton
          dim={!enableSubmitBtn}
          onClick={() => enableSubmitBtn && onInitiateTransfer()}
          onMouseEnter={() => {
            if (!enableSubmitBtn) setShowValidationErrors(true)
          }}
          onMouseLeave={() => {
            setShowValidationErrors(false)
          }}
        >
          {isSubmitting ? "Please check Metamask..." : "Connect Wallet & Transfer"}
        </PlainButton>
      </StyledButtonContainer>
    </StyledUserInputWindow>
  )
}

export default UserInputWindow
