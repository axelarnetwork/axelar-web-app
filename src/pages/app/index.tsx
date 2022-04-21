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
    if (underMaintenance === "true" || disclaimerAgreed) return

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
