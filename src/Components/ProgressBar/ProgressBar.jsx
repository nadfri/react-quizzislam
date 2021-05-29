import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import './ProgressBar.scss';

function ProgressBar(props) {
	return (
		<div className='ProgressBar'>
			<CountdownCircleTimer
				isPlaying
				duration={props.duree}
				colors={[['#1dfd94', 0.5], ['#FFFF00', 0.5], ['#FF0000']]}
				size={130}
				strokeWidth={12}
				trailColor='#00000000'
				// onComplete={() => console.log('OVER')}
				>
				{({ remainingTime }) => {
					const minutes = Math.floor(remainingTime / 60);
					const secondes = remainingTime % 60;

					return (
						<div
							className={
								remainingTime > 30 || remainingTime === 0 ? 'value' : 'value danger'
							}>
							{minutes > 0 ? minutes + ':' : null}
							{minutes > 0 && secondes < 10 ? '0' + secondes : secondes}s
						</div>
					);
				}}
			</CountdownCircleTimer>
		</div>
	);
}

export default ProgressBar;
