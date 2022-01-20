import {useResetRecoilState}                   from "recoil";
import {ActiveStep, TransactionTraceId}        from "state/TransactionStatus";
import useResetUserInputs                                           from "./useResetUserInputs";
import {
	MessageShownInCartoon, ShowDisclaimer, ShowDisclaimerFromFAQ, ShowLargeDisclaimer
} from "../state/ApplicationStatus";

const useResetAllState = () => {
	const resetTransactionTraceId = useResetRecoilState(TransactionTraceId);
	const resetCartoonMessage = useResetRecoilState(MessageShownInCartoon);
	const resetActiveSteps = useResetRecoilState(ActiveStep);
	const resetUserInputs = useResetUserInputs();
	const resetDisclaimerToggle = useResetRecoilState(ShowDisclaimer);
	const resetShowLargeDisclaimerToggle = useResetRecoilState(ShowLargeDisclaimer);
	const resetShowFAQDisclaimer = useResetRecoilState(ShowDisclaimerFromFAQ);
	return () => {
		resetUserInputs();
		resetCartoonMessage();
		resetTransactionTraceId();
		resetActiveSteps();
		resetDisclaimerToggle();
		resetShowLargeDisclaimerToggle();
		resetShowFAQDisclaimer();
	}
}

export default useResetAllState;