import copy       from "copy-to-clipboard";
import {SVGImage} from "./SVGImage";
import styled     from "styled-components";

const StyledSVGImage = styled(SVGImage)`
	cursor: pointer;
`;

interface ICopyToClipboardProps {
	height: string;
	width: string;
	margin?: string;
	textToCopy: string;
}
const CopyToClipboardImage = (props: ICopyToClipboardProps) => {
	const { height, margin, width, textToCopy } = props;

	const onClick = () => copy(textToCopy);

	return <StyledSVGImage
		onClick={onClick}
		height={height}
		width={width}
		margin={ margin || `5px`}
		src={require(`resources/copy-to-clipboard.svg`).default}
	/>
}

export default CopyToClipboardImage;