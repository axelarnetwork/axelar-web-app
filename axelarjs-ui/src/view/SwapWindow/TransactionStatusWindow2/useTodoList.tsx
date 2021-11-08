import React, {useState}                 from 'react';
import {Button, Container, ListGroup,}   from 'react-bootstrap';
import {CSSTransition, TransitionGroup,} from 'react-transition-group';
import { v4 as uuid }                              from 'uuid';
import './todolist.css';

interface IITem {
	id: string;
	text: string;
}
const useTodoList = () => {
	const [items, setItems] = useState<IITem[]>([]);
	const [activeStep, setActiveStep] = useState<number>(0);

	const steps: string[] = [
		"Waiting",
		"Generating Source Chain Deposit Address",
		"Waiting on Source Chain Confirmations",
		"Axelar Network working...",
		"Deposit Confirmed on Destination Chain"
	];

	const jsx = () => <Container style={{marginTop: '2rem'}}>
		<ListGroup style={{marginBottom: '1rem'}}>
			<TransitionGroup className="todo-list">
				{items.map(({id, text}) => (
					<CSSTransition
						key={id}
						timeout={500}
						classNames="item"
					>
						<ListGroup.Item>
							<Button
								className="remove-btn"
								variant="danger"
								size="sm"
								onClick={() =>
									setItems(items =>
										items.filter(item => item.id !== id)
									)
								}
							>
								&times;
							</Button>
							{text}
						</ListGroup.Item>
					</CSSTransition>
				))}
			</TransitionGroup>
		</ListGroup>
		<Button
			onClick={() => {
				const text = prompt('Enter some text');
				if (text) {
					setItems(items => [
						...items,
						{ id: uuid(), text },
					]);
				}
			}}
		>
			Add Item
		</Button>
	</Container>;

	const addStep = (itemText: string) => {
		setItems(items => [
			...items,
			{ id: uuid(), text: itemText },
		]);
	}

	console.log("todo active step",activeStep);

	const setAddStep = (step: number) => {
		if (steps && steps[step]) {
			addStep(steps[step]);
		}
	}

	return [items, setActiveStep, jsx] as const;
}

export default useTodoList;