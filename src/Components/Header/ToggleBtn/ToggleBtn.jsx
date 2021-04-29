import React, { useState, useEffect } from 'react';
import Toggle from 'react-switch';
import fire from '../../../firebase';

function ToggleBtn() {
	const [checked, setChecked] = useState(false);

	const currentUser = fire.auth().currentUser;
	useEffect(() => {
		if (currentUser) setChecked(true);
	}, [currentUser]);

	const logOut = () => {
		setChecked(false);
		fire.auth().signOut();
	};

	return (
		<div className='ToggleBtn'>
			<Toggle
				className='toggle'
				onChange={logOut}
				uncheckedIcon={false}
				checkedIcon={false}
				onHandleColor='#2693e6'
				onColor='#86ffc6'
				offColor='#f79e8e'
				boxShadow='0px 1px 5px rgba(0, 0, 0, 0.6)'
				activeBoxShadow='0px 0px 1px 10px rgba(0, 0, 0, 0.2)'
				handleDiameter={30}
				height={20}
				width={48}
				checked={checked}
				disabled={!checked}
			/>
		</div>
	);
}

export default ToggleBtn;
