import React, { useState, useEffect } from 'react';
import { db, fireTab } from '../../firebase';
import Loader from '../Loader/Loader';
import Modal from '../Modal/Modal';
import './ListQuestions.scss';

function ListQuestions(props) {
	const baseID = 'hz2fK3KpYDlCG7af12t9';
	const tabNiveau = ['', 'Débutant', 'Intermédiaire', 'Expert'];

	//State Liste//
	const [questions, setQuestions] = useState([]);
	const [loader, setLoader] = useState(false);
	const [textSucces, setTextSucces] = useState('');
	const [displayModalSucces, setDisplayModalSucces] = useState(false);
	const [displayModalSupression, setDisplayModalSupression] = useState(false);
	const [displayModalForm, setDisplayModalForm] = useState(false);
	//State pour le filtre
	const [filtreTheme, setFiltreTheme] = useState('');
	const [filtreNiveau, setFiltreNiveau] = useState('');
	const [filtrePrivate, setFiltrePrivate] = useState('');
	const [filtered, setFiltered] = useState([]);
	const [filtreWord, setFiltreWord] = useState('');
	//State pour l'édition
	const [selectedQuestion, setSelectedQuestion] = useState({});
	const [theme, setTheme] = useState('');
	const [niveau, setNiveau] = useState('1');
	const [_private, setPrivate] = useState(false);
	const [question, setQuestion] = useState('');
	const [choix, setChoix] = useState(['', '', '', '']);
	const [reponse, setReponse] = useState('');
	const [info, setInfo] = useState('');

	//Chargement de la base de donnée
	useEffect(() => {
		setLoader(true);
		db.collection('dataBase')
			.doc(baseID)
			.get()
			.then((doc) => {
				setLoader(false);
				//console.log(doc.data().questions);
				setQuestions(doc.data().questions.sort((a, b) => a.id - b.id));
				setFiltered(doc.data().questions.sort((a, b) => a.id - b.id));
			})
			.catch((err) => console.log(err));
	}, []);

	//Gestion du Filtre
	useEffect(() => {
		let finalFilter = [...questions];
		const privateCopy = filtrePrivate === 'oui' ? true : false; //conversion string en boolean

		if (filtreTheme !== '')
			finalFilter = finalFilter.filter((question) => question.theme === filtreTheme);

		if (filtreNiveau !== '')
			finalFilter = finalFilter.filter((question) => question.niveau === filtreNiveau);

		if (filtrePrivate !== '')
			finalFilter = finalFilter.filter((question) => question.private === privateCopy);
		
		if (filtreWord.length > 2)
			finalFilter = finalFilter.filter((question) => question.question.toLowerCase().includes(filtreWord.toLowerCase()));

		setFiltered(finalFilter);
	}, [filtreTheme, filtreNiveau, filtrePrivate, filtreWord, questions]);

	//Gestion de la suppression et l'édition
	const handleDelete = (question) => {
		setSelectedQuestion(question);
		setDisplayModalSupression(true);
	};

	const deleteQuestion = (question) => {
		const copyQuestions = [...questions].filter((quest) => quest.id !== question.id);
		setQuestions(copyQuestions);

		db.collection('dataBase')
			.doc(baseID)
			.update({ questions: fireTab.arrayRemove(question) });
		setDisplayModalSupression(false);
		setTextSucces('Supprimé avec Succès');
		setDisplayModalSucces(true);
	};

	const editQuestion = (question) => {
		setTheme(question.theme);
		setNiveau(question.niveau);
		setPrivate(question.private);
		setQuestion(question.question);
		setChoix(question.choix);
		setReponse(question.reponse);
		setInfo(question.info);
		setSelectedQuestion(question);
		setDisplayModalForm(true);
	};

	//Gestion du Formulaire
	const handleChoix = (value, id) => {
		const conversion = { choix1: 0, choix2: 1, choix3: 2, choix4: 3 };
		const copyChoix = [...choix];
		const index = conversion[id];
		copyChoix[index] = value.replace('sws', 'ﷺ');
		setChoix(copyChoix);
	};

	const handlePrivate = (value) =>
		value === 'true' ? setPrivate(true) : setPrivate(false);

	//Soumission du Formulaire Edition
	const handleSubmit = (e) => {
		e.preventDefault();

		//Suppression de la base de donnée
		db.collection('dataBase')
			.doc(baseID)
			.update({ questions: fireTab.arrayRemove(selectedQuestion) });

		//Supprresion du State
		let copyQuestions = [...questions];
		copyQuestions = copyQuestions.filter((quest) => quest.id !== selectedQuestion.id);

		//Ajout de l'entrée modifiée dans le State
		const edited = {
			id: selectedQuestion.id,
			theme,
			niveau,
			private: _private,
			question,
			choix,
			reponse,
			info,
		};

		copyQuestions.push(edited);
		setQuestions(copyQuestions);

		//Ajout dans la base de donnée
		db.collection('dataBase')
			.doc(baseID)
			.update({ questions: fireTab.arrayUnion(edited) });

		setDisplayModalForm(false);
		setTextSucces('Modifié avec Succès');
		setDisplayModalSucces(true);
	};

	/*********************Rendu JSX*********************/
	return (
		<div className='ListQuestion'>
			{loader && <Loader />}
			<h1>Liste des Questions</h1>

			<fieldset className='fieldset-filtre'>
				<legend>
					<i className='fas fa-search'></i> Filtrer
				</legend>
				<select value={filtreTheme} onChange={(e) => setFiltreTheme(e.target.value)}>
					<option value=''>Choisir un Thème</option>
					<option value='coran'>Coran</option>
					<option value='histoire'>Histoire</option>
					<option value='prophete'>Muhammad ﷺ</option>
					<option value='lesProphetes'>Les Prophètes</option>
					<option value='jurisprudence'>Jurisprudence</option>
					<option value='textes'>Textes en Islam</option>
					<option value='compagnons'>Les Compagnons</option>
					<option value='culture'>Culture Générale</option>
				</select>

				<select value={filtreNiveau} onChange={(e) => setFiltreNiveau(e.target.value)}>
					<option value=''>Choisir un Niveau</option>
					<option value='1'>Débutant</option>
					<option value='2'>Intermédiaire</option>
					<option value='3'>Expert</option>
				</select>

				<select value={filtrePrivate} onChange={(e) => setFiltrePrivate(e.target.value)}>
					<option value=''>Caché?</option>
					<option value='oui'>Oui</option>
					<option value='non'>Non</option>
				</select>

				<input type="search" placeholder="Chercher un mot" value={filtreWord} onChange={e=>setFiltreWord(e.target.value)}/>

				<span className='nb-question'>
					{filtered.length}/{questions.length}
				</span>

			</fieldset>

			{filtered.map((question) => (
				<fieldset key={question.id}>
					<legend>Question #{question.id}</legend>
					<ul>
						<li>
							<b>Thème: </b>
							{question.theme}
						</li>
						<li>
							<b>Caché: </b>
							{question.private ? 'Oui' : 'Non'}
						</li>
						<li>
							<b>Niveau: </b>
							{tabNiveau[question.niveau]}
						</li>
						<li>
							<b>Question: </b>
							{question.question}
						</li>
						<li>
							<ul>
								<b>Choix</b>
								{question.choix.map((choice, index) => (
									<li key={index}>{choice}</li>
								))}
							</ul>
						</li>
						<li>
							<b>Réponse: </b>
							{question.reponse}
						</li>
						<li>
							<b>Explication: </b>
							{question.info}
						</li>
					</ul>

					<div className='container-icons'>
						<div className='icons' onClick={() => editQuestion(question)}>
							<i className='fas fa-edit'></i>
						</div>
						<div className='icons' onClick={() => handleDelete(question)}>
							<i className='fas fa-trash-alt'></i>
						</div>
					</div>
				</fieldset>
			))}

			{displayModalSucces && (
				<Modal h1={textSucces} close={() => setDisplayModalSucces(false)} />
			)}

			{displayModalSupression && (
				<div className='Modal'>
					<div className='box'>
						<h1>Confirmer la Suppression de la Question #{selectedQuestion.id}</h1>

						<button className='red' onClick={() => deleteQuestion(selectedQuestion)}>
							Supprimer
						</button>
						<button onClick={() => setDisplayModalSupression(false)}>Annuler</button>
					</div>
				</div>
			)}

			{displayModalForm && (
				<div className='form-container'>
					<form className='form' onSubmit={handleSubmit}>
						<h1>Editer la Question #{selectedQuestion.id}</h1>
						<fieldset>
							<legend>Thème*</legend>
							<select value={theme} onChange={(e) => setTheme(e.target.value)} required>
								<option value=''>Choisir un Thème</option>
								<option value='coran'>Coran</option>
								<option value='histoire'>Histoire</option>
								<option value='prophete'>Muhammad ﷺ</option>
								<option value='lesProphetes'>Les Prophètes</option>
								<option value='jurisprudence'>Jurisprudence</option>
								<option value='textes'>Textes en Islam</option>
								<option value='compagnons'>Les Compagnons</option>
								<option value='culture'>Culture Générale</option>
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
									name='private'
									value={false}
									checked={_private === false}
									onChange={(e) => handlePrivate(e.target.value)}
									required
								/>
								<label htmlFor='non'>Non</label>
							</span>
							<span className='radio large'>
								<input
									type='radio'
									id='oui'
									name='private'
									value={true}
									checked={_private === true}
									onChange={(e) => handlePrivate(e.target.value)}
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
						<div className='container-button'>
							<button type='submit'>Modifier</button>
							<button
								className='gray'
								type='button'
								onClick={() => setDisplayModalForm(false)}>
								Annuler
							</button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
}

export default ListQuestions;
