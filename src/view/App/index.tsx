import {useEffect}          from "react";
import HelperCartoonWidget  from "component/CompositeComponents/HelperCartoonWidget";
import PageFooter           from "component/CompositeComponents/PageFooter";
import PageHeader           from "component/CompositeComponents/PageHeader";
import useLoadRecaptcha     from "hooks/auth/useLoadRecaptcha";
import {StyledAppContainer} from "view/App/styles/StyledAppContainer";
import SwapWindow           from "view/SwapWindow";

const App = () => {

	const [isRecaptchaSet, initiateRecaptcha] = useLoadRecaptcha();

	useEffect(() => {
		if (!isRecaptchaSet)
			initiateRecaptcha();
	}, [isRecaptchaSet, initiateRecaptcha])

	return (
		<StyledAppContainer>
			<HelperCartoonWidget/>
			<PageHeader/>
			{isRecaptchaSet
				? <SwapWindow/>
				: null
			}
			<PageFooter/>
		</StyledAppContainer>
	);
}

export default App;
