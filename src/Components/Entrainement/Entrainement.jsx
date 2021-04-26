import React from 'react';
import './Entrainement.scss';
import { Link } from 'react-router-dom';

function Entrainement(props) {
	return (
		<div className='Entrainement'>
			<Link to='/entrainement/quizz/coran'>Coran</Link>
			<Link to='/entrainement/quizz/histoire'>Histoire</Link>
			<Link to='/entrainement/quizz/lesProphetes'>Les Prophètes</Link>
			<Link to='/entrainement/quizz/jurisprudence'>JurisPrudence</Link>
			<Link to='/entrainement/quizz/prophete'>Vie du Prophète</Link>
		</div>
	);
}

export default Entrainement;
