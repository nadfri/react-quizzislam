import React from 'react';
import BoutonLink from '../BoutonLink/BoutonLink';
import './Home.scss';

function Home() {
	return (
		<div className='Home'>
			<BoutonLink link='/entrainement' content='Entrainement' />
			<BoutonLink link='/competition' content='Compétition' />
		</div>
	);
}

export default Home;
