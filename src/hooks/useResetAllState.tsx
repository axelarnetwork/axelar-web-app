import {useResetRecoilState} from "recoil";
import useResetUserInputs    from "./useResetUserInputs";
import {
	ActiveStep, SrcChainDepositTxHash, TransactionTraceId
}                            from "state/TransactionStatus";
import {
	MessageShownInCartoon, ShowDisclaimer, ShowDisclaimerFromFAQ, ShowLargeDisclaimer
}                            from "../state/ApplicationStatus";

const useResetAllState = () => {
	const resetTransactionTraceId = useResetRecoilState(TransactionTraceId);
	const resetCartoonMessage = useResetRecoilState(MessageShownInCartoon);
	const resetActiveSteps = useResetRecoilState(ActiveStep);
	const resetUserInputs = useResetUserInputs();
	const resetDisclaimerToggle = useResetRecoilState(ShowDisclaimer);
	const resetShowLargeDisclaimerToggle = useResetRecoilState(ShowLargeDisclaimer);
	const resetShowFAQDisclaimer = useResetRecoilState(ShowDisclaimerFromFAQ);
	const resetTxHash = useResetRecoilState(SrcChainDepositTxHash);

	return () => {
		resetUserInputs();
		resetCartoonMessage();
		resetTransactionTraceId();
		resetActiveSteps();
		resetDisclaimerToggle();
		resetShowLargeDisclaimerToggle();
		resetShowFAQDisclaimer();
		resetTxHash();
	}
}

export default useResetAllState;