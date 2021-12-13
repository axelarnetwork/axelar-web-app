import {useCallback}              from "react";
import downstreamServices         from "config/downstreamServices";
import {useRecoilState}           from "recoil";
import {IsRecaptchaAuthenticated} from "state/TransactionStatus";

declare const grecaptcha: any;

const useRecaptchaAuthenticate = () => {

	const [isRecaptchaAuthenticated, setIsRecaptchaAuthenticated] = useRecoilState(IsRecaptchaAuthenticated);

	const authenticateWithRecaptcha = useCallback(() => {
		return new Promise((resolve, reject) => {
			grecaptcha.ready(async () => {
				try {
					const token = await grecaptcha.execute(downstreamServices.RECAPTCHA_SITE_KEY);
					setIsRecaptchaAuthenticated(true);
					resolve(token);
				} catch (e: any) {
					setIsRecaptchaAuthenticated(false);
				}
			});
		});
	}, [setIsRecaptchaAuthenticated]);

	return [isRecaptchaAuthenticated, authenticateWithRecaptcha] as const;
}

export default useRecaptchaAuthenticate;