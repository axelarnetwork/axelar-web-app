import {useResetRecoilState}                             from "recoil";
import {ChainSelection, DestinationAddress, SourceAsset} from "state/ChainSelection";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}         from "../config/consts";
import {NumberConfirmations, SourceDepositAddress}       from "../state/TransactionStatus";

const useResetUserInputs = () => {
	const resetSourceTokenKey = useResetRecoilState(ChainSelection(SOURCE_TOKEN_KEY));
	const resetDestTokenKey = useResetRecoilState(ChainSelection(DESTINATION_TOKEN_KEY));
	const resetSourceNumConfirmations = useResetRecoilState(NumberConfirmations(SOURCE_TOKEN_KEY));
	const resetDestNumConfirmations = useResetRecoilState(NumberConfirmations(DESTINATION_TOKEN_KEY));
	const resetSourceDepositAddress = useResetRecoilState(SourceDepositAddress);
	const resetDestAddress = useResetRecoilState(DestinationAddress);
	const resetSourceAsset = useResetRecoilState(SourceAsset);

	return () => {
		resetSourceTokenKey();
		resetDestTokenKey();
		resetDestAddress();
		resetSourceAsset();
		resetSourceNumConfirmations();
		resetDestNumConfirmations();
		resetSourceDepositAddress();
	}
}

export default useResetUserInputs;