import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import './Signalement.scss';

function Signalement() {
	const [displaySuccess, setDisplaySuccess] = useState(false);
	const [displayForm, setDisplayForm] = useState(true);
	const [erreur, setErreur] = useState('');
	const [complement, setComplement] = useState('');

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
			body: encode({ 'form-name': 'Signalement', erreur, complement }),
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
			<h1>Signaler une Erreur</h1>
			{displayForm && (
				<fieldset>
					<form onSubmit={handleSubmit}>
						<input type='hidden' name='form-name' value='Signalement' />

						<select required name='erreur' onChange={(e) => setErreur(e.target.value)}>
							<option value=''>Choisir une erreur</option>
							<option value='Reponse'>Réponse fausse</option>
							<option value='Orthographe'>Orthographe</option>
							<option value='Forumation'>Question mal formulée</option>
							<option value='Infomartion'>Information érronée</option>
							<option value='Autre'>Autre Raison</option>
						</select>

						<textarea
							name='complement'
							placeholder="Décrivez l'erreur..."
							rows='5'
							cols='33'
							onChange={(e) => setComplement(e.target.value)}
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

export default Signalement;
