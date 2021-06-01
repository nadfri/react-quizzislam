import React from 'react';
import { Link } from 'react-router-dom';
import './Settings.scss';

function Settings() {
	return (
		<div className='Settings'>
			<Link to='/settings/suggestion'>Une Suggestion</Link>
			<Link to='/settings/signalement'>Signaler une Erreur</Link>
			<Link to='/settings/apropos'>À propos</Link>
			<Link to='/settings/admin' className="admin">Administration</Link>
		</div>
	);
}

export default Settings;
