import React, { useState, useEffect } from 'react';
import './Quizz.scss';
import { db } from '../../firebase';
import Loader from '../Loader/Loader';

function Quizz(props) {
	const theme = props.match.params.theme;
	const baseID = 'hz2fK3KpYDlCG7af12t9';

	const [state, setState] = useState([{ choix: [] }]);
	const [maxQuestion] = useState(10);
	const [countQuestion, setcountQuestion] = useState(0);
	const [score, setScore] = useState(0);
	const [diplayBtnValider, setdiplayBtnValider] = useState(false);
	const [diplayBtnSuivant, setdiplayBtnSuivant] = useState(false);
	const [choice, setChoice] = useState(null);
	const [loader, setLoader] = useState(false);

	const btns = document.querySelectorAll('button');

	useEffect(() => {
		setLoader(true);
		db.collection('dataBase')
			.doc(baseID)
			.get()
			.then((doc) => {
				setLoader(false);
				console.log(doc.data().questions.filter(question=>question.theme === theme));
				setState(doc.data().questions.filter(question=>question.theme === theme && !question.private));
				//localStorage.setItem('questions', JSON.stringify(doc.data().questions));
			})
			.catch((err) => console.log(err));
	}, []);

	const handleChoice = (index) => {
		setChoice(index);
		setdiplayBtnValider(true);
	};

	const valider = () => {
		if (choice+1 == state[countQuestion].reponse) {
			setScore((prev) => ++prev);
			btns[choice].classList.add('right');
		} else btns[choice].classList.add('wrong');

		setdiplayBtnValider(false);
		setdiplayBtnSuivant(true);
	};

	const suivant = () => {
		if (countQuestion + 1 > maxQuestion) setcountQuestion(0);
		else setcountQuestion((count) => count + 1);

		setdiplayBtnValider(false);
		setdiplayBtnSuivant(false);
		btns[choice].className = '';
	};

	const displayChoice = state[countQuestion].choix
		.filter((choice) => choice !== '')
		.map((choice, index) => (
			<button key={index} onClick={() => handleChoice(index)} className='choice'>
				{choice}
			</button>
		));

	return (
		<div className='Quizz'>
			{loader && <Loader />}
			<h1>Theme: {theme}</h1>
			<h2>
				Score: {score}/{maxQuestion}
			</h2>
			<h2>
				Question {countQuestion + 1}/{maxQuestion}
			</h2>
			{state[countQuestion].question}

			<div className='container-choix'>{displayChoice}</div>

	
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
