import React from 'react';
import { Link } from 'react-router-dom';
import "./Niveau.scss"

function Niveau(props) {
    const theme = props.match.params.theme;
	return (
		<div className='Niveau'>
			<h1>{theme}</h1>
			<div className='links'>
				<Link to={`${theme}/1`}>Débutant</Link>
				<Link to={`${theme}/2`}>Intermédiaire</Link>
				<Link to={`${theme}/3`}>Expert</Link>
			</div>
		</div>
	);
}

export default Niveau;
