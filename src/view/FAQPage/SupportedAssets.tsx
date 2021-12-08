import styled, {css} from "styled-components";

/*
TODO:
1 - dynamically import supported assets from SDK
2 - make table reusable component
3 - clean up formatting
* */
const tableStyles = css`
	text-align: left;
	border: 1px solid lightgrey;
	box-sizing: border-box;
	padding: 0.1em;
`;
const StyledTable = styled.table`
	${tableStyles}
`;
const StyledRow = styled.tr`
	${tableStyles}
`;
const StyledCell = styled.td`
	${tableStyles}
`;
const StyledHeader = styled.th`
	background-color: lightgray;
`;
const SupportedAssets = () => {
	return <StyledTable>
		<StyledRow>
			<StyledHeader>Asset</StyledHeader>
			<StyledHeader>Supported Chains (formatting TBU)</StyledHeader>
		</StyledRow>
		<StyledRow>
			<StyledCell>UST</StyledCell>
			<StyledCell>Axelar, Avalanche, Ethereum, Fantom, Moonbeam, Polygon, Terra</StyledCell>
		</StyledRow>
		<StyledRow>
			<StyledCell>AXL</StyledCell>
			<StyledCell>Axelar, Avalanche, Ethereum, Fantom, Moonbeam, Polygon</StyledCell>
		</StyledRow>
	</StyledTable>
}

export default SupportedAssets;