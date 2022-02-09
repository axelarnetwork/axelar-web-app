import { useRecoilValue } from "recoil"
import styled from "styled-components"
import BoldSpan from "components/StyleComponents/BoldSpan"
import { FlexRow } from "components/StyleComponents/FlexRow"
import { FlexColumn } from "components/StyleComponents/FlexColumn"
import Tooltip from "components/Widgets/Tooltip"
import CopyToClipboard from "components/Widgets/CopyToClipboard"
import { DESTINATION_TOKEN_KEY } from "config/consts"
import completedLogo from "assets/svg/transaction_status_logos/axelar-logo.svg"
import {
  ChainSelection,
  DestinationAddress,
  SourceAsset,
} from "state/ChainSelection"
import { StyledPTag } from "./StyledPTag"

const NumbersContainer = styled(FlexRow)`
  height: 40%;
`

const StyledPage4 = styled.div`
  width: 300px;
  height: 225px;
  position: relative;
  overflow: hidden;
`

const Page4 = () => {
  const selectedSourceAsset = useRecoilValue(SourceAsset)
  const destinationChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY))
  const destinationAddr = useRecoilValue(DestinationAddress)

  return (
    <StyledPage4>
      <NumbersContainer>
        <img src={completedLogo} height={`100%`} width={`100%`} alt={""} />
      </NumbersContainer>
      <FlexColumn>
        <br />
        <p>Transfer Completed!</p>
      </FlexColumn>
      <br />
      <StyledPTag>
        {`Completed ${selectedSourceAsset?.assetSymbol} transfer to ${destinationChain?.chainName} at: `}
        <br />
        <br />
        <BoldSpan>{destinationAddr}</BoldSpan>
        <Tooltip
          anchorContent={
            <CopyToClipboard
              height={`12px`}
              width={`10px`}
              textToCopy={destinationAddr || ""}
              showImage={true}
            />
          }
          tooltipText={"Copy to Clipboard"}
          tooltipAltText={"Copied to Clipboard!"}
        />
      </StyledPTag>
    </StyledPage4>
  )
}

export default Page4
