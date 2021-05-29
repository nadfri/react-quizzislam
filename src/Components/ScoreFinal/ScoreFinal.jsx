import React, { useState, useEffect } from 'react';
import './ScoreFinal.scss';
import { db } from '../../firebase';
import ListClassement from '../ListClassement/ListClassement';
import ScrollTop from '../ScrollTop/ScrollTop';

function ScoreFinal(props) {
	const TOP = 100;
	const { goodReponse, maxQuestions, score, pseudo, classement } = props;
	const classementID = 'XXJ9yQ0slzmwKLLEr1fI';
	let couleur, Texte, background;
	const lastScore = classement[TOP - 1].score === '' ? 0 : classement[TOP - 1].score;
	const note = `${goodReponse}/${maxQuestions}`;

	const [classementFinal, setClassementFinal] = useState(null);
	const [rank, setRank] = useState(null);

	useEffect(() => {
		if (score >= lastScore && score > 0) {
			classement[TOP - 1] = { pseudo, score, note };
			classement.sort((a, b) => b.score - a.score);
			console.log('classement :>> ', classement);
			setClassementFinal(classement);
			db.collection('classement').doc(classementID).update({ classement });
			setRank(
				classement.findIndex((user) => user.pseudo === pseudo && user.score === score) +
					1,
			);
		}
	}, []);

	console.log('rank', rank);

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
			Texte = `Ne désespère pas ${pseudo}, continue de t'entrainer!`;
			background = 'backRed';
			break;
	}

	return (
		<div className='ScoreFinal'>
			<ScrollTop />
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

				<a href='#userID'>Voir Ton Classement</a>

				{classementFinal && (
					<ListClassement
						pseudo={pseudo}
						score={score}
						classementFinal={classementFinal}
					/>
				)}
			</div>
		</div>
	);
}

export default ScoreFinal;
