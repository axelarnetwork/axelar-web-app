import styled             from "styled-components";
import downstreamServices from "config/downstreamServices";
import Container          from "../StyleComponents/Container";
import {SVGImage}         from "../Widgets/SVGImage";
import Link               from "../Widgets/Link";
import React              from "react";
import {StyledCentered}   from "../StyleComponents/Centered";

const StyledPageFooter = styled(Container)`
	position: fixed;
	bottom: 0;
	width: 100%;
	height: 20px;
	padding: 12px 12px 12px 12px;
	box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.21);
	background-image: linear-gradient(92deg, #1b1c1e 2%, #0b0b0c 100%);
	color: white;
	display: flex;
	justify-content: flex-end !important;
	align-items: center !important;
`

const DocsLinks = styled(Link)`
	width: 20px;
	height: 20px;
	opacity: 0.8;
	mix-blend-mode: hard-light;
	padding: 1px;
	margin-right: 10px;
	${StyledCentered}
`;

const Box = styled.div`
	display: flex;
	width: 75px;
	align-items: center;
	justify-content: center;
`;

const PageFooter = () => {
	return (<StyledPageFooter>
		<Box>
			<DocsLinks href={downstreamServices.GITHUB_LINK}>
				<SVGImage
					src={require(`assets/github.svg`)?.default}
					height={"18px"}
					width={"18px"}
					margin={"0px"}
				/>
			</DocsLinks>
			{/*Github*/}
		</Box>
	</StyledPageFooter>);
}

export default PageFooter;