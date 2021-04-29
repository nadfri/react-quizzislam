import React from 'react';
import loading from './loading.svg';
import './Loader.scss';

function Loader(props) {
	return (
		<div className='Loader'>
			<img src={loading} alt='loader' />
		</div>
	);
}

export default Loader;
