import React, { useState, useEffect } from 'react';
import './Competition.scss';
import { db } from '../../firebase';
import Loader from '../Loader/Loader';
import correctURL from '../../Sounds/correct.mp3';
import incorrectURL from '../../Sounds/incorrect.mp3';
import Speaker from '../Speaker/Speaker';
import Pseudo from '../Pseudo/Pseudo';
import ProgressBar from '../ProgressBar/ProgressBar';
import ScoreFinal from '../ScoreFinal/ScoreFinal';

function Competition() {
	/***VARIABLES GLOBALES***/
	/*DOM*/
	let btns = document.querySelectorAll('button');
	const interfaceDiv = document.querySelector('.interfaceDiv');
	const skews = document.querySelectorAll('.skew');
	const duree = 240;
	const bonus = 1000;
	const malus = 400;
	const min = 100;

	/*AUDIO*/
	const muteStorage = JSON.parse(localStorage.getItem('mute')) || false;
	const correct = new Audio(correctURL);
	const incorrect = new Audio(incorrectURL);
	const audios = [correct, incorrect];

	/*DATAS*/
	const classementID = 'XXJ9yQ0slzmwKLLEr1fI';
	const baseID = 'hz2fK3KpYDlCG7af12t9';

	/***STATE HOOKS***/
	const [state, setState] = useState([{ choix: [] }]);
	const [classement, setClassement] = useState([]);
	const [countQuestion, setcountQuestion] = useState(0);
	const [score, setScore] = useState(0);
	const [loader, setLoader] = useState(false);
	const [displayQuizz, setDisplayQuizz] = useState(true);
	const [displayPseudo, setDisplayPseudo] = useState(true);
	const [pseudo, setPseudo] = useState('');
	const [skewText, setSkewText] = useState('');
	const [mute, setMute] = useState(muteStorage);
	const [minuteur, setMinuteur] = useState(null);
	const [startTime, setStartTime] = useState(null);
	const [point, setPoint] = useState(null);
	const [goodReponse, setGoodreponse] = useState(0);

	//const reponses = useRef();

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

	/***Chargement des bases de données***/
	useEffect(() => {
		setLoader(true);

		//Chargement du Classement
		db.collection('classement')
			.doc(classementID)
			.get()
			.then((doc) => {
				//console.log(doc.data().classement.sort((a, b) => b.score - a.score));
				setClassement(doc.data().classement.sort((a, b) => b.score - a.score));
			})
			.catch((err) => console.log(err));

		//Chargement des Questions
		db.collection('dataBase')
			.doc(baseID)
			.get()
			.then((doc) => {
				setLoader(false);
				//console.log(doc.data().questions.filter((question) => question.theme === theme));
				const questions = randomize(doc.data().questions);

				//reponses.current = questions;
				//const questionsSansRep = questions.map(({ reponse, ...rest }) => rest);
				setState(questions); //questions sans les réponses
			})
			.catch((err) => console.log('Erreur FireBase: ', err));
	}, []);

	/***Gestion du Minuteur ****/
	useEffect(() => {
		const timer = minuteur > 0 && setTimeout(() => setMinuteur(minuteur - 1), 1000);
		return () => clearInterval(timer);
	}, [minuteur]);

	/***GESTION DES CHOIX DES REPONSES***/
	/*Affichage des choix*/
	const displayChoice = state[countQuestion].choix
		.filter((choice) => choice !== '')
		.map((choice, index) => (
			<button key={index} onClick={() => handleChoice(index)} className='choice'>
				{choice}
			</button>
		));

	/*Validation du choix*/
	const handleChoice = (index) => {
		btns = document.querySelectorAll('button');
		btns.forEach((btn) => btn.classList.add('disabled'));

		const doublePoint = state[countQuestion].private ? 2 : 1;
		const minDoublePoint = state[countQuestion].private ? 5 : 1;

		const endTime = Date.now();
		const reponse = Number(state[countQuestion].reponse);

		skews[0].classList.add('slideSkew');
		skews[1].classList.add('slideSkew');

		if (index + 1 === reponse) {
			setGoodreponse((prev) => ++prev);
			btns[index].classList.add('right');
			skews[0].classList.add('green');
			skews[1].classList.add('green');

			let newScore = Math.floor(1100 - (endTime - startTime) / 10) * doublePoint;
			newScore = newScore < 100 * minDoublePoint ? 100 * minDoublePoint : newScore;
			//console.log('Score', newScore);
			setPoint('+' + newScore);
			setScore((prev) => prev + newScore);
			setSkewText('EXACT!');
			correct.play();
		} else {
			btns[index].classList.add('wrong');
			skews[0].classList.add('red');
			skews[1].classList.add('red');

			setPoint(-malus);
			setScore((prev) => prev - malus);
			setSkewText('FAUX!');
			incorrect.play();
		}

		setTimeout(suivant, 800);
	};

	/***QUESTION SUIVANTE***/
	const suivant = () => {
		setcountQuestion((count) => count + 1);
		btns.forEach((btn) => (btn.className = 'choice'));
		interfaceDiv.classList.replace('slideIn', 'slideOut');

		setTimeout(() => {
			interfaceDiv.classList.replace('slideOut', 'slideIn');
			setStartTime(Date.now());
			skews[0].className = 'skew';
			skews[1].className = 'skew point';
		}, 300);
	};

	/***GESTION DE L'AUDIO***/
	for (let audio of audios) audio.muted = mute;
	const toggleMute = () => {
		localStorage.setItem('mute', !mute);
		setMute(!mute);
		for (let audio of audios) audio.muted = mute;
	};

	const validPseudo = () => {
		setMinuteur(duree);
		setStartTime(Date.now());
		setDisplayPseudo(false);
		setDisplayQuizz(true);
		setPseudo(localStorage.getItem('pseudo'));
	};

	const Double = () => <span className='double'>X2</span>;

	/***RENDU JSX***/
	return (
		<div className='Competition'>
			{displayPseudo && (
				<Pseudo validPseudo={validPseudo} bonus={bonus} malus={malus} min={min} />
			)}

			{displayQuizz && minuteur > 0 && (
				<>
					{loader && <Loader />}
					<Speaker toggleMute={toggleMute} mute={mute} />
					<div className='etat'>
						<div className='score-container'>
							<div className='score'>{score}</div>
							<div className='skew'>{skewText}</div>
							<div className='skew point'>{point}</div>
						</div>

						<ProgressBar duree={duree} />
					</div>

					<div className='interfaceDiv slideIn'>
						<fieldset>
							<legend>
								Question {countQuestion + 1} {state[countQuestion].private && <Double />}
							</legend>
							<p>{state[countQuestion].question}</p>
						</fieldset>
						<div className='container-choix'>{displayChoice}</div>
					</div>
				</>
			)}

			{minuteur === 0 && (
				<ScoreFinal
					pseudo={pseudo}
					score={score}
					maxQuestions={countQuestion}
					goodReponse={goodReponse}
					classement={classement}
				/>
			)}
		</div>
	);
}

export default Competition;
