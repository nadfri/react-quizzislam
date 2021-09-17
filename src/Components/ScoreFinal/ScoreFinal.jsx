import React, { useState, useEffect } from 'react';
import './ScoreFinal.scss';
import { db } from '../../firebase';
import ListClassement from '../ListClassement/ListClassement';
import ScrollTop from '../ScrollTop/ScrollTop';
import bellURL from '../../Sounds/bell.mp3';
import Loader from './../Loader/Loader';

function ScoreFinal(props) {
	const TOP = 100;
	const { goodReponse, maxQuestions, score, pseudo } = props;
	const classementID = 'XXJ9yQ0slzmwKLLEr1fI';
	let couleur, Texte, background;
	const note = `${goodReponse}/${maxQuestions}`;

	const [classementFinal, setClassementFinal] = useState(null);
	const [rank, setRank] = useState(null);
	const [loader, setLoader] = useState(true);
	const [notBetter, setNotBetter] = useState(false);
	const [oldScore, setOldScore] = useState(null);

	useEffect(() => {
		//Chargement du Classement
		db.collection('classement')
			.doc(classementID)
			.get()
			.then((doc) => {
				setLoader(false);
				const classement = doc.data().classement.sort((a, b) => b.score - a.score);
				const indexPlayer = classement.findIndex((user) => user.pseudo === pseudo);
				//console.log('indexPlayer :>> ', indexPlayer);

				//Joueur deja dans le classement
				if (indexPlayer > -1) {
          //meilleur score
					if (score > classement[indexPlayer].score) {
						classement[indexPlayer].score = score;
						classement[indexPlayer].note = note;
						updateClassement(classement);
					} 
          //score moins bon
          else {
						setNotBetter(true);
						setOldScore(classement[indexPlayer].score);
					}
				}

				//Joueur pas encore dans le classement
				else {
					if (classement.length < TOP) {
						classement.push({ pseudo, score, note });
						updateClassement(classement);
					} 

          else {
						const lastScore = classement[TOP - 1].score;

						if (score > lastScore) {
							classement[TOP - 1] = { pseudo, score, note };
							updateClassement(classement);
						}
					}
				}

			})
			.catch((err) => console.log(err));
	}, []);

	function updateClassement(classement) {
		setClassementFinal(classement.sort((a, b) => b.score - a.score));
		//set pour ecraser la base de donnée existante aulieu d'update()
		db.collection('classement').doc(classementID).set({ classement });
		setRank(
			classement.findIndex((user) => user.pseudo === pseudo && user.score === score) + 1,
		);
	}

	switch (true) {
		case goodReponse / maxQuestions === 1:
			couleur = 'green';
			break;

		case goodReponse / maxQuestions > 0.75:
			couleur = 'green';

			break;

		case goodReponse / maxQuestions >= 0.5 && goodReponse / maxQuestions < 0.75:
			couleur = 'orange';
			break;

		case goodReponse / maxQuestions < 0.5:
			couleur = 'red';
			break;

		default:
			couleur = 'red';
			break;
	}

	switch (true) {
		case notBetter === true:
			Texte = (
				<div>
					<span className='colorBlue'>{pseudo} !</span> Tu n'as pas fait mieux que la
					dernière fois (<span className='colorBlue'>{oldScore}</span>).
					<br />
					Continue de t'entrainer pour battre ton record !
				</div>
			);
			background = 'backRed';
			break;

		case rank !== null && rank > 3:
			Texte = (
				<div>
					Machallah <span className='colorBlue'>{pseudo}</span>!<div>Tu es {rank}ème</div>
				</div>
			);
			background = 'backGreen';
			break;
		case rank === 1:
			Texte = (
				<div className='gold'>
					Machallah <span className='colorBlue'>{pseudo}!</span>
					<div>
						Tu es 1er
						<i className='fas fa-trophy'></i>
					</div>
				</div>
			);
			background = 'backGreen';
			break;
		case rank === 2:
			Texte = (
				<div className='silver'>
					Machallah <span className='colorBlue'>{pseudo}!</span>
					<div>
						Tu es 2ème
						<i className='fas fa-trophy'></i>
					</div>
				</div>
			);
			background = 'backGreen';
			break;

		case rank === 3:
			Texte = (
				<div className='bronze'>
					Machallah <span className='colorBlue'>{pseudo}!</span>
					<div>
						Tu es 3ème
						<i className='fas fa-trophy'></i>
					</div>
				</div>
			);
			background = 'backGreen';
			break;

		default:
			Texte = (
				<div>
					Ne désespère pas <span className='colorBlue'>{pseudo} !</span> continue de
					t'entrainer pour te classer dans le <b>TOP 100</b>!
				</div>
			);
			background = 'backRed';
			break;
	}

	return (
		<>
			{loader ? (
				<Loader />
			) : (
				<div className='ScoreFinal'>
					<div className='header'>
						<div className='skews'>
							<div className='skew pseudo'>{pseudo}</div>
							<div className='skew score'>{score}</div>
						</div>
						<div className='note-container'>
							<span className={`note ${couleur}`}>{goodReponse}</span> /{maxQuestions}
						</div>
					</div>
					<div className={`texte ${background}`}>{Texte}</div>
					<div className='links'>
						<a href='/competition'>Rejouer</a>

						{rank && <a href='#userID'>Voir Ton Classement</a>}

						{classementFinal && (
							<ListClassement
								pseudo={pseudo}
								score={score}
								classementFinal={classementFinal}
							/>
						)}
					</div>
					{classementFinal && <ScrollTop />}
					<audio id='bell' src={bellURL} autoPlay muted={props.mute} />
				</div>
			)}
		</>
	);
}

export default ScoreFinal;
