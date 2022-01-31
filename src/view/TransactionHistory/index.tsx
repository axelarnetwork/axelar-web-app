import {useSetRecoilState}          from "recoil";
import styled                       from "styled-components";
import {ShowTransactionHistoryPage} from "state/ApplicationStatus";
import {Mask}                       from "component/Widgets/Mask";
import {StyledLargePopupPage}       from "component/StyleComponents/StyledLargePopupPage";
import {StyledButton}               from "component/StyleComponents/StyledButton";

const TextSection = styled.div`
	width: 100%;
	height: 75%;
	margin: 3em 0em 3em 0em;
	overflow-y: scroll;
	box-shadow: 2px 0px 7.0px hsl(0deg 0% 0% / 0.39);
	border-radius: 10px;
	box-sizing: border-box;
	padding: 2em;
`;

interface LargeDisclaimerProps {
	onClose?: () => void;
}

export const TransactionHistory = ({onClose}: LargeDisclaimerProps) => {
	const setShowTransactionHistory = useSetRecoilState(ShowTransactionHistoryPage);

	return <Mask centered={true}><StyledLargePopupPage>
		<h1>Transaction History</h1>
		<TextSection>
			Her i
		</TextSection>
		<br/>
		<DisclaimerAgreeButton callback={() => {
			setShowTransactionHistory(false);
			onClose && onClose();
		}}
           text={"Close"}
		/>

	</StyledLargePopupPage></Mask>;
}

const DisclaimerAgreeButton = ({ callback, text }: { callback: (agreed: boolean) => void; text: string; }) => (
	<StyledButton onClick={() => callback(true)}>
		{text}
	</StyledButton>
)

export default TransactionHistory;