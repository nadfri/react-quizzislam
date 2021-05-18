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
	const [maxQuestions, setMaxQuestions] = useState(20);
	const [score, setScore] = useState(0);
	const [choice, setChoice] = useState(null);
	const [loader, setLoader] = useState(false);
	const [diplayBtnValider, setdiplayBtnValider] = useState(false);
	const [displayQuizz, setDisplayQuizz] = useState(false);
	const [displayPseudo, setDisplayPseudo] = useState(true);
	const [skewText, setSkewText] = useState('');
	const [mute, setMute] = useState(muteStorage);
	const [pseudo, setPseudo] = useState("");
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
		setLoader(true);
		db.collection('dataBase')
			.doc(baseID)
			.get()
			.then((doc) => {
				setLoader(false);
				//console.log(doc.data().questions.filter((question) => question.theme === theme));
				const questions = randomize(doc.data().questions);

				reponses.current = questions;
				const questionsSansRep = questions.map(({ reponse, ...rest }) => rest);
				setState(questionsSansRep); //questions sans les réponses
				setMaxQuestions(questions.length >= 20 ? 20 : questions.length);
			})
			.catch((err) => console.log(err));
	}, []);

	/***GESTION DES CHOIX DES REPONSES***/
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

	/***VALIDATION DES REPONSES***/
	const valider = () => {
		const reponse = Number(reponses.current[countQuestion].reponse);
		skew.classList.add('slideSkew');
		if (choice + 1 === reponse) {
			setScore((prev) => ++prev);
			btns[choice].classList.add('right');
			setSkewText('EXACT!');
			skew.classList.add('green');
			correct.play();
		} else {
			btns[choice].classList.add('wrong');
			btns[reponse - 1].classList.add('right');
			setSkewText('FAUX!');
			skew.classList.add('red');
			incorrect.play();
		}

		for (let btn of btns) {
			btn.classList.add('disabled', 'dezoom');
			setTimeout(() => (btn.style.display = 'none'), 200);
		}

		setTimeout(() => {
			btns[choice].style.display = '';
			btns[reponse - 1].style.display = '';
			btns[choice].classList.replace('dezoom', 'zoom');
			btns[reponse - 1].classList.replace('dezoom', 'zoom');
		}, 200);
		setdiplayBtnValider(false);
	};

	/***QUESTION SUIVANTE***/
	const suivant = () => {
		if (countQuestion + 1 === maxQuestions) {
			setDisplayQuizz(false);
		} else {
			skew.className = 'skew';
			setcountQuestion((count) => count + 1);


			btns.forEach((btn) => (btn.className = 'choice'));
			btns.forEach((btn) => (btn.style.display = ''));

			interfaceDiv.classList.replace('slideIn', 'slideOut');
			setTimeout(() => {
				interfaceDiv.classList.replace('slideOut', 'slideIn');
			}, 300);
		}
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
		setPseudo(localStorage.getItem("pseudo"));
	}

	/***RENDU JSX***/
	return (
		<div className='Competition'>
			{loader && <Loader />}
			<Speaker toggleMute={toggleMute} mute={mute} />
			{displayPseudo && <Pseudo validPseudo={validPseudo}/>}

			{displayQuizz  && (
				<>
						<ProgressBar />
					<div className='etat'>
						<div>
							<div className='score'>
								{score}/{maxQuestions}
							</div>
							<div className='skew'>{skewText}</div>
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
					
				</>
			)}
		</div>
	);
}

export default Competition;
