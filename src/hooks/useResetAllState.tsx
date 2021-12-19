import {useResetRecoilState}            from "recoil";
import {ActiveStep, TransactionTraceId} from "state/TransactionStatus";
import useResetUserInputs               from "./useResetUserInputs";

const useResetAllState = () => {
	const resetTransactionTraceId = useResetRecoilState(TransactionTraceId);
	const resetActiveSteps = useResetRecoilState(ActiveStep);
	const resetUserInputs = useResetUserInputs();

	return () => {
		resetUserInputs();
		resetTransactionTraceId();
		resetActiveSteps();
	}
}

export default useResetAllState;