import React from 'react';
import './Modal.scss';

function Modal(props) {
	return (
		<div className='Modal'>
			<div className='box'>
				<h1>{props.h1}</h1>

				<button onClick={props.close}>OK</button>
			</div>
		</div>
	);
}

export default Modal;
