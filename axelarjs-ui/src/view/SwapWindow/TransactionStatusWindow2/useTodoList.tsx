import React, {ReactElement, useState}   from 'react';
import {Container, ListGroup,}           from 'react-bootstrap';
import {CSSTransition, TransitionGroup,} from 'react-transition-group';
import styled                            from "styled-components";
import {v4 as uuid}                      from 'uuid';
import {useSetRecoilState}               from "recoil";
import {FlexSpaceBetween}                from "component/StyleComponents/FlexSpaceBetween";
import {SVGImage}                        from "component/Widgets/SVGImage";
import {ShowHelperCartoonWidget}         from "state/ApplicationStatus";
import './todolist.css';

const StyledListItem = styled.div`
    position: relative;
    display: block;
    padding: 0.75rem 1.25rem;
    background-color: #fff;
    height: 30%;
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

	const jsx = () => <Container style={{height: '275px'}}>
		<ListGroup style={{marginBottom: '1rem'}}>
			<TransitionGroup className="todo-list">
				{items
				.filter((item, i) => i <= activeStep)
				.map(({id, text}: IITem, currIdx: number) => {
					return <CSSTransition
						key={id}
						timeout={500}
						classNames="item"
					>
						<ListGroup.Item>
							<FlexSpaceBetween>
							<SVGImage height={"40px"} width={"40px"}
							          src={require(`resources/transaction_status_logos/transfer-step-${currIdx + 1}-${currIdx === activeStep ? "active" : "inactive"}.svg`).default}
							/>
							<div style={{ width: `100%`, textIndent: `20px`, height: `100%` }}>{text}</div>
							</FlexSpaceBetween>
						</ListGroup.Item>
					</CSSTransition>
				})}
			</TransitionGroup>
		</ListGroup>
	</Container>;

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