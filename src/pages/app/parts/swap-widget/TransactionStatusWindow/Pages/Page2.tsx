import { useRecoilValue } from "recoil"
import styled, { ThemedStyledProps } from "styled-components"
import { SOURCE_TOKEN_KEY } from "config/consts"
import { FlexRow } from "components/StyleComponents/FlexRow"
import { StyledCentered } from "components/StyleComponents/Centered"
import { FlexColumn } from "components/StyleComponents/FlexColumn"
import BoldSpan from "components/StyleComponents/BoldSpan"
import Tooltip from "components/Widgets/Tooltip"
import CopyToClipboard from "components/Widgets/CopyToClipboard"
import step1InActive from "assets/svg/transaction_status_logos/step-1-inactive.svg"
import step2active from "assets/svg/transaction_status_logos/setp-2-active.svg"
import step3Inctive from "assets/svg/transaction_status_logos/step-3-inactive.svg"
import caution from "assets/svg/transaction_status_logos/caution.svg"
import { ChainSelection, SourceAsset } from "state/ChainSelection"
import { SourceDepositAddress } from "state/TransactionStatus"
import { StyledPTag } from "./StyledPTag"

export const StyledImage = styled.img``

interface IColumnProps extends ThemedStyledProps<any, any> {
  width?: string
  margin?: number
}

export const Column = styled.div<IColumnProps>`
  height: 100%;
  width: 20%;
  ${(props) => (props.margin ? `margin: ${props.margin};` : "")}
  ${StyledCentered}
`

const NumbersContainer = styled(FlexRow)`
  height: 40%;
`

const StyledPage2 = styled.div`
  width: 300px;
  height: 225px;
  position: relative;
  overflow: hidden;
`

const Page2 = () => {
  const selectedSourceAsset = useRecoilValue(SourceAsset)
  const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY))
  const depositAddress = useRecoilValue(SourceDepositAddress)

  return (
    <StyledPage2>
      <NumbersContainer>
        <Column />
        <Column>
          <StyledImage src={step1InActive} height={`40px`} width={`40px`} />
        </Column>
        <Column>
          <StyledImage src={step2active} height={`65px`} width={`65px`} />
        </Column>
        <Column>
          <StyledImage src={step3Inctive} height={`40px`} width={`40px`} />
        </Column>
        <Column />
      </NumbersContainer>
      <FlexColumn>
        <p>Waiting on your deposit</p>
      </FlexColumn>
      <br />
      <div style={{ margin: `0px 5px 10px 0px` }}>
        <StyledImage src={caution} height={`15px`} width={`15px`} />
        <span style={{ margin: `0px 0px 0px 10px` }}>Next Step:</span>
      </div>
      <StyledPTag>
        {`Deposit ${selectedSourceAsset?.assetSymbol} on ${sourceChain?.chainName}
			to this address:`}
        <div style={{ margin: `10px 0px 0px 0px` }}>
          <BoldSpan>{depositAddress?.assetAddress}</BoldSpan>
          <Tooltip
            anchorContent={
              <CopyToClipboard
                height={`12px`}
                width={`10px`}
                textToCopy={depositAddress?.assetAddress || ""}
                showImage={true}
              />
            }
            tooltipText={"Copy to Clipboard"}
            tooltipAltText={"Copied to Clipboard!"}
          />
        </div>
      </StyledPTag>
    </StyledPage2>
  )
}

export default Page2
