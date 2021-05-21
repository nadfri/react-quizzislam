import React, { useState } from 'react';
import './Connexion.scss';
import { Link } from 'react-router-dom';
import fire from "../../../firebase"

function Connexion(props) {
	//State
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	/******************LOGIN******************/
	function submitHandler(e) {
		e.preventDefault();

		fire
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then((res) => { props.history.goBack();
			})
			.catch((error) => setError(error.message));
	}

	/********************Rendu JSX********************/
	return (
		<div className='logBox'>
			<h1>Connexion</h1>
			<form onSubmit={submitHandler} className='form'>
				{error !== '' && <div className='alert'>{error}</div>}
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
				<label>
					Mot de Passe: <br />
					<input
						type='password'
						placeholder='Mot de Passe'
						minLength='6'
						autoComplete='current-password'
						required
						onChange={(e) => setPassword(e.target.value)}
					/>
				</label>

				<button type='submit'>Se Connecter</button>
				
					<Link to='/settings/forget' className='forget'>
						Mot de Passe oublié?
					</Link>
				
			</form>
		</div>
	);
}

export default Connexion;
