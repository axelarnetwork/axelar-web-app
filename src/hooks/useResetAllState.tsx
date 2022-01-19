import {useResetRecoilState}                   from "recoil";
import {ActiveStep, TransactionTraceId}        from "state/TransactionStatus";
import useResetUserInputs                      from "./useResetUserInputs";
import {MessageShownInCartoon, ShowDisclaimer} from "../state/ApplicationStatus";

const useResetAllState = () => {
	const resetTransactionTraceId = useResetRecoilState(TransactionTraceId);
	const resetCartoonMessage = useResetRecoilState(MessageShownInCartoon);
	const resetActiveSteps = useResetRecoilState(ActiveStep);
	const resetUserInputs = useResetUserInputs();
	const resetDisclaimerToggle = useResetRecoilState(ShowDisclaimer);

	return () => {
		resetUserInputs();
		resetCartoonMessage();
		resetTransactionTraceId();
		resetActiveSteps();
		resetDisclaimerToggle();
	}
}

export default useResetAllState;