import React from 'react';
import './NavBar.scss';
import { NavLink } from 'react-router-dom';

function NavBar(props) {
	return (
		<div className='NavBar'>
			<NavLink exact to='/'><i className='fas fa-dice-d6'></i></NavLink>
			<NavLink to='/entrainement'><i className="fas fa-gamepad"></i></NavLink>
			<NavLink to='/competition'><i className='fas fa-trophy'></i></NavLink>
			<NavLink exact to='/classement'><i className="fas fa-medal"></i></NavLink>
			<NavLink exact to='/settings'><i className='fas fa-tools'></i></NavLink>
		</div>
	);
}

export default NavBar;
