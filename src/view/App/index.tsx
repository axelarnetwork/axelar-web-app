import {useEffect, useState} from "react";
import {useRecoilValue}      from "recoil";
import InfoWidget                                               from "component/CompositeComponents/InfoWidget";
import PageHeader                                                          from "component/CompositeComponents/PageHeader";
import PageFooter                                                          from "component/CompositeComponents/PageFooter";
import WalkThrough                                                         from "component/CompositeComponents/Walkthrough";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}                           from "config/consts";
import useLoadRecaptcha                                                    from "hooks/auth/useLoadRecaptcha";
import {ShowDisclaimer, ShowDisclaimerFromFAQ, ShowTransactionHistoryPage} from "state/ApplicationStatus";
import {ChainSelection, IsValidDestinationAddress, SourceAsset}            from "state/ChainSelection";
import {StyledAppContainer}                                                from "view/App/styles/StyledAppContainer";
import SwapWindow                                                          from "view/SwapWindow";
import Disclaimer                                                          from "../Disclaimer";
import {Redirect}                                                          from "react-router-dom";
import TransactionHistory                                                  from "../TransactionHistory";

const App = () => {

	const [isRecaptchaSet, initiateRecaptcha] = useLoadRecaptcha();
	const sourceChainSelection = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const destChainSelection = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const selectedSourceAsset = useRecoilValue(SourceAsset);
	const isValidDestinationAddr = useRecoilValue(IsValidDestinationAddress);
	const showDisclaimer = useRecoilValue(ShowDisclaimer);
	const showDisclaimerForFAQ = useRecoilValue(ShowDisclaimerFromFAQ);
	const showTransactionHistoryPage = useRecoilValue(ShowTransactionHistoryPage);
	const [underMaintenance] = useState(process.env.REACT_APP_UNDER_MAINTENANCE);

	const canLightUp = sourceChainSelection && destChainSelection
		&& sourceChainSelection.chainName !== destChainSelection.chainName
		&& selectedSourceAsset
		&& isValidDestinationAddr;

	useEffect(() => {
		if (!isRecaptchaSet)
			initiateRecaptcha();
	}, [isRecaptchaSet, initiateRecaptcha]);

	if (underMaintenance === "true")
		return <Redirect to={"/landing"} />;

	return (
		<StyledAppContainer>
			{(showDisclaimerForFAQ || canLightUp) && showDisclaimer && <Disclaimer/>}
			{showTransactionHistoryPage && <TransactionHistory />}
			<WalkThrough/>
			<InfoWidget/>
			<PageHeader/>
			{isRecaptchaSet
				? <SwapWindow/>
				: null
			}
			<PageFooter/>
		</StyledAppContainer>
	);
}

export default App;
