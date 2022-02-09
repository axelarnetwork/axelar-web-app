import React from "react"
import ReactDOM from "react-dom"
import { ThemeProvider } from "styled-components"
import ReactNotification from "react-notifications-component"
import { RecoilRoot } from "recoil"
import { RecoilLogger } from "recoil-devtools-logger"
import { TransferAssetBridgeFacade } from "api/TransferAssetBridgeFacade"
import { GlobalStyle } from "./global-styles"
import { RoutesWithTransitions } from "./routes"

import "react-notifications-component/dist/theme.css"
import "./index.css"

new TransferAssetBridgeFacade(process.env.REACT_APP_STAGE as string)

const theme = {
  headerBackgroundColor: `rgba(0, 0, 0, 0.82)`,
}

ReactDOM.render(
  <RecoilRoot>
    <ThemeProvider theme={theme}>
      <ReactNotification />
      {process.env.REACT_APP_STAGE !== "mainnet" && <RecoilLogger />}
      <RoutesWithTransitions />
      <GlobalStyle />
    </ThemeProvider>
  </RecoilRoot>,
  document.getElementById("root")
)

// TODO: may want to use this for reporting web vitals: https://bit.ly/CRA-vitals
// reportWebVitals();
