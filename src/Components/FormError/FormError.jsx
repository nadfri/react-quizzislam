import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import './FormError.scss';

function FormError(props) {
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
		fetch('/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: encode({
				'form-name': 'signalement2',
				erreur,
				question: props.question.question,
				id: props.question.id,
				complement,
			}),
		});

		e.preventDefault();
		setDisplayForm(false);
		setDisplaySuccess(true);
	};

	return (
		<div className='FormError'>
			{displayForm && (
				<fieldset>
					<legend>Soumettre une erreur</legend>

					<form onSubmit={handleSubmit} action='/thank-you/' data-netlify='true'>
						<input type='hidden' name='form-name' value='signalement2' />

						<select required name='erreur' onChange={(e) => setErreur(e.target.value)}>
							<option value=''>Choisir une erreur</option>
							<option value='reponse'>Réponse fausse</option>
							<option value='orthographe'>Orthographe</option>
							<option value='forumation'>Question mal formulée</option>
							<option value='infomartion'>Information érronée</option>
							<option value='autre'>Autre</option>
						</select>

						<textarea
							name='complement'
							placeholder="Complément d'information..."
							rows='5'
							cols='33'
							onChange={(e) => setComplement(e.target.value)}
						/>

						<button type='submit' className='blue'>
							Envoyer
						</button>
						<button type='button' className='tomato' onClick={props.closeForm}>
							Annuler
						</button>
					</form>
				</fieldset>
			)}
			{displaySuccess && <Modal h1={'Message Envoyé'} close={props.closeForm} />}
		</div>
	);
}

export default FormError;
