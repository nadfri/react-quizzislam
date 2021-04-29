import React from 'react';
import './Header.scss';
import ToggleBtn from './ToggleBtn/ToggleBtn';

function Header(props) {
	return (
		<div className='Header'>
			<h1>QuizzIslam</h1>
			<ToggleBtn/>
		</div>
	);
}

export default Header;
