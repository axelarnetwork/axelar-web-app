import {RefObject, useCallback, useEffect, useState} from "react";
import downstreamServices                            from "config/downstreamServices";
import {useRecoilState}                              from "recoil";
import {IsRecaptchaAuthenticated}                    from "state/TransactionStatus";

declare const grecaptcha: any;

const useRecaptchaAuthenticate = (inputRef?: RefObject<any>) => {

	const [isRecaptchaAuthenticated, setIsRecaptchaAuthenticated] = useRecoilState(IsRecaptchaAuthenticated);
	const [recaptchaV2Ref, setRecaptchaV2Ref] = useState<RefObject<any>>();

	useEffect(() => {
		if (inputRef) {
			const element = inputRef.current;
			setRecaptchaV2Ref(element);
		}
	}, [inputRef]);

	const authenticateWithRecaptchaV3 = useCallback((): Promise<string> => {
		console.log("using v3");
		return new Promise((resolve, reject) => {
			grecaptcha.ready(async () => {
				try {
					const token = await grecaptcha.execute(downstreamServices.RECAPTCHA_V3_SITE_KEY);
					setIsRecaptchaAuthenticated(true);
					resolve(token);
				} catch (e: any) {
					setIsRecaptchaAuthenticated(false);
					reject(e);
				}
			});
		});
	}, [setIsRecaptchaAuthenticated]);

	const authenticateWithRecaptchaV2 = useCallback((): Promise<string> => {
		console.log("using v2");
		return new Promise(async (resolve, reject) => {
			try {
				const token = await (recaptchaV2Ref as any).getValue();
				(recaptchaV2Ref as any).reset();
				setIsRecaptchaAuthenticated(true);
				resolve(token);
			} catch (e: any) {
				setIsRecaptchaAuthenticated(false);
			}
		});
	}, [recaptchaV2Ref, setIsRecaptchaAuthenticated]);

	return {
		isRecaptchaAuthenticated, authenticateWithRecaptchaV3, authenticateWithRecaptchaV2,
	} as const;
}

export default useRecaptchaAuthenticate;