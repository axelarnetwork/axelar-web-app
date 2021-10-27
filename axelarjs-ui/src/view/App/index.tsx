import PageHeader           from "component/CompositeComponents/PageHeader";
import SwapWindow           from "view/SwapWindow";
import {StyledAppContainer} from "view/App/styles/StyledAppContainer";
import {StyledAppBody}      from "view/App/styles/StyledAppBody";
import useLoadRecaptcha     from "hooks/auth/useLoadRecaptcha";
import {useEffect}          from "react";

const App = () => {

	const [isRecaptchaSet, initiateRecaptcha] = useLoadRecaptcha();

	useEffect(() => {
		if (!isRecaptchaSet)
			initiateRecaptcha();
	}, [isRecaptchaSet, initiateRecaptcha])

	return (
		<StyledAppContainer>
			<PageHeader/>
			{isRecaptchaSet
				? <StyledAppBody>
					<SwapWindow/>
				</StyledAppBody>
				: null
			}
		</StyledAppContainer>
	);
}

export default App;
