import {useResetRecoilState} from "recoil";
import {
	ChainSelection,
	DESTINATION_TOKEN_KEY,
	DestinationAddress,
	SOURCE_TOKEN_KEY,
	SourceAsset
}                            from "state/ChainSelection";

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