import React, { useState, useEffect } from 'react';
import './PwaButton.scss';

function PwaButton() {
	//State
	const [supportsPWA, setSupportsPWA] = useState(false);
	const [promptInstall, setPromptInstall] = useState(null);

	useEffect(() => {
		const handler = (event) => {
			event.preventDefault();
			console.log('PWA:Installation Possible...');
			setTimeout(() => {
				setSupportsPWA(true);
				setPromptInstall(event);
			}, 300);

			setTimeout(() => setSupportsPWA(false), 5000);
		};

		window.addEventListener('beforeinstallprompt', handler);

		return () => window.removeEventListener('beforeinstallprompt', handler);
	}, []);

	const click = () => promptInstall.prompt();

	return (
		<div className={supportsPWA ? 'PwaButton slide' : 'PwaButton'} onClick={click}>
			Cliquez ici pour Installer l'App 👍
		</div>
	);
}

export default PwaButton;
