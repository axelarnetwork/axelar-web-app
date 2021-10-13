import PageHeader           from "component/CompositeComponents/PageHeader";
import SwapWindow           from "view/SwapWindow";
import {StyledAppContainer} from "view/App/styles/StyledAppContainer";
import {StyledAppBody}      from "view/App/styles/StyledAppBody";
import useRequireAuth       from "hooks/useRequireAuth";

const App = () => {

	useRequireAuth();

	return (
		<StyledAppContainer>
			<PageHeader/>
			<StyledAppBody>
				<SwapWindow/>
			</StyledAppBody>
		</StyledAppContainer>
	);
}

export default App;
