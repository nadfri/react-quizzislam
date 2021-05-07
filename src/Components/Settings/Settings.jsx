import React from 'react';
import { Link } from 'react-router-dom';
import './Settings.scss';

function Settings() {
	return (
		<div className='Settings'>
			<Link to='/settings/config'>Ajouter des Questions</Link>
			<Link to='/settings/list'>Liste des Questions</Link>
		</div>
	);
}

export default Settings;
