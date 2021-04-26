import React from 'react';
import BoutonLink from '../BoutonLink/BoutonLink';
import './Competition.scss';

function Competition(props) {
	return (
		<div className='Competition'>
			<BoutonLink link='/competition/connexion' content='Connexion' />
			<BoutonLink link='/competition/inscription' content='Inscription' />
		</div>
	);
}

export default Competition;
