import Button                                            from "react-bootstrap/Button";
import {FlexRow}                                         from "component/StyleComponents/FlexRow";
import ChainSelector                                     from "component/CompositeComponents/ChainSelector";
import {FlexColumn}                                      from "component/StyleComponents/FlexColumn";
import {NumberFormInput}                                 from "component/CompositeComponents/NumberFormInput";
import {GridDisplay}                                     from "component/StyleComponents/GridDisplay";
import {FooterComponent}                                 from "component/StyleComponents/FooterComponent";
import {ChainSelection, DestinationAddress, SourceAsset} from "state/ChainSelection";
import {useRecoilState, useRecoilValue}                  from "recoil";
import {IAsset, SupportedChains, Chains}                         from "@axelar-network/axelarjs-sdk";
import AssetSelector                                     from "./AssetSelector";
import {useState}                                        from "react";
import {validateDestinationAddress}                      from "@axelar-network/axelarjs-sdk/dist/utils";
import DelayedRender                                     from "component/Widgets/DelayedRender";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}         from "../../../config/consts";

interface IUserInputWindowProps {
	handleSwapSubmit: any;
}

const UserInputWindow = ({handleSwapSubmit}: IUserInputWindowProps) => {

	console.log("CHains",Chains);

	const sourceChainSelection = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const destChainSelection = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const destAddr = useRecoilValue(DestinationAddress);
	const [sourceChainAsset, setSourceChainAsset] = useRecoilState(SourceAsset);
	const [isValidDestinationAddress, setIsValidDestinationAddress] = useState(true);

	console.log("source chain selections", sourceChainSelection);
	return <GridDisplay>
		<FlexRow>
			<ChainSelector id={SOURCE_TOKEN_KEY} label={"Source Chain"}/>
			<ChainSelector id={DESTINATION_TOKEN_KEY} label={"Destination Chain"}/>
		</FlexRow>
		{sourceChainSelection && sourceChainSelection?.assets && sourceChainSelection?.assets?.length > 1 &&
        <FlexRow>
            <AssetSelector
                selectedToken={sourceChainAsset}
                allTokens={SupportedChains?.find(chain => chain?.chainName === sourceChainSelection?.chainName)?.assets || []}
                handleChange={(asset) => setSourceChainAsset(asset)}
            />
        </FlexRow>
		}
		<FlexColumn>
			<NumberFormInput/>
		</FlexColumn>
		<FooterComponent>
			<Button variant="secondary" size="sm" onClick={() => {
				const destToken: IAsset = {
					assetAddress: destAddr as string,
					assetSymbol: destChainSelection?.chainSymbol
				}
				const validAddr: boolean = validateDestinationAddress(destToken);
				setIsValidDestinationAddress(validAddr);

				if (validAddr)
					handleSwapSubmit();
			}}>
				{isValidDestinationAddress
					? "Initiate Asset Transfer"
					: <DelayedRender
						prevChild={<span>The {destChainSelection?.chainSymbol} address does not look right...</span>}
						newChild={<span>Retry and resubmit here</span>}
						delayBeforeNewChild={3000}
					/>
				}
			</Button>
		</FooterComponent>
	</GridDisplay>;
}

export default UserInputWindow;