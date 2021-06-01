import React from 'react';
import { Link } from 'react-router-dom';
import '../Settings/Settings';

function Admin() {
	return (
		<div className="Settings">
			<Link to='/settings/ajout'>Ajouter des Questions</Link>
			<Link to='/settings/list'>Liste des Questions</Link>
		</div>
	);
}

export default Admin;
