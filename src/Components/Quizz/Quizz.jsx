import React, { useState, useEffect } from 'react';
import './Quizz.scss';
import { dataBase } from './dataBase';

function Quizz(props) {
	const theme = props.match.params.theme;

	const [state, setState] = useState([{ choix: [] }]);
	const [maxQuestion] = useState(10);
	const [countQuestion, setcountQuestion] = useState(0);
	const [score, setScore] = useState(0);
	const [diplayBtnValider, setdiplayBtnValider] = useState(false);
	const [diplayBtnSuivant, setdiplayBtnSuivant] = useState(false);
	const [choice, setChoice] = useState(null);

    const btns = document.querySelectorAll('button');

	useEffect(() => {
		setState(dataBase);
	}, []);

	const handleChoice = (index) => {
		setChoice(index);
		setdiplayBtnValider(true);
	};

	const valider = () => {
		
		if (choice === state[countQuestion].reponse) {
			setScore((prev) => ++prev);
			btns[choice].classList.add('right');
		}

        else btns[choice].classList.add('wrong');

		setdiplayBtnValider(false);
		setdiplayBtnSuivant(true);
	};

	const suivant = () => {
		if (countQuestion + 1 > maxQuestion) setcountQuestion(0);
		else setcountQuestion((count) => count + 1);

		setdiplayBtnValider(false);
		setdiplayBtnSuivant(false);
        btns[choice].className = "";

	};

	const displayChoice = state[countQuestion].choix.map((choice, index) => (
		<button key={index} onClick={() => handleChoice(index)} className='choice'>
			{choice}
		</button>
	));

	return (
		<div className='Quizz'>
			<h1>Theme: {theme}</h1>
			<h2>
				Score: {score}/{maxQuestion}
			</h2>
			<h2>
				Question {countQuestion + 1}/{maxQuestion}
			</h2>
			{state[countQuestion].question}
			<hr />
			{displayChoice}

			<hr />
			{diplayBtnValider && <button onClick={valider}>Valider</button>}

			{diplayBtnSuivant && (
				<>
					<p>{state[countQuestion].info}</p>
					<button onClick={suivant}>Suivant</button>
				</>
			)}
		</div>
	);
}

export default Quizz;
