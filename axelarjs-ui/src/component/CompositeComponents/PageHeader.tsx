import Container     from "../StyleComponents/Container";
import styled        from "styled-components";
import logo          from "assets/logos/AXE.svg";
import {SVGImage}    from "../Widgets/SVGImage";
import Link          from "../Widgets/Link";
import {GITHUB_LINK} from "../../config";
import {FlexRow}     from "../StyleComponents/FlexRow";

const StyledPageHeader = styled(Container)`
	position: fixed;
	width: 100%;
	height: 80px;
	background-color: darkgrey;
	overflow: hidden;
	top: 0;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`

const PageHeader = () => {
	return (
		<StyledPageHeader>
			<SVGImage src={logo} height={"40px"} width={"150px"} margin={"20px"}/>
			<FlexRow>
				<Link>Docs (TBD)</Link>
				<Link href={GITHUB_LINK}>Github</Link>
			</FlexRow>
		</StyledPageHeader>
	);
}

export default PageHeader;