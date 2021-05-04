import React, { useState, useEffect } from 'react';
import Loader from './../Loader/Loader';
import { db, fireTab } from '../../firebase';
import './Config.scss';
import Modal from '../Modal/Modal';
import { Link } from 'react-router-dom';

function Config() {
	const baseID = 'hz2fK3KpYDlCG7af12t9';

	//State
	const [questions, setQuestions] = useState([]);
	const [theme, setTheme] = useState('');
	const [niveau, setNiveau] = useState('1');
	const [competition, setCompetition] = useState(false);
	const [question, setQuestion] = useState('');
	const [choix, setChoix] = useState(['', '', '', '']);
	const [reponse, setReponse] = useState('');
	const [info, setInfo] = useState('');
	const [loader, setLoader] = useState(false);
	const [displayModal, setDisplayModal] = useState(false);

	//Chargement de la base de donnée
	useEffect(() => {
		setLoader(true);
		db.collection('dataBase')
			.doc(baseID)
			.get()
			.then((doc) => {
				setLoader(false);
				console.log(doc.data().questions);
				setQuestions(doc.data().questions);
				//localStorage.setItem('questions', JSON.stringify(doc.data().questions));
			})
			.catch((err) => console.log(err));
	}, []);

	//Gestion du Formulaire
	const handleChoix = (value, id) => {
		const conversion = { choix1: 0, choix2: 1, choix3: 2, choix4: 3 };
		const copyChoix = [...choix];
		const index = conversion[id];
		copyChoix[index] = value.replace('sws', 'ﷺ');
		setChoix(copyChoix);
	};

	const handleCompetition = (value) =>
		value === 'true' ? setCompetition(true) : setCompetition(false);

	//const updateDB = () => db.collection('dataBase').doc(baseID).set({ dataBase });
	//Soumission du Formulaire
	const handleSubmit = (e) => {
		e.preventDefault();

		const newQuestion = {
			id: questions.length,
			theme,
			niveau,
			private: competition,
			question,
			choix,
			reponse,
			info,
		};

		const copy = [...questions, newQuestion];
		setQuestions(copy);

		db.collection('dataBase')
			.doc(baseID)
			.update({ questions: fireTab.arrayUnion(newQuestion) });

		setDisplayModal(true);

		setTheme('');
		setNiveau('');
		setCompetition(false);
		setQuestion('');
		setChoix(['', '', '', '']);
		setReponse('');
		setInfo('');
	};

	/********************Rendu JSX********************/
	return (
		<div className='Config'>
			{loader && <Loader />}
			<h1>Configuration</h1>

			<form onSubmit={handleSubmit} className='form'>
				<fieldset>
					<legend>Thème*</legend>
					<select value={theme} onChange={(e) => setTheme(e.target.value)} required>
						<option value=''>Choisir un Thème</option>
						<option value='coran'>Coran</option>
						<option value='histoire'>Histoire</option>
						<option value='jurisprudence'>Jurisprudence</option>
						<option value='lesProphetes'>Les Prophètes</option>
						<option value='prophete'>Prophète ﷺ</option>
						<option value='compagnons'>Les Compagnons</option>
						<option value='textes'>Textes En Islam</option>
					</select>
				</fieldset>
				<fieldset>
					<legend>Niveau*</legend>

					<span className='radio'>
						<input
							type='radio'
							id='debutant'
							name='niveau'
							value='1'
							checked={niveau === '1'}
							onChange={(e) => setNiveau(e.target.value)}
							required
						/>
						<label htmlFor='debutant'>Débutant</label>
					</span>
					<span className='radio '>
						<input
							type='radio'
							id='intermediaire'
							name='niveau'
							value='2'
							checked={niveau === '2'}
							onChange={(e) => setNiveau(e.target.value)}
						/>
						<label htmlFor='intermediaire'>Intermédiaire</label>
					</span>
					<span className='radio'>
						<input
							type='radio'
							id='expert'
							name='niveau'
							value='3'
							checked={niveau === '3'}
							onChange={(e) => setNiveau(e.target.value)}
						/>
						<label htmlFor='expert'>Expert</label>
					</span>
				</fieldset>

				<fieldset>
					<legend>Uniquement en Compétition*</legend>
					<span className='radio large'>
						<input
							type='radio'
							id='non'
							name='competition'
							value={false}
							checked={competition === false}
							onChange={(e) => handleCompetition(e.target.value)}
							required
						/>
						<label htmlFor='non'>Non</label>
					</span>
					<span className='radio large'>
						<input
							type='radio'
							id='oui'
							name='competition'
							value={true}
							checked={competition === true}
							onChange={(e) => handleCompetition(e.target.value)}
						/>
						<label htmlFor='oui'>Oui</label>
					</span>
				</fieldset>

				<fieldset>
					<legend>Question*</legend>
					<input
						type='text'
						value={question}
						onChange={(e) => setQuestion(e.target.value.replace('sws', 'ﷺ'))}
						placeholder='Ecrire ici la question'
						required
					/>
				</fieldset>

				<fieldset className='column'>
					<legend>Choix</legend>
					<input
						type='text'
						id='choix1'
						value={choix[0]}
						onChange={(e) => handleChoix(e.target.value, e.target.id)}
						required
						placeholder='Choix 1*'
					/>

					<input
						type='text'
						id='choix2'
						value={choix[1]}
						onChange={(e) => handleChoix(e.target.value, e.target.id)}
						required
						placeholder='Choix 2*'
					/>

					<input
						type='text'
						id='choix3'
						value={choix[2]}
						onChange={(e) => handleChoix(e.target.value, e.target.id)}
						placeholder='Choix 3'
					/>
					<input
						type='text'
						id='choix4'
						value={choix[3]}
						onChange={(e) => handleChoix(e.target.value, e.target.id)}
						placeholder='Choix 4'
					/>
				</fieldset>
				<fieldset>
					<legend>Bonne Réponse*</legend>

					<span className='radio medium'>
						<input
							type='radio'
							id='rep1'
							name='reponse'
							value='1'
							checked={reponse === '1'}
							onChange={(e) => setReponse(e.target.value)}
							required
						/>
						<label htmlFor='rep1'>#1</label>
					</span>

					<span className='radio medium'>
						<input
							type='radio'
							id='rep2'
							name='reponse'
							value='2'
							checked={reponse === '2'}
							onChange={(e) => setReponse(e.target.value)}
						/>
						<label htmlFor='rep2'>#2</label>
					</span>

					<span className='radio medium'>
						<input
							type='radio'
							id='rep3'
							name='reponse'
							value='3'
							checked={reponse === '3'}
							onChange={(e) => setReponse(e.target.value)}
						/>
						<label htmlFor='rep3'>#3</label>
					</span>

					<span className='radio medium'>
						<input
							type='radio'
							id='rep4'
							name='reponse'
							value='4'
							checked={reponse === '4'}
							onChange={(e) => setReponse(e.target.value)}
						/>
						<label htmlFor='rep4'>#4</label>
					</span>
				</fieldset>

				<fieldset>
					<legend>Explication</legend>
					<input
						type='text'
						value={info}
						onChange={(e) => setInfo(e.target.value.replace('sws', 'ﷺ'))}
						placeholder="Complément d'information sur la réponse"
					/>
				</fieldset>

				<button type='submit'>Ajouter</button>
			</form>

			<Link to='/config/list'>Voir la Liste des Questions</Link>

			

			{displayModal && (
				<Modal h1='Ajouter avec Succès' close={() => setDisplayModal(false)} />
			)}
		</div>
	);
}

export default Config;