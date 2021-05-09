import React from 'react';
import './ScrollTop.scss';

function ScrollTop() {
	return (
		<div className='ScrollTop'>
			<i
				className='fas fa-arrow-circle-up'
				onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}></i>
			<i
				className='fas fa-arrow-circle-down'
				onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}></i>
		</div>
	);
}

export default ScrollTop;
