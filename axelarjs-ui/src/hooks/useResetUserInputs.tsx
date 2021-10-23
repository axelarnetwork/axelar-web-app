import {useResetRecoilState}                             from "recoil";
import {ChainSelection, DestinationAddress, SourceAsset} from "state/ChainSelection";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}         from "../config/consts";

const useResetUserInputs = () => {
	const resetSourceTokenKey = useResetRecoilState(ChainSelection(SOURCE_TOKEN_KEY));
	const resetDestTokenKey = useResetRecoilState(ChainSelection(DESTINATION_TOKEN_KEY));
	const resetDestAddress = useResetRecoilState(DestinationAddress);
	const resetSourceAsset = useResetRecoilState(SourceAsset);

	return () => {
		resetSourceTokenKey();
		resetDestTokenKey();
		resetDestAddress();
		resetSourceAsset();
	}
}

export default useResetUserInputs;