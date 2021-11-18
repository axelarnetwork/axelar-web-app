import styled, {ThemedStyledProps} from "styled-components";
import step1InActive                 from "resources/transaction_status_logos/step-1-inactive.svg";
import step2Inctive                from "resources/transaction_status_logos/step-2-inactive.svg";
import step3Active                from "resources/transaction_status_logos/step-3-active.svg";
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
const Page3 = () => {
	return <StyledPage1>
		<NumbersContainer>
			<Column padding={`0px 0px 0px 35px`}>
				<StyledImage src={step1InActive} height={`25px`} width={`25px`}/>
			</Column>
			<Column >
				<StyledImage src={step2Inctive} height={`40px`} width={`40px`}/>
			</Column>
			<Column>
				<StyledImage src={step3Active} height={`65px`} width={`65px`}/>
			</Column>
			<Column />
			<Column />
		</NumbersContainer>
		<FlexColumn>
			<br />
			<p>Axelar Network is</p>
			<p>executing your transfer</p>
		</FlexColumn>
	</StyledPage1>
}

export default Page3;