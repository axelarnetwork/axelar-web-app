import {useResetRecoilState} from "recoil";
import {TransactionTraceId}  from "state/TransactionStatus";
import useResetUserInputs    from "./useResetUserInputs";

const useResetAllState = () => {
	const resetTransactionTraceId = useResetRecoilState(TransactionTraceId);
	const resetUserInputs = useResetUserInputs();

	return () => {
		resetUserInputs();
		resetTransactionTraceId();
	}
}

export default useResetAllState;