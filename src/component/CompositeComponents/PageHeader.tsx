import Container    from "../StyleComponents/Container";
import styled       from "styled-components";
import {FlexColumn} from "../StyleComponents/FlexColumn";

const StyledPageHeader = styled(Container)`
	position: fixed;
	top: 0;
	width: 100%;
	height: 60px;
	box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.21);
	background-color: black;
	z-index: 1000;
	display: flex;
	justify-content: space-between;
`

const PageHeader = () => {

	return (
		<StyledPageHeader>
			<img src={require(`resources/satellite.png`)?.default} alt={""} />
			<FlexColumn style={{ color: `green`, fontSize: `smaller`, fontWeight: `bolder`, marginRight: `2em`}}>
				{(process.env.REACT_APP_STAGE || "").toUpperCase()}
			</FlexColumn>
		</StyledPageHeader>
	);
}

export default PageHeader;