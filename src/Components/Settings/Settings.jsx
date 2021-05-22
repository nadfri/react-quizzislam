import React from 'react';
import { Link } from 'react-router-dom';
import './Settings.scss';

function Settings() {
	return (
		<div className='Settings'>
			<Link to='/settings/config'>Ajouter des Questions</Link>
			<Link to='/settings/list'>Liste des Questions</Link>
			<Link to='/settings/'>Une Suggestion</Link>
			<Link to='/settings/'>Proposer une question</Link>
			<Link to='/settings/'>Signaler une Erreur</Link>
			<Link to='/settings/'>À propos</Link>
		</div>
	);
}

export default Settings;
