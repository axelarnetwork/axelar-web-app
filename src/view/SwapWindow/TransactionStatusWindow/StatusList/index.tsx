import styled                        from "styled-components";
import screenConfigs                 from "config/screenConfigs";
import {useRecoilValue}                          from "recoil";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY} from "config/consts";
import CopyToClipboard                           from "component/Widgets/CopyToClipboard";
import Tooltip                       from "component/Widgets/Tooltip";
import BoldSpan                      from "component/StyleComponents/BoldSpan";
import {ChainSelection, SourceAsset} from "state/ChainSelection";
import {SourceDepositAddress}        from "state/TransactionStatus";

const StyledStatusList = styled.div`
    width: 100%;
    height: 65%;
	@media ${screenConfigs.media.laptop} {
		margin-top: 20px;
	}
`;

const StyledListItem = styled.div`
	height: 25%;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	@media ${screenConfigs.media.laptop} {
		font-size: 18px;
	}
	@media ${screenConfigs.media.tablet} {
		font-size: 13px;
	}
	@media ${screenConfigs.media.mobile} {
		font-size: 10px;
	}
`;

const StyledImage = styled.img`
	height: 50%;
	width: 50%;
`;
interface IListItemProps {
	activeStep: number;
	step: number;
	text: any;
}
const ListItem = (props: IListItemProps) => {

	const {activeStep, step, text} = props;
	let suffix: string;

	if (activeStep > step) {
		suffix = "complete";
	}
	else if (activeStep === step) {
		suffix = "active";
	}
	else {
		suffix = "inactive";
	}

	return <StyledListItem>
		<div style={{ width: `20%`, height: `100%`, display: `flex`, alignItems: `center`, justifyContent: `center` }}>
			<StyledImage
				src={require(`resources/transaction_status_logos/step-${step}-${suffix}.svg`)?.default}
				alt={""}
			/>
		</div>
		<div style={{
			width: `80%`,
			height: `100%`,
			display: `flex`,
			alignItems: `center`,
			color: activeStep >= step ? 'black' : 'lightgray'
		}}>
			{text}
		</div>
	</StyledListItem>
}
interface IStatusListProps {
	activeStep: number;
}
const StatusList = (props: IStatusListProps) => {
	const { activeStep } = props;
	const selectedSourceAsset = useRecoilValue(SourceAsset);
	const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const destinationChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const depositAddress = useRecoilValue(SourceDepositAddress);

	return <StyledStatusList>
		<ListItem
			step={1} activeStep={activeStep}
			text={`Generating Source Chain Deposit Address`}
		/>
		<ListItem
			step={2} activeStep={activeStep}
			text={activeStep >= 2
				? <div style={{overflowWrap: `break-word`, overflow: `hidden`, marginTop: `1.5em` }}>
					Deposit {selectedSourceAsset?.assetSymbol} on {sourceChain?.chainName} here:
					<div style={{ margin: `5px 0px 0px 0px`}}>
						<Tooltip
							anchorContent={<CopyToClipboard
								JSXToShow={<BoldSpan>{depositAddress?.assetAddress} </BoldSpan>}
								height={`12px`}
								width={`10px`}
								textToCopy={depositAddress?.assetAddress || ""}
								showImage={true}
							/>}
							tooltipText={"Copy to Clipboard"}
							tooltipAltText={"Copied to Clipboard!"}
						/>
					</div>
				</div>
				: `Waiting for your deposit into a temporary deposit account.`
			}
		/>
		<ListItem
			step={3} activeStep={activeStep}
			text={activeStep >= 3
				? <div><div>Confirmed. Completing your transfer.</div><div> You may exit this window if you wish.</div></div>
				: `Axelar to confirm your deposit.`
			}
		/>
		<ListItem
			step={4} activeStep={activeStep}
			text={activeStep >= 4
				? `Transfer Completed!`
				: `Waiting to detect transaction on ${destinationChain?.chainName}`
			}
		/>
	</StyledStatusList>
}

export default StatusList;