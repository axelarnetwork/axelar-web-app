import {useCallback}           from "react";
import {useSetRecoilState}     from "recoil";
import {MessageShownInCartoon} from "state/ApplicationStatus";

const useCartoonMessageDispatcher = () => {

	const setMessageShownInCartoon = useSetRecoilState(MessageShownInCartoon);

	const setThenResetMessage = useCallback((message: string) => {
		setMessageShownInCartoon(message);
		setTimeout(() => setMessageShownInCartoon(null), 60000);
	}, [setMessageShownInCartoon]);

	return setThenResetMessage;
}

export default useCartoonMessageDispatcher;