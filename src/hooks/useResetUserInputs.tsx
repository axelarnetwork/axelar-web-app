import {useResetRecoilState}                             from "recoil";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}         from "config/consts";
import {ChainSelection, DestinationAddress, SourceAsset} from "state/ChainSelection";
import {NumberConfirmations, SourceDepositAddress}       from "state/TransactionStatus";
import {ShowRecaptchaV2Retry}                            from "../state/ApplicationStatus";

const useResetUserInputs = () => {
	const resetSourceTokenKey = useResetRecoilState(ChainSelection(SOURCE_TOKEN_KEY));
	const resetDestTokenKey = useResetRecoilState(ChainSelection(DESTINATION_TOKEN_KEY));
	const resetSourceNumConfirmations = useResetRecoilState(NumberConfirmations(SOURCE_TOKEN_KEY));
	const resetDestNumConfirmations = useResetRecoilState(NumberConfirmations(DESTINATION_TOKEN_KEY));
	const resetSourceDepositAddress = useResetRecoilState(SourceDepositAddress);
	const resetDestAddress = useResetRecoilState(DestinationAddress);
	const resetSourceAsset = useResetRecoilState(SourceAsset);
	const resetShowRecaptchaV2 = useResetRecoilState(ShowRecaptchaV2Retry);

	return () => {
		resetSourceTokenKey();
		resetDestTokenKey();
		resetDestAddress();
		resetSourceAsset();
		resetSourceNumConfirmations();
		resetDestNumConfirmations();
		resetSourceDepositAddress();
		resetShowRecaptchaV2();
	}
}

export default useResetUserInputs;