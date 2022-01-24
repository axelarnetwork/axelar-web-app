import {useRecoilState}                                                                     from "recoil";
import React, {useEffect, useState}                                                         from "react";
import styled                                                                               from "styled-components";
import {SVGImage}                                                                           from "component/Widgets/SVGImage";
import {HasAlreadyConnectedWallet, HasTerraConnectedToKeplr, KEPLR_WALLET, METAMASK_WALLET} from "state/Wallet";
import {getKeplrWallet, getMetamaskWallet}                                                  from "view/App";
import Container
                                                                                            from "../StyleComponents/Container";
import {FlexColumn}                                                                         from "../StyleComponents/FlexColumn";
import {FlexRow}                                                                            from "../StyleComponents/FlexRow";

const StyledPageHeader = styled(Container)`
	position: fixed;
	top: 0;
	width: 100%;
	height: 45px;
	box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.21);
	background-color: black;
	z-index: 1000;
	display: flex;
	justify-content: space-between;
`
const HeaderText = styled.div`
	
	display: flex;
	flex-direction: row;
	color: lightgrey;
	font-size: larger;
	box-sizing: border-box;
`;
const HeaderImage = styled.div`
	font-family: EthnocentricRg-Regular;
	color: lightgrey;
	font-size: 24px;
	box-sizing: border-box;
	padding: 10px;
`;
const ByText = styled.span`
	color: lightgrey;
	font-size: 12px;
	box-sizing: border-box;
	display: flex;
	align-items: flex-end;
	padding-bottom: 10px;
`;

const ConnectWalletButton = styled(FlexRow)`
	cursor: pointer;
`;
const PageHeader = () => {

	const [hasTerraConnectedToKeplr, setHasTerraConnectedToKeplr] = useRecoilState(HasTerraConnectedToKeplr);
	const [onAddedKeplr, setOnAddedKeplr] = useState<"added" | "exists" | "error" | null>(null);
	const [hasAlreadyConnectedMetamask, setHasAlreadyConnectedMetamask] = useRecoilState(HasAlreadyConnectedWallet(METAMASK_WALLET));
	const [hasAlreadyConnectedKeplr, setHasAlreadyConnectedKeplr] = useRecoilState(HasAlreadyConnectedWallet(KEPLR_WALLET));

	useEffect(() => {
		if (onAddedKeplr) setTimeout(() => setOnAddedKeplr(null), 5000);
	}, [onAddedKeplr, setOnAddedKeplr]);

	const onAddedResult = () => {
		let text = "";
		switch (onAddedKeplr) {
			case "added":
				text = "Successfully added Terra to your Keplr wallet!";
				break;
			case "exists":
				text = "You already had Terra in your Keplr wallet!";
				break;
			case "error":
				text = "Something went wrong. Try again?  ";
				break;
			default:
				return null;
		}
		return <div style={{
			color: (onAddedKeplr !== "error" ? "green" : "red"),
			fontSize: `smaller`,
			fontWeight: `bolder`,
			marginRight: `1em`
		}}>
			{text}
		</div>
	}

	return (
		<StyledPageHeader>
			<HeaderText>
				<HeaderImage>Satellite</HeaderImage>
				<ByText>Powered by Axelar</ByText>
			</HeaderText>
			<FlexRow>
				{onAddedResult()}

				{/*!hasAlreadyConnectedMetamask*/ true && <>
                    <div style={{color: `grey`, fontSize: `0.8em`, fontWeight: ``, marginRight: `0em`}}>
                        <ConnectWalletButton onClick={async () => {
							const connectWalletResult = await getMetamaskWallet().connectToWallet();
							console.log("text", connectWalletResult);
							if (connectWalletResult !== "error") {
								setHasAlreadyConnectedMetamask(true);
							}
						}}>
                            <SVGImage
                                height={`1.25em`}
                                width={`1.25em`}
                                margin={`0px 0em 0px 0.75em`}
                                src={require(`resources/metamask.svg`).default}
                            />
                        </ConnectWalletButton>
                    </div>
                </>}
				{/*!hasAlreadyConnectedKeplr*/ true && <>
                    <div style={{color: `grey`, fontSize: `0.8em`, fontWeight: ``, marginRight: `0em`}}>
                        <ConnectWalletButton onClick={async () => {
							// const connectWalletResult = await (new KeplrWallet("terra").connectToWallet());
							const connectWalletResult = await getKeplrWallet().connectToWallet();
							console.log("text", connectWalletResult);
							if (connectWalletResult !== "error") {
								setHasAlreadyConnectedKeplr(true);
							}
							setOnAddedKeplr(connectWalletResult);
						}}>
                            <SVGImage
                                height={`1.25em`}
                                width={`1.25em`}
                                margin={`0px 0em 0px 0.75em`}
                                src={require(`resources/keplr.svg`).default}
                            />
                        </ConnectWalletButton>
                    </div>
                </>}
				{HeaderDivider()}
				{!hasTerraConnectedToKeplr && <>
                    <div style={{color: `grey`, fontSize: `0.8em`, fontWeight: ``, marginRight: `0em`}}>
                        <ConnectWalletButton onClick={async () => {
							const connectWalletResult = await getKeplrWallet().connectToWallet();
							console.log("text", connectWalletResult);
							if (connectWalletResult !== "error") {
								setHasTerraConnectedToKeplr(true);
							}
							setOnAddedKeplr(connectWalletResult);
						}}>
                            <FlexColumn style={{alignItems: `flex-end`}}>
                                <div style={{fontWeight: "bolder"}}>Need Terra on Keplr? Add it here!</div>
                                <div style={{fontStyle: "italic", fontSize: "0.75em"}}>(Required for UST/Luna transfers
                                    from
                                    Terra)
                                </div>
                            </FlexColumn>
                            <SVGImage
                                height={`1.25em`}
                                width={`1.25em`}
                                margin={`0px 0em 0px 0.75em`}
                                src={require(`resources/keplr.svg`).default}
                            />
                        </ConnectWalletButton>
                    </div>
                </>}
				{HeaderDivider()}
				<div style={{color: `green`, fontSize: `smaller`, fontWeight: `bolder`}}>
					{(process.env.REACT_APP_STAGE || "").toUpperCase()}
				</div>
				{HeaderDivider()}
			</FlexRow>
		</StyledPageHeader>
	);
}

const HeaderDivider = () => <div style={{color: `grey`, margin: `0px 1em 0px 1em`}}>|</div>

export default PageHeader;