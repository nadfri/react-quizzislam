import React from 'react';
import './Notes.scss';
import { Link } from 'react-router-dom';

function Notes(props) {
	const { score, maxQuestions } = props;
	const { theme, niveau } = props.params;
	let couleur, texte, background;
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

	switch (true) {
		case score > 14:
			couleur = 'green';
			texte = 'Machallah, Essaie le Mode Compétition!';
			background = 'backGreen';
			break;
		case score > 10 && score < 15:
			couleur = 'orange';
			texte =
				'Entraine toi encore pour avoir un meilleur score la prochaine fois Inchallah!';
			background = 'backOrange';
			break;
		case score < 10:
			couleur = 'red';
			texte = "Ne désespère pas, continue de t'entrainer!";
			background = 'backRed';
			break;

		default:
			break;
	}

	return (
		<div className='Notes'>
			<div className='header'>
				<div className='score'>
					<span className={`note ${couleur}`}>{props.score}</span> /{maxQuestions}
				</div>

				<div className='skews'>
					<div className='skew'>{conversion[niveau]}</div>
					<div className='skew'>{conversion[theme]}</div>
				</div>
			</div>
			<div className={`texte ${background}`}>{texte}</div>
			<div className='links'>
				{niveau < 3 ? (
					<Link to={`/entrainement/quizz/${theme}/${parseInt(niveau) + 1}`}>
						<span>Niveau Suivant</span>
						<i className='fas fa-gamepad'></i>
					</Link>
				) : (
					<Link to='/entrainement'>
						<span>Menu</span>
						<i className='fas fa-gamepad'></i>
					</Link>
				)}
				<Link to='/competition'>
					<span>Compétition</span>
					<i className='fas fa-trophy'></i>
				</Link>
			</div>
		</div>
	);
}

export default Notes;