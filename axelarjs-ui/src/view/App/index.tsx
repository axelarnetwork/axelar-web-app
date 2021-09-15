import React                from 'react';
import PageHeader           from "component/CompositeComponents/PageHeader";
import SwapWindow           from "view/SwapWindow";
import {StyledAppContainer} from "view/App/styles/StyledAppContainer";
import {StyledAppBody}      from "view/App/styles/StyledAppBody";

const App = () => {

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
