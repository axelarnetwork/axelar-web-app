import styled, { ThemedStyledProps } from "styled-components"
import step1InActive from "assets/svg/transaction_status_logos/step-1-inactive.svg"
import step2Inctive from "assets/svg/transaction_status_logos/step-2-inactive.svg"
import step3Active from "assets/svg/transaction_status_logos/step-3-active.svg"
import { FlexRow } from "components/StyleComponents/FlexRow"
import { StyledCentered } from "components/StyleComponents/Centered"
import { FlexColumn } from "components/StyleComponents/FlexColumn"
import { StyledPTag } from "./StyledPTag"

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

const StyledPage3 = styled.div`
  width: 300px;
  height: 225px;
  position: relative;
  overflow: hidden;
`
const Page3 = () => {
  return (
    <StyledPage3>
      <NumbersContainer>
        <Column padding={`0px 0px 0px 35px`}>
          <StyledImage src={step1InActive} height={`25px`} width={`25px`} />
        </Column>
        <Column>
          <StyledImage src={step2Inctive} height={`40px`} width={`40px`} />
        </Column>
        <Column>
          <StyledImage src={step3Active} height={`65px`} width={`65px`} />
        </Column>
        <Column />
        <Column />
      </NumbersContainer>
      <FlexColumn>
        <p>Deposit confirmed.</p>
        <p>Axelar is completing your transfer</p>
      </FlexColumn>
      <br />
      <br />
      <StyledPTag>
        {`At this stage, you can leave the rest to us and "Go Back"... or follow along with the rest if you like!`}
      </StyledPTag>
    </StyledPage3>
  )
}

export default Page3
