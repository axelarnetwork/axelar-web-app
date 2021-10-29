import React, {useState}                                 from "react";
import Button                                            from "react-bootstrap/Button";
import {useRecoilState, useRecoilValue}                  from "recoil";
import styled                                            from "styled-components";
import {IAssetInfo, validateDestinationAddress}          from "@axelar-network/axelarjs-sdk";
import svg                                               from "assets/transfer-modal-light-mode.svg";
import ChainSelector                                     from "component/CompositeComponents/ChainSelector";
import {NumberFormInput}                                 from "component/CompositeComponents/NumberFormInput";
import {FlexRow}                                         from "component/StyleComponents/FlexRow";
import {FlexColumn}                                      from "component/StyleComponents/FlexColumn";
import {FooterComponent}                                 from "component/StyleComponents/FooterComponent";
import {GridDisplay}                                     from "component/StyleComponents/GridDisplay";
import DelayedRender                                     from "component/Widgets/DelayedRender";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}         from "config/consts";
import {ChainSelection, DestinationAddress, SourceAsset} from "state/ChainSelection";
import {ChainList}                                       from "state/ChainList";
import {StyledAppContainer}                              from "view/App/styles/StyledAppContainer";
import AssetSelector                                     from "./AssetSelector";

interface IUserInputWindowProps {
	handleSwapSubmit: any;
}

const ChainBox = styled(FlexRow)`
	height: 100px;
	margin: 5px;
	border-radius: 8px;
	box-shadow: inset 0 0 3px 0 rgba(0, 0, 0, 0.21);
	border: solid 1px #e2e1e2;
`;
const UserInputWindow = ({handleSwapSubmit}: IUserInputWindowProps) => {

	const sourceChainSelection = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const chainList = useRecoilValue(ChainList);
	const destChainSelection = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const destAddr = useRecoilValue(DestinationAddress);
	const [sourceChainAsset, setSourceChainAsset] = useRecoilState(SourceAsset);
	const [isValidDestinationAddress, setIsValidDestinationAddress] = useState(true);

	return <StyledAppContainer
		style={{ backgroundImage: `url(${svg})`, backgroundRepeat: `no-repeat` }}
		height={"640px"}
		width={"640px"}
		margin={"15px"}
		padding={"15px"}
	>
		<GridDisplay style={{ margin: "100px"}}>
			<ChainBox>
				<ChainSelector id={SOURCE_TOKEN_KEY} label={"Source Chain"}/>
			</ChainBox>
			<ChainBox>
				<ChainSelector id={DESTINATION_TOKEN_KEY} label={"Destination Chain"}/>
			</ChainBox>
			{sourceChainSelection && sourceChainSelection?.assets && sourceChainSelection?.assets?.length > 1 &&
            <FlexRow>
                <AssetSelector
                    selectedToken={sourceChainAsset}
                    allTokens={chainList?.find(chain => chain?.chainName === sourceChainSelection?.chainName)?.assets || []}
                    handleChange={(asset) => setSourceChainAsset(asset)}
                />
            </FlexRow>
			}
			<FlexColumn>
				<NumberFormInput/>
			</FlexColumn>
			<FooterComponent>
				<Button variant="secondary" size="sm" onClick={() => {
					const destToken: IAssetInfo = {
						assetAddress: destAddr as string,
						assetSymbol: destChainSelection?.chainSymbol
					}
					const validAddr: boolean = validateDestinationAddress(destChainSelection?.chainSymbol as string, destToken);
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
		</GridDisplay>
	</StyledAppContainer>;
}

export default UserInputWindow;