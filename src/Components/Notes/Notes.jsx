import React from 'react';
import './Notes.scss';
import { Link } from 'react-router-dom';
import { FaGamepad } from 'react-icons/fa';
import { FaTrophy } from 'react-icons/fa';

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
		case score / maxQuestions === 1:
			couleur = 'green';
			texte = 'Parfait Machallah! Essaie le Mode Compétition!';
			background = 'backGreen';
			break;

		case score / maxQuestions >= 0.75 && niveau < "3":
			couleur = 'green';
			texte = 'Machallah, Essaie le Niveau suivant!';
			background = 'backGreen';
			break;

		case score / maxQuestions >= 0.75:
			couleur = 'green';
			texte = 'Machallah, Encore un peu et ça sera parfait!';
			background = 'backGreen';
			break;

		case score / maxQuestions >= 0.5 && score / maxQuestions < 0.75:
			couleur = 'orange';
			texte =
				'Entraine toi encore pour avoir un meilleur score la prochaine fois Inchallah!';
			background = 'backOrange';
			break;
		case score / maxQuestions < 0.5:
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
					<span className={`note ${couleur}`}>{score}</span> /{maxQuestions}
				</div>

				<div className='skews'>
					<div className='skew'>{conversion[niveau]}</div>
					<div className='skew'>{conversion[theme]}</div>
				</div>
			</div>
			<div className={`texte ${background}`}>{texte}</div>
			<div className='links'>
				{niveau < 3 ? (
					<Link to={`/entrainement/quizz/${theme}/${parseInt(niveau) + 1}`} >
						<span>Niveau Suivant</span>
						<FaGamepad className='icon' />
					</Link>
				) : (
					<Link to='/entrainement'>
						<span>Menu</span>
						<FaGamepad className='icon' />
					</Link>
				)}
				<Link to='/competition'>
					<span>Compétition</span>
					<FaTrophy className='icon trophy' />
				</Link>
			</div>
		</div>
	);
}

export default Notes;
