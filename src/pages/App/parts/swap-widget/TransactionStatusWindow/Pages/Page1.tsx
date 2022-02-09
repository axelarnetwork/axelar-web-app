import styled, { ThemedStyledProps } from "styled-components"
import step1Active from "assets/svg/transaction_status_logos/setp-1-active.svg"
import step2Inctive from "assets/svg/transaction_status_logos/step-2-inactive.svg"
import step3Inctive from "assets/svg/transaction_status_logos/step-3-inactive.svg"
import { FlexRow } from "components/StyleComponents/FlexRow"
import { StyledCentered } from "components/StyleComponents/Centered"
import { FlexColumn } from "components/StyleComponents/FlexColumn"

export const StyledImage = styled.img``

interface IColumnProps extends ThemedStyledProps<any, any> {
  width?: string
  padding?: number
}

export const Column = styled.div<IColumnProps>`
  height: 100%;
  width: 20%;
  box-sizing: border-box;
  ${(props) => (props.padding ? `padding: ${props.padding};` : "")}
  ${StyledCentered}
`

const NumbersContainer = styled(FlexRow)`
  height: 40%;
`

const StyledPage1 = styled.div`
  width: 300px;
  height: 225px;
  position: relative;
  overflow: hidden;
`
const Page1 = () => {
  return (
    <StyledPage1>
      <NumbersContainer>
        <Column />
        <Column />
        <Column>
          <StyledImage src={step1Active} height={`65px`} width={`65px`} />
        </Column>
        <Column>
          <StyledImage src={step2Inctive} height={`40px`} width={`40px`} />
        </Column>
        <Column padding={`0px 35px 0px 0px`}>
          <StyledImage src={step3Inctive} height={`25px`} width={`25px`} />
        </Column>
      </NumbersContainer>
      <FlexColumn>
        <br />
        <p>Generating Source</p>
        <p>Chain Deposit Address</p>
      </FlexColumn>
    </StyledPage1>
  )
}

export default Page1
