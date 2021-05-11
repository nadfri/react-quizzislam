import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import './FormError.scss';

function FormError(props) {
	const [displaySuccess, setDisplaySuccess] = useState(false);
	const [displayForm, setDisplayForm] = useState(true);
	const [erreur, setErreur] = useState('');
	const [texte, setTexte] = useState('');

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
				'form-name': 'Signalement',
				erreur,
				texte,
				question: props.question.question,
				id: props.question.id,
			}),
		})
			.then((res) => {
				alert('Success!');
				console.log(res);
			})
			.catch((error) => alert(error));

		e.preventDefault();
		setDisplayForm(false);
		setDisplaySuccess(true);
	};

	return (
		<div className='FormError'>
			{displayForm && (
				<fieldset>
					<legend>Soumettre une erreur</legend>
					{/* <form name='contact' method='post' onSubmit={handleSubmit} data-netlify='true'>
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
					</form> */}
					<form onSubmit={handleSubmit}>
						<select value={erreur} onChange={(e) => setErreur(e.target.value)} required name="select">
							<option value=''>Choisir une erreur</option>
							<option value='reponse'>Réponse fausse</option>
							<option value='orthographe'>Orthographe</option>
							<option value='forumation'>Question mal formulée</option>
							<option value='infomartion'>Information érronée</option>
							<option value='autre'>Autre</option>
						</select>

						<textarea
							name='message'
							value={texte}
							onChange={(e) => setTexte(e.target.value)}
						/>

						<p>
							<button type='submit'>Send</button>
						</p>
					</form>
				</fieldset>
			)}
			{displaySuccess && <Modal h1={'Message Envoyé'} close={props.closeForm} />}
		</div>
	);
}

export default FormError;
