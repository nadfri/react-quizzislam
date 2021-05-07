import React, { useState, useEffect } from 'react';
import './Quizz.scss';
import { db } from '../../firebase';
import Loader from '../Loader/Loader';
import backCoran from '../../Backgrounds/background10.jpg';
import backMoh from '../../Backgrounds/background3.jpg';
import backComp from '../../Backgrounds/background5.jpg';
import backHist from '../../Backgrounds/background2.jpg';
import backCult from '../../Backgrounds/background13.jpg';
import backJuri from '../../Backgrounds/background9.jpg';
import backProph from '../../Backgrounds/background12.jpg';
import backText from '../../Backgrounds/background15.jpg';

function Quizz(props) {
	const theme = props.match.params.theme;
	const baseID = 'hz2fK3KpYDlCG7af12t9';
	const background ={
		coran : backCoran,
		prophete : backMoh,
		lesProphetes : backProph,
		compagnons : backComp,
		histoire : backHist,
		textes : backText,
		culture : backCult,
		jurisprudence : backJuri
	};


	const [state, setState] = useState([{ choix: [] }]);
	const [maxQuestion] = useState(10);
	const [countQuestion, setcountQuestion] = useState(0);
	const [score, setScore] = useState(0);
	const [diplayBtnValider, setdiplayBtnValider] = useState(false);
	const [diplayBtnSuivant, setdiplayBtnSuivant] = useState(false);
	const [choice, setChoice] = useState(null);
	const [loader, setLoader] = useState(false);

	const btns = document.querySelectorAll('button');

	function randomize(tab) {
		var i, j, tmp;
		for (i = tab.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			tmp = tab[i];
			tab[i] = tab[j];
			tab[j] = tmp;
		}
		return tab;
	}

	useEffect(() => {
		setLoader(true);
		db.collection('dataBase')
			.doc(baseID)
			.get()
			.then((doc) => {
				setLoader(false);
				console.log(doc.data().questions.filter((question) => question.theme === theme));
				setState(
					randomize(
						doc
							.data()
							.questions.filter(
								(question) => question.theme === theme && !question.private,
							),
					),
				);
			})
			.catch((err) => console.log(err));
	}, [theme]);

	const handleChoice = (index) => {
		setChoice(index);
		setdiplayBtnValider(true);
	};

	const valider = () => {
		const reponse = Number(state[countQuestion].reponse);
		if (choice + 1 === reponse) {
			setScore((prev) => ++prev);
			btns[choice].classList.add('right');
		} else {
			btns[choice].classList.add('wrong');
			btns[reponse - 1].classList.add('right');
		}
		btns.forEach((btn) => btn.classList.add('disabled'));

		setdiplayBtnValider(false);
		setdiplayBtnSuivant(true);
	};

	const suivant = () => {
		if (countQuestion + 1 > maxQuestion) setcountQuestion(0);
		else setcountQuestion((count) => count + 1);

		setdiplayBtnValider(false);
		setdiplayBtnSuivant(false);
		btns.forEach((btn) => (btn.className = 'choice'));
	};

	const displayChoice = state[countQuestion].choix
		.filter((choice) => choice !== '')
		.map((choice, index) => (
			<button key={index} onClick={() => handleChoice(index)} className='choice'>
				{choice}
			</button>
		));

	return (
		<div className='Quizz' style={{ backgroundImage: `url(${background[theme]}` }}>
			{loader && <Loader />}
			<div className='etat'>
				<span>
					Score: {score}/{maxQuestion}
				</span>
				<span className='theme'>{theme}</span>
				<span>
					Question: {countQuestion + 1}/{maxQuestion}
				</span>
			</div>
			<div className='question'>{state[countQuestion].question}</div>
			<div className='container-choix'>{displayChoice}</div>
			{diplayBtnValider && <button onClick={valider}>Valider</button>}
			{diplayBtnSuivant && (
				<>
					{state[countQuestion].info !== '' && <p>{state[countQuestion].info}</p>}
					<button onClick={suivant} className='blue'>
						Suivant
					</button>
				</>
			)}
		</div>
	);
}

export default Quizz;
