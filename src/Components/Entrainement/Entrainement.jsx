import React from 'react';
import './Entrainement.scss';
import { Link } from 'react-router-dom';

function Entrainement() {
	return (
		<div className='Entrainement'>
			<Link to='/entrainement/quizz/coran'>Coran</Link>
			<Link to='/entrainement/quizz/histoire'>Histoire</Link>
			<Link to='/entrainement/quizz/prophete'>Muhammad <span className="sws">ﷺ</span></Link>
			<Link to='/entrainement/quizz/lesProphetes'>Les Prophètes</Link>
			<Link to='/entrainement/quizz/jurisprudence'>Jurisprudence</Link>
			<Link to='/entrainement/quizz/textes'>Textes en Islam</Link>
			<Link to='/entrainement/quizz/compagnons'>Les Compagnons</Link>
			<Link to='/entrainement/quizz/culture'>Culture Générale</Link>
		</div>
	);
}

export default Entrainement;
