import React from 'react';
import "./Speaker.scss"

function Speaker(props) {

    const iconeSpeaker = props.mute? "fas fa-volume-mute" : "fas fa-volume-up";


	return (
		<div className='Speaker' onClick={props.toggleMute}>
			<i className={iconeSpeaker}></i>
		</div>
	);
}

export default Speaker;
