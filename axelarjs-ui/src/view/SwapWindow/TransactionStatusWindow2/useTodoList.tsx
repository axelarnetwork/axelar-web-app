import React, {useState}                 from 'react';
import {Button, Container, ListGroup,}   from 'react-bootstrap';
import {CSSTransition, TransitionGroup,} from 'react-transition-group';
import {v4 as uuid}                      from 'uuid';
import {useSetRecoilState}               from "recoil";
import {ShowHelperCartoonWidget}         from "state/ApplicationStatus";
import './todolist.css';

const steps: string[] = ["", "", "", ""];

interface IITem {
	id: string;
	text: string;
}

const useTodoList = () => {

	const [items, setItems] = useState<IITem[]>(steps.map(step => ({
		id: uuid(),
		text: step
	})));
	const [activeStep, setActiveStep] = useState<number>(0);
	const setShowHelperCartoonWidget = useSetRecoilState(ShowHelperCartoonWidget);

	const jsx = () => <Container style={{height: '275px'}}>
		<ListGroup style={{marginBottom: '1rem'}}>
			<TransitionGroup className="todo-list">
				{items
				.filter((item, i) => i <= activeStep)
				.map(({id, text}) => (
					<CSSTransition
						key={id}
						timeout={500}
						classNames="item"
					>
						<ListGroup.Item>
							<Button
								className="status-btn"
								variant="danger"
								size="sm"
							>
								&times;
							</Button>
							{text}
						</ListGroup.Item>
					</CSSTransition>
				))}
			</TransitionGroup>
		</ListGroup>
	</Container>;

	// const addStep = (itemText: string) => {
	// 	setItems(items => [
	// 		...items,
	// 		{ id: uuid(), text: itemText },
	// 	]);
	// }
	const updateStep = (itemText: string, index: number) => {
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

	// const setAddStep = (step: number) => {
	// 	if (steps && steps[step]) {
	// 		addStep(steps[step]);
	// 	}
	// }

	return [activeStep, updateStep, jsx] as const;
}

export default useTodoList;