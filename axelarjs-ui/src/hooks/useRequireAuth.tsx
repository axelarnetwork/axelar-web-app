import {useEffect, useState} from "react";
import downstreamServices    from "../config/downstreamServices";



const useRequireAuth = () => {

	const [isRecaptchaSet, setIsRecaptchaSet] = useState(false);

	useEffect(() => {

		const loadScriptByURL = (id: string, url: string, cb: () => void) => {

			const hasScriptDownloaded = document.getElementById(id);

			if (!hasScriptDownloaded) {
				const script = document.createElement("script");
				script.type = "text/javascript";
				script.src = url;
				script.id = id;
				script.onload = () => cb && cb();
				document.body.appendChild(script);
			}

			if (hasScriptDownloaded && cb) cb();
		}

		loadScriptByURL("recaptcha-key", `https://www.google.com/recaptcha/api.js?render=${downstreamServices.SITE_KEY}`, () => {
			setIsRecaptchaSet(true);
			console.log("is recaptcha set",isRecaptchaSet);
		});
	}, [isRecaptchaSet]);

	return isRecaptchaSet;
}

export default useRequireAuth;