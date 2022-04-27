import { useEffect, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import InfoWidget from "components/CompositeComponents/InfoWidget"
import PageHeader from "components/CompositeComponents/PageHeader"
import PageFooter from "components/CompositeComponents/PageFooter"
import WalkThrough from "components/CompositeComponents/Walkthrough"
import {
  ShowDisclaimerFromFAQ,
  ShowLargeDisclaimer as ShowDisclaimer,
  ShowTransactionHistoryPage,
} from "state/ApplicationStatus"
import { StyledAppContainer } from "./styles/StyledAppContainer"
import SwapWindow from "pages/app/parts/swap-widget"
import { Disclaimer } from "./parts/disclaimer"
import { Redirect } from "react-router-dom"
import { TransactionHistory } from "./parts/tx-history"
import FirstTimeBadge from "components/CompositeComponents/FirstTimeBadge"
import { Mask } from "components/Widgets/Mask"
import { IsTxSubmitting } from "state/TransactionStatus"
import { popupOptionWithoutCancel } from "components/Widgets/PopupOptions"
import { confirm } from "react-confirm-box"

export const AppPage = () => {
  const showDisclaimerForFAQ = useRecoilValue(ShowDisclaimerFromFAQ)
  const showTransactionHistoryPage = useRecoilValue(ShowTransactionHistoryPage)
  const [underMaintenance] = useState(process.env.REACT_APP_UNDER_MAINTENANCE)
  const isSubmitting = useRecoilValue(IsTxSubmitting)
  const [disclaimerAgreed, setDisclaimerAgreed] = useState(false)
  const [showDisclaimer, setShowDisclaimer] = useRecoilState(ShowDisclaimer)

  useEffect(() => {
    //temporary javascript-level redirect put in place in case Vercel-level redirect fails for some reason
    const { host } = window.location
    const oldDevnet = "bridge.devnet.axelar.dev"
    const oldTestnet = "localhost:2620"
    const oldMainnet = "satellite.axelar.network"

    if (![oldDevnet, oldTestnet, oldMainnet].includes(host)) return

    let redirect = ""

    if (host.includes(oldDevnet)) {
      redirect = "https://devnet.satellite.money"
    } else if (host.includes(oldTestnet)) {
      redirect = "https://testnet.satellite.money"
    } else if (host.includes(oldMainnet)) {
      redirect = "https://satellite.money"
    }

    window.location.replace(redirect + window.location.search)
  }, [])

  useEffect(() => {
    if (underMaintenance === "true" || disclaimerAgreed) return

    //TODO: hack to facilitate hard refresh
    if (localStorage.getItem("startOver")) {
      localStorage.removeItem("startOver")
      return
    }

    const cb: any = () => {
      setDisclaimerAgreed(true)
      setShowDisclaimer(true)
    }

    confirm(cb, popupOptionWithoutCancel as any).then(
      (approve: boolean) => approve && setDisclaimerAgreed(true)
    )
  }, [
    disclaimerAgreed,
    underMaintenance,
    setDisclaimerAgreed,
    setShowDisclaimer,
  ])

  if (underMaintenance === "true") return <Redirect to={"/landing"} />

  return (
    <StyledAppContainer>
      {(showDisclaimerForFAQ || showDisclaimer) && <Disclaimer />}
      {showTransactionHistoryPage && <TransactionHistory />}
      {process.env.REACT_APP_STAGE === "mainnet" && <FirstTimeBadge />}
      <WalkThrough />
      <InfoWidget />
      {isSubmitting && <Mask />}
      <PageHeader />
      <SwapWindow />
      <PageFooter />
    </StyledAppContainer>
  )
}
