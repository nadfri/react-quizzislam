import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import '../Signalement/Signalement.scss';

function Suggestion() {
	const [displaySuccess, setDisplaySuccess] = useState(false);
	const [displayForm, setDisplayForm] = useState(true);
	const [complement, setComplement] = useState('');
	const [email, setEmail] = useState('');

	const encode = (data) => {
		return Object.keys(data)
			.map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
			.join('&');
	};

	const handleSubmit = (e) => {
		const postUrl = '/?t=' + Math.floor(Date.now() / 1000); //permet d'avoir la reponse sur Netlify Form

		fetch(postUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: encode({
				'form-name': 'Signalement',
				complement,
				question: 'Suggestion',
				email,
			}),
		});

		e.preventDefault();
		setDisplayForm(false);
		setDisplaySuccess(true);
	};

	const close = () => {
		setDisplayForm(true);
		setDisplaySuccess(false);
	};

	return (
		<div className='Signalement'>
			<h1>Suggestion</h1>
			{displayForm && (
				<fieldset>
					<form onSubmit={handleSubmit}>
						<input type='hidden' name='form-name' value='Signalement' />

						<input
							type='email'
							name='email'
							placeholder='Email'
							required
							onChange={(e) => setEmail(e.target.value)}
						/>
						<textarea
							name='complement'
							placeholder='Une suggestion?...'
							rows='5'
							cols='33'
							onChange={(e) => setComplement(e.target.value)}
							required
						/>

						<button type='submit' className='blue'>
							Envoyer
						</button>
					</form>
				</fieldset>
			)}
			{displaySuccess && <Modal h1={'Message Envoyé'} close={close} />}
		</div>
	);
}

export default Suggestion;
