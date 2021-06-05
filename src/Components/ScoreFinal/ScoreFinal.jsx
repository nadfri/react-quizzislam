import React, { useState, useEffect } from 'react';
import './ScoreFinal.scss';
import { db } from '../../firebase';
import ListClassement from '../ListClassement/ListClassement';
import ScrollTop from '../ScrollTop/ScrollTop';
import bellURL from '../../Sounds/bell.mp3';

function ScoreFinal(props) {
	const TOP = 100;
	const { goodReponse, maxQuestions, score, pseudo, classement } = props;
	const classementID = 'XXJ9yQ0slzmwKLLEr1fI';
	let couleur, Texte, background;
	const lastScore = classement[TOP - 1].score;
	const note = `${goodReponse}/${maxQuestions}`;

	const [classementFinal, setClassementFinal] = useState(null);
	const [rank, setRank] = useState(null);

	useEffect(() => {
		/*Delete Classement*/
		// const deleteArray = [];
		// for (let i =0; i<100;i++)
		// deleteArray[i] = {pseudo:"",score:0,note:""};
		// console.table('deleteArray :>> ', deleteArray);
		// db.collection('classement').doc(classementID).update({ classement :deleteArray });

		if (score >= lastScore && score > 0) {
			const newClassement = [...classement];
			newClassement[TOP - 1] = { pseudo, score, note };
			newClassement.sort((a, b) => b.score - a.score);
			//console.log('classement :>> ', classement);
			setClassementFinal(newClassement);
			//set pour ecraser la base de donnée existante aulieu d'update()
			db.collection('classement').doc(classementID).set({ classement: newClassement });

			setRank(
				newClassement.findIndex((user) => user.pseudo === pseudo && user.score === score) +
					1,
			);
		}
	}, []);

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
			Texte = (
				<div>
					Ne désespère pas <span className='colorBlue'>{pseudo}!</span>, continue de
					t'entrainer pour te classer dans le <b>TOP 100</b>!
				</div>
			);
			background = 'backRed';
			break;
	}

	return (
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
	);
}

export default ScoreFinal;
