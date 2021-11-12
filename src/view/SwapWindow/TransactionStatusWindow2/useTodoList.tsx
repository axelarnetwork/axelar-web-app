import React, {ReactElement, useState}   from 'react';
import {CSSTransition, TransitionGroup,} from 'react-transition-group';
import styled                            from "styled-components";
import {v4 as uuid}                      from 'uuid';
import {useSetRecoilState}               from "recoil";
import {FlexSpaceBetween}                from "component/StyleComponents/FlexSpaceBetween";
import {StyledImage}                     from "component/StyleComponents/StyledImage";
import {ShowHelperCartoonWidget}         from "state/ApplicationStatus";
import './todolist.css';

const StyledListItem = styled.div`
    position: relative;
    padding: 0rem 0.75rem 0rem 0.75rem;
    box-sizing: border-box;
    width: 100%;
    background-color: #fff;
    border: solid 1px #e2e1e2;
    border-radius: 5px;
    display: flex;
    align-items: center;
    height: 25%;
`;
const StyledTextBox = styled.div`
    width: 90%;
    height: 100%;
    overflow-wrap: break-word;
    padding-left: 20px;
    box-sizing: border-box;
`;

const StyledTransitionGroup = styled(TransitionGroup)`
	height: 275px;
`;

const steps: (ReactElement | null)[] = [null, null, null, null];

interface IITem {
	id: string;
	text: ReactElement | null;
}

const useTodoList = () => {

	const [items, setItems] = useState<IITem[]>(steps.map(step => ({
		id: uuid(),
		text: step
	})));
	const [activeStep, setActiveStep] = useState<number>(0);
	const setShowHelperCartoonWidget = useSetRecoilState(ShowHelperCartoonWidget);

	const jsx = () => <StyledTransitionGroup>
		{items
		.filter((item, i) => i <= activeStep)
		.map(({id, text}: IITem, currIdx: number) => {
			const img = require(`resources/transaction_status_logos/success-green-check-mark.svg`).default;
			// TODO: we'll use something like the below later... once those assets are ready. above is a stopgap
			// const img = require(`resources/transaction_status_logos/transfer-step-${currIdx + 1}-${currIdx === activeStep ? "active" : "inactive"}.svg`).default;
			return <CSSTransition
				key={id}
				timeout={500}
				classNames="item"
			>
				<StyledListItem>
					<FlexSpaceBetween style={{ width: `100%` }}>
						<div style={{ width: `35px`, height: `35px`, position: `relative` }}>
							<StyledImage src={img} />
						</div>
					<StyledTextBox>{text}</StyledTextBox>
					</FlexSpaceBetween>
				</StyledListItem>
			</CSSTransition>
		})}
	</StyledTransitionGroup>;

	const updateStep = (itemText: ReactElement, index: number) => {
		const newState = items.map((item: IITem, iter: number) => {
			if (iter === index)
				return {id: item.id, text: itemText}
			return item;
		})
		setActiveStep(index);
		setItems(items => newState);
		if (index === 1) {
			setShowHelperCartoonWidget(true);
			setTimeout(() => setShowHelperCartoonWidget(false),120_000);
		}
	}

	return [activeStep, updateStep, jsx] as const;
}

export default useTodoList;