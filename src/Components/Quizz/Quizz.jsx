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
import correctURL from "../../Sounds/correct.mp3"
import incorrectURL from "../../Sounds/incorrect.mp3"
import Notes from '../Notes/Notes';

function Quizz(props) {
	const btns = document.querySelectorAll('button');
	const interfaceDiv = document.querySelector('.interfaceDiv');
	const correct = new Audio(correctURL);
	const incorrect = new Audio(incorrectURL);
	const skew = document.querySelector('.skew');
	const theme = props.match.params.theme;
	const niveau = props.match.params.niveau > 3 ? '3' : props.match.params.niveau;
	const baseID = 'hz2fK3KpYDlCG7af12t9';
	const background = {
		coran: backCoran,
		prophete: backMoh,
		lesProphetes: backProph,
		compagnons: backComp,
		histoire: backHist,
		textes: backText,
		culture: backCult,
		jurisprudence: backJuri,
	};

	const conversion = {
		1: 'Débutant',
		2: 'Intermédiaire',
		3: 'Expert',
		prophete: 'Muhammad ﷺ ',
		coran: 'Coran',
		histoire: 'Histoire',
		lesprophetes: 'Les Prophetes',
		Jurisprudence: 'Jurisprudence',
		textes: 'Textes',
		compagnons: 'Compagnons',
		culture: 'Culture',
	};

	const [state, setState] = useState([{ choix: [] }]);
	const [countQuestion, setcountQuestion] = useState(0);
	const [score, setScore] = useState(0);
	const [diplayBtnValider, setdiplayBtnValider] = useState(false);
	const [diplayBtnSuivant, setdiplayBtnSuivant] = useState(false);
	const [choice, setChoice] = useState(null);
	const [loader, setLoader] = useState(false);
	const [maxQuestions, setMaxQuestions] = useState(20);
	const [displayQuizz, setDisplayQuizz] = useState(true);
	const [displayNotes, setDisplayNote] = useState(false);
	const [skewText, setSkewText] = useState("");


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
				//console.log(doc.data().questions.filter((question) => question.theme === theme));
				const questions = randomize(
					doc
						.data()
						.questions.filter(
							(question) =>
								question.theme === theme &&
								question.niveau === niveau &&
								!question.private,
						),
				);
				setState(questions);

				setMaxQuestions(questions.length >= 20 ? 20 : questions.length);
			})
			.catch((err) => console.log(err));
	}, [theme, niveau]);

	const handleChoice = (index) => {
		setChoice(index);
		setdiplayBtnValider(true);
	};

	const displayChoice = state[countQuestion].choix
		.filter((choice) => choice !== '')
		.map((choice, index) => (
			<button key={index} onClick={() => handleChoice(index)} className='choice'>
				{choice}
			</button>
		));



	const valider = () => {
		const reponse = Number(state[countQuestion].reponse);
		skew.classList.add('slideSkew');
		if (choice + 1 === reponse) {
			setScore((prev) => ++prev);
			btns[choice].classList.add('right');
			setSkewText("EXACT!");
			skew.classList.add("green");
			correct.play();

		} else {
			btns[choice].classList.add('wrong');
			btns[reponse - 1].classList.add('right');
			setSkewText("FAUX!");
			skew.classList.add("red");
			incorrect.play();
		}

		for (let btn of btns) {
			btn.classList.add('disabled', 'dezoom');
			setTimeout(() => (btn.style.display = 'none'), 300);
		}

		setTimeout(() => {
			btns[choice].style.display = '';
			btns[reponse - 1].style.display = '';
			btns[choice].classList.replace('dezoom', 'zoom');
			btns[reponse - 1].classList.replace('dezoom', 'zoom');
			setdiplayBtnSuivant(true);
		}, 300);
		setdiplayBtnValider(false);
	};

	const suivant = () => {
		if (countQuestion + 1 === maxQuestions) {
			setDisplayQuizz(false);
			setDisplayNote(true);
		} else {
			skew.className = "skew";
			setcountQuestion((count) => count + 1);
			setdiplayBtnSuivant(false);

			btns.forEach((btn) => (btn.className = 'choice'));
			btns.forEach((btn) => (btn.style.display = ''));

			interfaceDiv.classList.replace('slideIn', 'slideOut');
			setTimeout(() => {
				interfaceDiv.classList.replace('slideOut', 'slideIn');
			}, 300);
		}
	};

	return (
		<div className='Quizz' style={{ backgroundImage: `url(${background[theme]}` }}>
			{loader && <Loader />}
			{displayNotes && (
				<Notes score={score} maxQuestions={maxQuestions} params={props.match.params} />
			)}

			{displayQuizz && state.length > 1 && (
				<>
					<div className='etat'>
						<div>
							<div className='score'>
								{score}/{maxQuestions}
							</div>
							<div className="skew">{skewText}</div>
						</div>

						<div className='skews'>
							<div>{conversion[theme]}</div>
							<div>{conversion[niveau]}</div>
						</div>
					</div>

					<div className='interfaceDiv slideIn'>
						<fieldset>
							<legend>
								Question {countQuestion + 1}/{maxQuestions}
							</legend>
							<p>{state[countQuestion].question}</p>
						</fieldset>
						<div className='container-choix'>{displayChoice}</div>
					</div>
					{diplayBtnValider && (
						<button className='tomato' onClick={valider}>
							Valider
						</button>
					)}
					{diplayBtnSuivant && (
						<>
							{state[countQuestion].info !== '' && (
								<div className='info'>{state[countQuestion].info}</div>
							)}
							<button onClick={suivant} className='blue'>
								Suivant
							</button>
						</>
					)}
				</>
			)}
		</div>
	);
}

export default Quizz;
