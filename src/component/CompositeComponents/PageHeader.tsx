import styled       from "styled-components";
import Container    from "../StyleComponents/Container";
import {FlexColumn} from "../StyleComponents/FlexColumn";

const StyledPageHeader = styled(Container)`
	position: fixed;
	top: 0;
	width: 100%;
	height: 45px;
	box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.21);
	background-color: black;
	z-index: 1000;
	display: flex;
	justify-content: space-between;
`
const HeaderText = styled.div`
	
	display: flex;
	flex-direction: row;
	color: lightgrey;
	font-size: larger;
	box-sizing: border-box;
`;
const HeaderImage = styled.div`
	font-family: EthnocentricRg-Regular;
	color: lightgrey;
	font-size: 24px;
	box-sizing: border-box;
	padding: 10px;
`;
const ByText = styled.span`
	color: lightgrey;
	font-size: 12px;
	box-sizing: border-box;
	display: flex;
	align-items: flex-end;
	padding-bottom: 10px;
`;
const PageHeader = () => {

	return (
		<StyledPageHeader>
			<HeaderText>
				<HeaderImage>Satellite</HeaderImage>
				<ByText>Powered by Axelar</ByText>
			</HeaderText>
			<FlexColumn style={{ color: `green`, fontSize: `smaller`, fontWeight: `bolder`, marginRight: `2em`}}>
				{(process.env.REACT_APP_STAGE || "").toUpperCase()}
			</FlexColumn>
		</StyledPageHeader>
	);
}

export default PageHeader;