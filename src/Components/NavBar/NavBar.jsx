import React, { useEffect, useState } from 'react';
import './NavBar.scss';
import { NavLink } from 'react-router-dom';

function NavBar(props) {
	const [display, setDisplay] = useState(true);

	const handleScroll = () => {
		if (document.body.scrollTop > 10 || document.documentElement.scrollTop > 10)
			setDisplay(false);
		else setDisplay(true);
	};

	useEffect(() => {
		document.addEventListener('scroll', handleScroll);
		return () => document.addEventListener('scroll', handleScroll);
	}, []);

	return (
		<div className={display ? 'NavBar' : 'NavBar hidden'}>
			<NavLink exact to='/'>
				<i className='fas fa-dice-d6'></i>
			</NavLink>
			<NavLink to='/entrainement'>
				<i className='fas fa-gamepad'></i>
			</NavLink>
			<NavLink to='/competition'>
				<i className='fas fa-trophy'></i>
			</NavLink>
			<NavLink exact to='/classement'>
				<i className='fas fa-medal'></i>
			</NavLink>
			<NavLink exact to='/settings'>
				<i className='fas fa-tools'></i>
			</NavLink>
		</div>
	);
}

export default NavBar;
