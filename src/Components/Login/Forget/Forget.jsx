import React, { useState } from 'react';
import '../Connexion/Connexion.scss';
import fire from '../../../firebase';
import { Link } from 'react-router-dom';

function Forget(props) {
	//State
	const [email, setEmail] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	/******************LOGIN******************/
	function submitHandler(e) {
		e.preventDefault();

		fire
			.auth()
			.sendPasswordResetEmail(email)
			.then((res) => {
				setSuccess("Cliquez sur le lien de l'email envoyé");
				setTimeout(() => props.history.push('/connexion'), 5000);
			})
			.catch((error) => setError(error.message));
	}

	return (
		<div className='logBox'>
			<h1>Réinitialiser</h1>
			<form onSubmit={submitHandler} className='form'>
				{error !== '' && <div className='alert'>{error}</div>}
				{success !== '' && <div className='success'>{success}</div>}
				<label>
					Email:
					<br />
					<input
						type='email'
						placeholder='Email'
						required
						autoComplete='username'
						onChange={(e) => setEmail(e.target.value)}
					/>
				</label>

				<button type='submit'>Récuperer</button>
				<div className='deja-container'>
					<Link to='/connexion' className='deja'>
						Se Connecter?
					</Link>
				</div>
			</form>
		</div>
	);
}

export default Forget;
