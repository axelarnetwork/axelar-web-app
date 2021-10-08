import Button                                                                 from "react-bootstrap/Button";
import {FlexRow}                                                              from "component/StyleComponents/FlexRow";
import ChainSelector
                                                                              from "component/CompositeComponents/ChainSelector";
import {FlexColumn}                                                           from "component/StyleComponents/FlexColumn";
import {NumberFormInput}                                                      from "component/CompositeComponents/NumberFormInput";
import {GridDisplay}                                                          from "component/StyleComponents/GridDisplay";
import {FooterComponent}                                                      from "component/StyleComponents/FooterComponent";
import {ChainSelection, DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY, SourceAsset} from "state/ChainSelection";
import {useRecoilState, useRecoilValue}                                       from "recoil";
import {SupportedChains}                                                      from "@axelar-network/axelarjs-sdk";
import AssetSelector                                                          from "./AssetSelector";

interface IUserInputWindowProps {
	handleSwapSubmit: any;
}

const UserInputWindow = ({handleSwapSubmit}: IUserInputWindowProps) => {

	const sourceChainSelection = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const [sourceChainAsset, setSourceChainAsset] = useRecoilState(SourceAsset);

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
			<Button variant="secondary" size="sm" onClick={handleSwapSubmit}>
				Initiate Asset Transfer
			</Button>
		</FooterComponent>
	</GridDisplay>;
}

export default UserInputWindow;