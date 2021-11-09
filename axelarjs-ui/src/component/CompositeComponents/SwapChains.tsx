import {useCallback}                             from "react";
import {useRecoilState}                          from "recoil";
import styled                                    from "styled-components";
import {StyledCentered}                          from "component/StyleComponents/Centered";
import {SVGImage}                                from "component/Widgets/SVGImage";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY} from "config/consts";
import useResetUserInputs                        from "hooks/useResetUserInputs";
import {ChainSelection}                          from "state/ChainSelection";

const StyledSwapChains = styled.div`
	${StyledCentered}
	height: 28px;
	
`;

const ClickableSvgImage = styled(SVGImage)`
	cursor: pointer;
`;

const SwapChains = () => {
	const [sourceChain, setSourceChain] = useRecoilState(ChainSelection(SOURCE_TOKEN_KEY));
	const [destinationChain, setDestinationChain] = useRecoilState(ChainSelection(DESTINATION_TOKEN_KEY));
	const resetAllInputs = useResetUserInputs();

	const swapChains = useCallback(() => {
		if (!sourceChain || !destinationChain)
			return;
		const newSourceChain = destinationChain, newDestinationChain = sourceChain;
		resetAllInputs();
		setSourceChain(newSourceChain);
		setDestinationChain(newDestinationChain);

	}, [sourceChain, destinationChain, resetAllInputs, setDestinationChain, setSourceChain]);

	return <StyledSwapChains>{
		sourceChain && destinationChain && <ClickableSvgImage
            onClick={swapChains}
            width={`20px`}
            height={`20px`}
            src={require(`resources/swap-icon.svg`).default}
        />
	}
	</StyledSwapChains>
}

export default SwapChains;