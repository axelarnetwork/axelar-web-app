import {useResetRecoilState}                                           from "recoil";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}                       from "config/consts";
import {ChainSelection, DestinationAddress, SourceAsset}               from "state/ChainSelection";
import {NumberConfirmations, SourceDepositAddress, TransactionTraceId} from "state/TransactionStatus";

const useResetUserInputs = () => {
	const resetSourceTokenKey = useResetRecoilState(ChainSelection(SOURCE_TOKEN_KEY));
	const resetDestTokenKey = useResetRecoilState(ChainSelection(DESTINATION_TOKEN_KEY));
	const resetSourceNumConfirmations = useResetRecoilState(NumberConfirmations(SOURCE_TOKEN_KEY));
	const resetDestNumConfirmations = useResetRecoilState(NumberConfirmations(DESTINATION_TOKEN_KEY));
	const resetSourceDepositAddress = useResetRecoilState(SourceDepositAddress);
	const resetDestAddress = useResetRecoilState(DestinationAddress);
	const resetSourceAsset = useResetRecoilState(SourceAsset);
	const resetTransactionTraceId = useResetRecoilState(TransactionTraceId);

	return () => {
		resetSourceTokenKey();
		resetDestTokenKey();
		resetDestAddress();
		resetSourceAsset();
		resetSourceNumConfirmations();
		resetDestNumConfirmations();
		resetSourceDepositAddress();
		resetTransactionTraceId();
	}
}

export default useResetUserInputs;