import {useResetRecoilState}            from "recoil";
import {ActiveStep, TransactionTraceId} from "state/TransactionStatus";
import useResetUserInputs               from "./useResetUserInputs";
import {MessageShownInCartoon}          from "../state/ApplicationStatus";

const useResetAllState = () => {
	const resetTransactionTraceId = useResetRecoilState(TransactionTraceId);
	const resetCartoonMessage = useResetRecoilState(MessageShownInCartoon);
	const resetActiveSteps = useResetRecoilState(ActiveStep);
	const resetUserInputs = useResetUserInputs();

	return () => {
		resetUserInputs();
		resetCartoonMessage();
		resetTransactionTraceId();
		resetActiveSteps();
	}
}

export default useResetAllState;