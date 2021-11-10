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
    display: block;
    padding: 0.75rem 1.25rem;
    background-color: #fff;
    height: 30%;
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
			const img = require(`resources/transaction_status_logos/transfer-step-${currIdx + 1}-${currIdx === activeStep ? "active" : "inactive"}.svg`).default;
			return <CSSTransition
				key={id}
				timeout={500}
				classNames="item"
			>
				<StyledListItem>
					<FlexSpaceBetween>
						<div style={{ width: `40px`, height: `40px`, position: `relative` }}>
							<StyledImage src={img} />
						</div>
					<div style={{ width: `100%`, textIndent: `20px`, height: `100%` }}>{text}</div>
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
		if (index >= 1)
			setShowHelperCartoonWidget(true);
	}

	return [activeStep, updateStep, jsx] as const;
}

export default useTodoList;