import Button                                    from "react-bootstrap/Button";
import {FlexRow}                                 from "component/StyleComponents/FlexRow";
import ChainSelector                             from "component/CompositeComponents/ChainSelector";
import {FlexColumn}                              from "component/StyleComponents/FlexColumn";
import {NumberFormInput}                         from "component/CompositeComponents/NumberFormInput";
import {GridDisplay}                             from "component/StyleComponents/GridDisplay";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY} from "state/ChainSelection";

interface IUserInputWindowProps {
	handleSwapSubmit: any;
}

const UserInputWindow = ({handleSwapSubmit}: IUserInputWindowProps) => {

	return <>
		<FlexRow>
			<ChainSelector id={SOURCE_TOKEN_KEY} label={"Source"}/>
			<ChainSelector id={DESTINATION_TOKEN_KEY} label={"Destination"}/>
		</FlexRow>
		<FlexColumn>
			<NumberFormInput />
		</FlexColumn>
		<GridDisplay>
			<Button variant="secondary" size="sm" onClick={handleSwapSubmit}>
				Initiate Asset Transfer
			</Button>
		</GridDisplay>
	</>;
}

export default UserInputWindow;