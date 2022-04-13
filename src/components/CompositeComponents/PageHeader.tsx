import { useEffect, useState } from "react"
import styled from "styled-components"
import { KeplrWallet } from "hooks/wallet/KeplrWallet"
import Container from "../StyleComponents/Container"
import { FlexRow } from "../StyleComponents/FlexRow"
import { SVGImage } from "../Widgets/SVGImage"
import BoldSpan from "../StyleComponents/BoldSpan"
import { confirm } from "react-confirm-box"
import { StyledButton } from "components/StyleComponents/StyledButton"
import { MetaMaskWallet } from "hooks/wallet/MetaMaskWallet"
import {
  useConnectedWallet,
  useLCDClient,
  useWallet,
  WalletLCDClientConfig,
} from "@terra-money/wallet-provider"
import {
  terraConfigMainnet,
  terraConfigTestnet,
  TerraWallet,
} from "hooks/wallet/TerraWallet"
import { FlexColumn } from "components/StyleComponents/FlexColumn"
import { useRecoilState } from "recoil"
import { IsKeplrWalletConnected } from "state/Wallet"

const StyledPageHeader = styled(Container)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 56px;
  box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.21);
  background-color: black;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const HeaderText = styled.div`
  display: flex;
  flex-direction: row;
  color: lightgrey;
  font-size: larger;
  box-sizing: border-box;
`
const HeaderImage = styled.div`
  font-family: EthnocentricRg-Regular;
  color: lightgrey;
  font-size: 24px;
  box-sizing: border-box;
  padding: 10px;
`
const ByText = styled.span`
  color: lightgrey;
  font-size: 12px;
  box-sizing: border-box;
  display: flex;
  align-items: flex-end;
  padding-bottom: 10px;
`
const ConnectWalletButton = styled(FlexRow)`
  cursor: pointer;
  transition: opacity 0.15s ease-in;
  &:hover {
    opacity: 0.7;
  }
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

const PageHeader = () => {
  const [showWalletOptions, setShowWalletOptions] = useState(false)
  const terraWallet = useWallet()
  const lcdClient = useLCDClient(
    (process.env.REACT_APP_STAGE === "mainnet"
      ? terraConfigMainnet
      : terraConfigTestnet) as WalletLCDClientConfig
  )
  const connectedWallet = useConnectedWallet()
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false)
  const [isKeplrWalletConnected, setIsKeplrWalletConnected] = useRecoilState(IsKeplrWalletConnected);
  const [isTerraStationWalletConnected, setIsTerraStationWalletConnected] = useState(false)

  useEffect(() => {
    if (!!connectedWallet) setIsTerraStationWalletConnected(true)
  }, [connectedWallet])

  useEffect(() => {
    ;(async () => {
      try {
        const accounts = await (window as any).ethereum.request({
          method: "eth_accounts",
        })
        if (accounts?.length > 0) setIsMetaMaskConnected(true)
      } catch (err) {
        console.error(err)
      }
    })()
  }, [])

  useEffect(() => {
    if (!showWalletOptions) return

    const options = {
      render: (message: string, onConfirm: () => void) => {
        return (
          <StyledDialogBox>
            <div>{message}</div>
            <br />
            <StyledButton onClick={onConfirm}>Done</StyledButton>
          </StyledDialogBox>
        )
      },
    }

    const message: any = (
      <FlexColumn>
        <h2>Select Wallets</h2>
        <div
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            width: `100%`,
            border: "0.1px solid lightgrey",
          }}
        >
          <WalletOption
            onClick={async () => {
              const connectionResult = await new KeplrWallet("terra").connectToWallet(() => setIsKeplrWalletConnected(true));
            }}
            label={"Keplr Wallet"}
            image={require(`assets/svg/keplr.svg`).default}
            isConnected={isKeplrWalletConnected}
          />
          <WalletOption
            onClick={async () =>
              new TerraWallet(
                terraWallet,
                lcdClient,
                connectedWallet
              ).connectToWallet()
            }
            label={"Terra Station"}
            image={require(`assets/svg/terra-station.svg`).default}
            isConnected={isTerraStationWalletConnected}
          />
          <WalletOption
            onClick={async () =>
              new MetaMaskWallet("ethereum").connectToWallet(() => setIsMetaMaskConnected(true))
            }
            label={"MetaMask"}
            image={require(`assets/svg/metamask.svg`).default}
            isConnected={isMetaMaskConnected}
          />
        </div>
      </FlexColumn>
    )
    confirm(message, options as any).then((done) => {
      done && setShowWalletOptions(false)
    })
  }, [
    showWalletOptions,
    setShowWalletOptions,
    connectedWallet,
    lcdClient,
    terraWallet,
    isMetaMaskConnected,
    isKeplrWalletConnected,
    isTerraStationWalletConnected,
    setIsKeplrWalletConnected
  ])

  const pillStyle =
    process.env.REACT_APP_STAGE === "mainnet"
      ? { color: `green`, fontSize: `smaller`, fontWeight: `bolder` }
      : {
          color: `white`,
          fontSize: `smaller`,
          fontWeight: `bolder`,
          backgroundColor: `red`,
          padding: `0.3em`,
          borderRadius: `10px`,
        }

  return (
    <StyledPageHeader>
      <HeaderText>
        <HeaderImage>Satellite</HeaderImage>
        <ByText>
          <BoldSpan style={{ marginRight: `0.5em` }}>(BETA)</BoldSpan>
          Powered by Axelar
        </ByText>
      </HeaderText>
      <FlexRow>
        <div style={{ fontSize: `0.8em` }}>
          <ConnectWalletButton onClick={() => setShowWalletOptions(true)}>
            <FlexRow
              style={{
                padding: "4px 8px 4px 8px",
                borderRadius: "10px",
                backgroundColor: "slategrey",
                color: "white",
                fontWeight: "bolder",
              }}
            >
              <p>Connect Wallet</p>
            </FlexRow>
          </ConnectWalletButton>
        </div>
        {HeaderDivider()}
        <div style={pillStyle}>
          {(process.env.REACT_APP_STAGE || "").toUpperCase()}
        </div>
        {HeaderDivider()}
      </FlexRow>
    </StyledPageHeader>
  )
}

const StyledWalletOption = styled(ConnectWalletButton)`
  cursor: pointer;
  padding-bottom: 1em;
  padding-top: 1em;
  flex-direction: column;
  box-sizing: border-box;
  border: 0.1px solid lightgrey;
  width: 50%;
  &:hover {
    background-color: lightgrey;
    border-radius: 10px;
  }
`

const WalletOption = ({ label, onClick, image, isConnected }: any) => {
  return (
    <StyledWalletOption onClick={onClick}>
      <SVGImage height={`3em`} width={`3em`} margin={`auto`} src={image} />
      <h3>{label}</h3>
      {isConnected && (
        <FlexRow>
          <span style={{ backgroundColor: `green`, padding: `0.25em` }}></span>
          <span style={{ fontSize: `0.8em`, marginLeft: `5px` }}>
            Connected
          </span>
        </FlexRow>
      )}
    </StyledWalletOption>
  )
}
const HeaderDivider = () => (
  <div style={{ color: `grey`, margin: `0px 1em 0px 1em` }}>|</div>
)

export default PageHeader
