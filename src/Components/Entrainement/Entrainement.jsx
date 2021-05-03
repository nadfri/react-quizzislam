import React from 'react';
import './Entrainement.scss';
import { Link } from 'react-router-dom';

function Entrainement(props) {
	return (
		<div className='Entrainement'>
			<Link to='/entrainement/quizz/coran'>Coran</Link>
			<Link to='/entrainement/quizz/prophete'>Le Prophète <span className="sws">ﷺ</span></Link>
			<Link to='/entrainement/quizz/textes'>Textes en Islam</Link>
			<Link to='/entrainement/quizz/connaissance'>Connaissance Générale</Link>
			<Link to='/entrainement/quizz/lesProphetes'>Les Prophètes</Link>
			<Link to='/entrainement/quizz/jurisprudence'>JurisPrudence</Link>
			<Link to='/entrainement/quizz/compagnons'>Les Compagnons</Link>
		</div>
	);
}

export default Entrainement;
