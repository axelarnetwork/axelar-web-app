import styled, {ThemedStyledProps} from "styled-components";
import {FlexRow}                   from "component/StyleComponents/FlexRow";
import {StyledCentered}            from "component/StyleComponents/Centered";
import {FlexColumn}                from "component/StyleComponents/FlexColumn";

export const StyledImage = styled.img`

`;
interface IColumnProps extends ThemedStyledProps<any, any> {
	width?: string;
	padding?: number;
}
export const Column = styled.div<IColumnProps>`
	height: 100%;
	width: 20%;
	box-sizing: border-box;
	${props => props.padding ? `padding: ${props.padding};` : ""}
	${StyledCentered}
`;

const NumbersContainer = styled(FlexRow)`
	height: 40%;
`;

const StyledPage1 = styled.div`
	width: 300px;
	height: 225px;
	position: relative;
	overflow: hidden;
`;
const Page4 = () => {
	return <StyledPage1>
		<NumbersContainer>
		</NumbersContainer>
		<FlexColumn>
			<br />
			<p>Transfer Completed!</p>
		</FlexColumn>
	</StyledPage1>
}

export default Page4;