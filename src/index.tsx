import React from "react"
import ReactDOM from "react-dom"
import { ThemeProvider } from "styled-components"
import ReactNotification from "react-notifications-component"
import { RecoilRoot } from "recoil"
import { TransferAssetBridgeFacade } from "api/TransferAssetBridgeFacade"
import { GlobalStyle } from "./global-styles"
import { RoutesWithTransitions } from "./routes"
import { WalletProvider, getChainOptions } from "@terra-money/wallet-provider"
import "react-notifications-component/dist/theme.css"
import { datadogLogs } from "@datadog/browser-logs"
import "./index.css"

new TransferAssetBridgeFacade(process.env.REACT_APP_STAGE as string)

datadogLogs.init({
  clientToken: process.env.REACT_APP_DD_CLIENT_TOKEN as string,
  datacenter: "us",
  site: "datadoghq.com",
  forwardErrorsToLogs: true,
  sampleRate: 1,
  service: `satellite_browser_${process.env.REACT_APP_STAGE}`,
  env: process.env.REACT_APP_STAGE,
  beforeSend: (log) => {
    if (log.http && log.http.status_code === 404) {
      return false
    }
  },
})

const theme = {
  headerBackgroundColor: `rgba(0, 0, 0, 0.82)`,
}
getChainOptions().then((_chainOptions) => {
  console.log("chain options",_chainOptions)
  const defaultNetwork =
    process.env.REACT_APP_STAGE === "mainnet"
      ? _chainOptions.walletConnectChainIds[1]
      : _chainOptions.walletConnectChainIds[0]
  const chainOptions = { ..._chainOptions, defaultNetwork }
  ReactDOM.render(
    <WalletProvider {...chainOptions}>
      <RecoilRoot>
        <ThemeProvider theme={theme}>
          <ReactNotification />
          <RoutesWithTransitions />
          <GlobalStyle />
        </ThemeProvider>
      </RecoilRoot>
    </WalletProvider>,
    document.getElementById("root")
  )
})
// TODO: may want to use this for reporting web vitals: https://bit.ly/CRA-vitals
// reportWebVitals();
