import {useRecoilValue}              from "recoil";
import styled, {ThemedStyledProps}   from "styled-components";
import {SOURCE_TOKEN_KEY}            from "config/consts";
import {FlexRow}                     from "component/StyleComponents/FlexRow";
import {StyledCentered}              from "component/StyleComponents/Centered";
import {FlexColumn}                  from "component/StyleComponents/FlexColumn";
import BoldSpan                      from "component/StyleComponents/BoldSpan";
import Tooltip                       from "component/Widgets/Tooltip";
import CopyToClipboard               from "component/Widgets/CopyToClipboard";
import step1InActive                 from "resources/transaction_status_logos/step-1-inactive.svg";
import step2active                   from "resources/transaction_status_logos/setp-2-active.svg";
import step3Inctive                  from "resources/transaction_status_logos/step-3-inactive.svg";
import caution                       from "resources/transaction_status_logos/caution.svg";
import {ChainSelection, SourceAsset} from "state/ChainSelection";
import {SourceDepositAddress}        from "state/TransactionStatus";

export const StyledImage = styled.img``;

interface IColumnProps extends ThemedStyledProps<any, any> {
	width?: string;
	margin?: number;
}

export const Column = styled.div<IColumnProps>`
	height: 100%;
	width: 20%;
	${props => props.margin ? `margin: ${props.margin};` : ""}
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
const StyledP = styled.div`
	font-size: 0.75rem;
	overflow-wrap: break-word;
`;

const Page2 = () => {
	const selectedSourceAsset = useRecoilValue(SourceAsset);
	const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const depositAddress = useRecoilValue(SourceDepositAddress);

	return <StyledPage1>
		<NumbersContainer>
			<Column/>
			<Column>
				<StyledImage src={step1InActive} height={`40px`} width={`40px`}/>
			</Column>
			<Column>
				<StyledImage src={step2active} height={`65px`} width={`65px`}/>
			</Column>
			<Column>
				<StyledImage src={step3Inctive} height={`40px`} width={`40px`}/>
			</Column>
			<Column/>
		</NumbersContainer>
		<FlexColumn>
			<p>Waiting on your deposit</p>
		</FlexColumn>
		<br />
		<p><StyledImage src={caution} height={`20px`} width={`20px`}/> Next Step: </p>
		<StyledP>
			{`Deposit ${selectedSourceAsset?.assetSymbol} on ${sourceChain?.chainName}
			to the following address:`}
			<div>
				<BoldSpan>{depositAddress?.assetAddress}</BoldSpan>
				<Tooltip
					tooltipText={<CopyToClipboard
						height={`12px`}
						width={`10px`}
						textToCopy={depositAddress?.assetAddress || ""}
					/>}
					tooltipBox={"Copy to Clipboard"}
				/>
			</div>
		</StyledP>

	</StyledPage1>
}

export default Page2;