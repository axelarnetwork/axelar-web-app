import {IChainInfo}                                                     from "@axelar-network/axelarjs-sdk";
import styled                                                           from "styled-components";
import screenConfigs                                                    from "config/screenConfigs";
import {useRecoilValue}                                                 from "recoil";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}                        from "config/consts";
import downstreamServices                                               from "config/downstreamServices";
import CopyToClipboard                                                  from "component/Widgets/CopyToClipboard";
import Link                                                             from "component/Widgets/Link";
import Tooltip                                                          from "component/Widgets/Tooltip";
import BoldSpan                                                         from "component/StyleComponents/BoldSpan";
import {Nullable}                                                       from "interface/Nullable";
import {ChainSelection, SourceAsset}                                    from "state/ChainSelection";
import {IConfirmationStatus, NumberConfirmations, SourceDepositAddress} from "state/TransactionStatus";

const StyledStatusList = styled.div`
    width: 100%;
    height: 65%;
	@media ${screenConfigs.media.desktop} {
		margin-top: 20px;
	}
`;

const StyledListItem = styled.div`
	height: 25%;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	@media ${screenConfigs.media.desktop} {
		font-size: 18px;
	}
	@media ${screenConfigs.media.laptop} {
		font-size: 16px;
	}
	@media ${screenConfigs.media.tablet} {
		font-size: 13px;
	}
	@media ${screenConfigs.media.mobile} {
		font-size: 10px;
	}
`;

const StyledImage = styled.object`
	height: 75%;
	width: 75%;
`;

interface IListItemProps {
	activeStep: number;
	step: number;
	text: any;
	className?: string;
}

const ListItem = (props: IListItemProps) => {

	const {activeStep, className, step, text} = props;
	let suffix: string;

	if (activeStep > step) {
		suffix = "complete";
	} else if (activeStep === step) {
		suffix = "active";
	} else {
		suffix = "inactive";
	}

	return <StyledListItem className={className}>
		<div style={{width: `20%`, height: `100%`, display: `flex`, alignItems: `center`, justifyContent: `center`}}>
			<StyledImage
				data={require(`resources/transaction_status_logos/step-${step}-${suffix}.svg`)?.default}
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
	const {activeStep} = props;
	const selectedSourceAsset = useRecoilValue(SourceAsset);
	const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const destinationChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const depositAddress = useRecoilValue(SourceDepositAddress);
	const destNumConfirm: IConfirmationStatus = useRecoilValue(NumberConfirmations(DESTINATION_TOKEN_KEY));

	return <StyledStatusList>
		<ListItem
			className={"joyride-status-step-1"}
			step={1} activeStep={activeStep}
			text={`Generating a one-time deposit address`}
		/>
		<ListItem
			className={"joyride-status-step-2"}
			step={2} activeStep={activeStep}
			text={activeStep >= 2
				? <div style={{overflowWrap: `break-word`, overflow: `hidden`, marginTop: `1.5em`}}>
					Deposit {selectedSourceAsset?.assetSymbol} on {sourceChain?.chainName} here:
					<div style={{margin: `5px 0px 0px 0px`}}>
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
			className={"joyride-status-step-3"}
			step={3} activeStep={activeStep}
			text={activeStep >= 3
				? <div>
					<div>Confirmed. Completing your transfer.</div>
					<div> You may exit this window if you wish.</div>
				</div>
				: `Axelar Network confirming your deposit on ${sourceChain?.chainName}.`
			}
		/>
		<ListItem
			className={"joyride-status-step-4"}
			step={4} activeStep={activeStep}
			text={activeStep >= 4
				? ShowTransactionComplete({destNumConfirm, destinationChain})
				: `Waiting to detect transaction on ${destinationChain?.chainName}`
			}
		/>
	</StyledStatusList>
}


const ShowTransactionComplete = ({
	                                 destNumConfirm,
	                                 destinationChain
                                 }: { destNumConfirm: IConfirmationStatus, destinationChain: Nullable<IChainInfo> }) => {

	const blockExplorer: { name: string, url: string } = downstreamServices.blockExplorers[process.env.REACT_APP_STAGE as string]
		&& downstreamServices.blockExplorers[process.env.REACT_APP_STAGE as string][destinationChain?.chainName?.toLowerCase() as string];
	console.log("block explorer", blockExplorer, destNumConfirm, process.env.REACT_APP_STAGE);
	return destNumConfirm.transactionHash && blockExplorer
		? <div style={{overflowWrap: `break-word`, overflow: `hidden`}}>
			Transaction completed - see it {" "}
			<Link href={`${blockExplorer.url}${destNumConfirm.transactionHash}`}>here</Link>
			{" "} on {blockExplorer.name}!
		</div>
		: "Transfer Completed!";
}

export default StatusList;