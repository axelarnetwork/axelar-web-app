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
	showImage: boolean;
}

const CopyToClipboardImage = (props: ICopyToClipboardProps) => {
	const {height, margin, width, showImage, textToCopy} = props;

	const onClick = () => copy(textToCopy);

	return showImage
		? <StyledSVGImage
			onClick={onClick}
			height={height}
			width={width}
			margin={margin || `2px 5px 0px 5px`}
			src={require(`resources/copy-to-clipboard.svg`).default}
		/>
		: <div onClick={onClick}>{textToCopy}</div>
}

export default CopyToClipboardImage;