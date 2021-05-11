import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import './FormError.scss';

function FormError(props) {
	const [displaySuccess, setDisplaySuccess] = useState(false);
	const [displayForm, setDisplayForm] = useState(true);

	const handleSubmit = (e) => {
		e.preventDefault();
		setDisplayForm(false);
		setDisplaySuccess(true);
	};

	return (
		<div className='FormError'>
			{displayForm && (
				<fieldset>
					<legend>Soumettre une erreur</legend>
					<form name='contact' method='post' onSubmit={handleSubmit} data-netlify='true'>
						<input type='hidden' name='form-name' value='contact' />
						<input type='hidden' name='contact' value={props.question.id} />
						<input type='hidden' name='question' value={props.question.question} />

						<select required name='select'>
							<option value=''>Choisir une erreur</option>
							<option value='reponse'>Réponse fausse</option>
							<option value='orthographe'>Orthographe</option>
							<option value='forumation'>Question mal formulée</option>
							<option value='infomartion'>Information érronée</option>
							<option value='autre'>Autre</option>
						</select>

						<textarea
							name='message'
							placeholder="Complément d'information..."
							rows='5'
							cols='33'
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
