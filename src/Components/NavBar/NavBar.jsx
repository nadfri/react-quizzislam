import React, { useEffect, useRef } from 'react';
import './NavBar.scss';
import { NavLink } from 'react-router-dom';

function NavBar() {
	const refNav = useRef(null);

	useEffect(() => {
		let posY = 10;
		const handleScroll = () => {
			window.scrollY > posY
				? refNav.current.classList.add('hidden')
				: refNav.current.classList.remove('hidden');
			posY = window.scrollY;
		};

		document.addEventListener('scroll', handleScroll);

		return () => document.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<div className='NavBar' ref={refNav}>
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
			<NavLink to='/settings'>
				<i className='fas fa-tools'></i>
			</NavLink>
		</div>
	);
}

export default NavBar;
