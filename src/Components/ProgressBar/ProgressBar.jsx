import './ProgressBar.scss';
import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import chronoURL from '../../Sounds/chrono.mp3';
import { DURATION } from '../../utils/constants';

const once = true;
function ProgressBar(props) {
	return (
		<div className='ProgressBar'>
			<CountdownCircleTimer
				isPlaying
				duration={DURATION}
				colors={[['#1dfd94', 0.5], ['#FFFF00', 0.5], ['#FF0000']]}
				size={130}
				strokeWidth={12}
				trailColor='#00000000'
				onComplete={() => props.over()}>
				{({ remainingTime }) => {
					const minutes = Math.floor(remainingTime / 60);
					const secondes = remainingTime % 60;
					const chrono = document.getElementById('chrono');
					remainingTime === 10 && once && chrono.play();

					return (
						<div
							className={
								remainingTime > 30 || remainingTime === 0 ? 'value' : 'value danger'
							}>
							{minutes > 0 ? minutes + ':' : null}
							{minutes > 0 && secondes < 10 ? '0' + secondes : secondes}s
							<audio id='chrono' src={chronoURL} muted={props.mute} />
						</div>
					);
				}}
			</CountdownCircleTimer>
		</div>
	);
}

export default ProgressBar;
