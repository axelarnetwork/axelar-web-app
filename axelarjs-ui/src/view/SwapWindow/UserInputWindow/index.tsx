import Button                           from "react-bootstrap/Button";
import {FlexRow}                        from "component/StyleComponents/FlexRow";
import ChainSelector                    from "component/CompositeComponents/ChainSelector";
import {FlexColumn}                     from "component/StyleComponents/FlexColumn";
import {NumberFormInput}                from "component/CompositeComponents/NumberFormInput";
import {GridDisplay}                    from "component/StyleComponents/GridDisplay";
import {FooterComponent}                from "component/StyleComponents/FooterComponent";
import {
	ChainSelection,
	DESTINATION_TOKEN_KEY,
	DestinationAddress,
	SOURCE_TOKEN_KEY,
	SourceAsset
}                                       from "state/ChainSelection";
import {useRecoilState, useRecoilValue} from "recoil";
import {
	ITokenAddress,
	SupportedChains,
	SupportedTokenSymbols
}                                       from "@axelar-network/axelarjs-sdk";
import AssetSelector                    from "./AssetSelector";
import {useState}                       from "react";
import {validateDestinationAddress}     from "@axelar-network/axelarjs-sdk/dist/utils";
import DelayedRender                    from "component/Widgets/DelayedRender";

interface IUserInputWindowProps {
	handleSwapSubmit: any;
}

const UserInputWindow = ({handleSwapSubmit}: IUserInputWindowProps) => {

	const sourceChainSelection = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const destChainSelection = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const destAddr = useRecoilValue(DestinationAddress);
	const [sourceChainAsset, setSourceChainAsset] = useRecoilState(SourceAsset);
	const [isValidDestinationAddress, setIsValidDestinationAddress] = useState(true);

	return <GridDisplay>
		<FlexRow>
			<ChainSelector id={SOURCE_TOKEN_KEY} label={"Source"}/>
			<ChainSelector id={DESTINATION_TOKEN_KEY} label={"Destination"}/>
		</FlexRow>
		{sourceChainSelection && sourceChainSelection?.assets?.length > 1 &&
        <FlexRow>
            <AssetSelector
                selectedToken={sourceChainAsset}
                allTokens={SupportedChains?.find(chain => chain?.name === sourceChainSelection?.name)?.assets || []}
                handleChange={(asset) => setSourceChainAsset(asset)}
            />
        </FlexRow>
		}
		<FlexColumn>
			<NumberFormInput/>
		</FlexColumn>
		<FooterComponent>
			<Button variant="secondary" size="sm" onClick={() => {
				const destToken: ITokenAddress = {
					tokenAddress: destAddr,
					tokenSymbol: destChainSelection?.symbol as SupportedTokenSymbols
				}
				const validAddr: boolean = validateDestinationAddress(destToken);
				setIsValidDestinationAddress(validAddr);

				if (validAddr)
					handleSwapSubmit();
			}}>
				{isValidDestinationAddress
					? "Initiate Asset Transfer"
					: <DelayedRender
						prevChild={<span>The {destChainSelection?.symbol} address does not look right...</span>}
						newChild={<span>Retry and resubmit here</span>}
						delayBeforeNewChild={3000}
					/>
				}
			</Button>
		</FooterComponent>
	</GridDisplay>;
}

export default UserInputWindow;