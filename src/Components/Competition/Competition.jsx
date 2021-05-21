import React, { useState, useEffect } from 'react';
import './Competition.scss';
import { db } from '../../firebase';
import Loader from '../Loader/Loader';
import correctURL from '../../Sounds/correct.mp3';
import incorrectURL from '../../Sounds/incorrect.mp3';
import Speaker from '../Speaker/Speaker';
import { useRef } from 'react';
import Pseudo from '../Pseudo/Pseudo';
import ProgressBar from '../ProgressBar/ProgressBar';

function Competition(props) {
	/***VARIABLES GLOBALES***/
	/*DOM*/
	const btns = document.querySelectorAll('button');
	const interfaceDiv = document.querySelector('.interfaceDiv');
	const skew = document.querySelector('.skew');
	const duree = 240;
	const bonus = 1000;
	const malus = -300;
	const min = 100;

	/*AUDIO*/
	const muteStorage = JSON.parse(localStorage.getItem('mute')) || false;
	const correct = new Audio(correctURL);
	const incorrect = new Audio(incorrectURL);
	const audios = [correct, incorrect];

	/*DATAS*/
	const baseID = 'hz2fK3KpYDlCG7af12t9';

	const conversion = {
		1: 'Débutant',
		2: 'Intermédiaire',
		3: 'Expert',
		prophete: 'Muhammad ﷺ ',
		coran: 'Coran',
		histoire: 'Histoire',
		lesProphetes: 'Prophètes',
		jurisprudence: 'Jurisprudence',
		textes: 'Textes',
		compagnons: 'Compagnons',
		culture: 'Culture',
	};

	/***STATE HOOKS***/
	const [state, setState] = useState([{ choix: [] }]);
	const [countQuestion, setcountQuestion] = useState(0);
	const [score, setScore] = useState(0);
	const [choice, setChoice] = useState(null);
	const [loader, setLoader] = useState(false);
	const [diplayBtnValider, setdiplayBtnValider] = useState(false);
	const [displayQuizz, setDisplayQuizz] = useState(true);
	const [displayPseudo, setDisplayPseudo] = useState(true);
	const [pseudo, setPseudo] = useState('');
	const [skewText, setSkewText] = useState('');
	const [mute, setMute] = useState(muteStorage);
	const [displayProgress, setDisplayProgress] = useState(true);
	const [minuteur, setMinuteur] = useState(duree);
	const [startTime, setStartTime] = useState(null);

	const reponses = useRef();

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

	/***USE EFFECT***/
	useEffect(() => {
		//setLoader(true);
		db.collection('dataBase')
			.doc(baseID)
			.get()
			.then((doc) => {
				//setLoader(false);
				//console.log(doc.data().questions.filter((question) => question.theme === theme));
				const questions = randomize(doc.data().questions);

				reponses.current = questions;
				const questionsSansRep = questions.map(({ reponse, ...rest }) => rest);
				setState(questionsSansRep); //questions sans les réponses
				setStartTime(Date.now());
			})
			.catch((err) => console.log(err));
	}, []);

	/***Gestion du Minuteur ****/
	useEffect(() => {
		const timer = minuteur > 0 && setTimeout(() => setMinuteur(minuteur - 1), 1000);
		return () => clearInterval(timer);
	}, [minuteur]);

	/***GESTION DES CHOIX DES REPONSES***/
	const handleChoice = (index) => {
		setChoice(index);
		//setdiplayBtnValider(true);
		//valider();
		const endTime = Date.now();
		const reponse = Number(reponses.current[countQuestion].reponse);
		skew.classList.add('slideSkew');
		if (index + 1 === reponse) {
			btns[index].classList.add('right');
			setSkewText('EXACT!');
			skew.classList.add('green');
			correct.play();

			let newScore = Math.floor(1100 - (endTime - startTime) / 10);
			if (newScore < 0) newScore = 100;

			setScore((prev) => prev + newScore);
		} else {
			btns[index].classList.add('wrong');
			setSkewText('FAUX!');
			skew.classList.add('red');
			incorrect.play();
		}

		setTimeout(suivant, 500);
	};

	const displayChoice = state[countQuestion].choix
		.filter((choice) => choice !== '')
		.map((choice, index) => (
			<button key={index} onClick={() => handleChoice(index)} className='choice'>
				{choice}
			</button>
		));

	/***VALIDATION DES REPONSES***/
	const valider = () => {
		const endTime = Date.now();
		const reponse = Number(reponses.current[countQuestion].reponse);
		skew.classList.add('slideSkew');
		if (choice + 1 === reponse) {
			btns[choice].classList.add('right');
			setSkewText('EXACT!');
			skew.classList.add('green');
			correct.play();

			let newScore = Math.floor(bonus + 100 - (endTime - startTime) / 10);
			if (newScore < 0) newScore = 100;

			setScore((prev) => prev + newScore);
		} else {
			btns[choice].classList.add('wrong');
			setSkewText('FAUX!');
			skew.classList.add('red');
			incorrect.play();
			setScore((prev) => prev - malus);
		}

		setdiplayBtnValider(false);
		setTimeout(suivant, 700);
	};

	/***QUESTION SUIVANTE***/
	const suivant = () => {
		setStartTime(Date.now());
		skew.className = 'skew';
		setcountQuestion((count) => count + 1);

		btns.forEach((btn) => (btn.className = 'choice'));
		//btns.forEach((btn) => (btn.style.display = ''));

		interfaceDiv.classList.replace('slideIn', 'slideOut');
		setTimeout(() => {
			interfaceDiv.classList.replace('slideOut', 'slideIn');
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
		setDisplayPseudo(false);
		setDisplayQuizz(true);
		setPseudo(localStorage.getItem('pseudo'));
	};

	/***RENDU JSX***/
	return (
		<div className='Competition'>
			{loader && <Loader />}
			<Speaker toggleMute={toggleMute} mute={mute} />
			{displayPseudo && (
				<Pseudo validPseudo={validPseudo} bonus={bonus} malus={malus} min={min} />
			)}

			{minuteur === 0 && <h2>FINISH</h2>}

			{displayQuizz && minuteur !== 0 && (
				<>
					<div className='etat'>
						<div className='score-container'>
							<div className='score'>{score}</div>
							<div className='skew'>{skewText}</div>
						</div>

						{displayProgress && <ProgressBar />}
					</div>

					<div className='interfaceDiv slideIn'>
						<fieldset>
							<legend>Question {countQuestion + 1}</legend>
							<p>{state[countQuestion].question}</p>
						</fieldset>
						<div className='container-choix'>{displayChoice}</div>
					</div>
					{diplayBtnValider && (
						<button className='tomato' onClick={valider}>
							Valider
						</button>
					)}
				</>
			)}
		</div>
	);
}

export default Competition;
