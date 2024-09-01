import React, { useState, useEffect, useCallback } from 'react';
import { db, fireTab } from '../../firebase';
import Loader from '../Loader/Loader';
import Modal from '../Modal/Modal';
import ScrollTop from '../ScrollTop/ScrollTop';
import FormEdit from './FormEdit';
import List from './List';
import ConfirmSupp from './ConfirmSupp';
import { FaSearch } from 'react-icons/fa';
import './ListQuestions.scss';
import { BASE_ID, DATABASE } from '../../utils/constants';

function ListQuestions() {
  //State Liste//
  const [questions, setQuestions] = useState([]);
  const [loader, setLoader] = useState(false);
  const [textSucces, setTextSucces] = useState('');
  const [displayModalSucces, setDisplayModalSucces] = useState(false);
  const [displayModalSupression, setDisplayModalSupression] = useState(false);
  const [displayModalForm, setDisplayModalForm] = useState(false);
  //State pour le filtre
  const [filtered, setFiltered] = useState([]);
  const [filtreTheme, setFiltreTheme] = useState('');
  const [filtreNiveau, setFiltreNiveau] = useState('');
  const [filtrePrivate, setFiltrePrivate] = useState('');
  const [filtreWord, setFiltreWord] = useState('');
  //State pour l'édition/suppression
  const [selection, setSelection] = useState(null);

  //Chargement de la base de donnée
  useEffect(() => {
    console.log('DATABASE', DATABASE);
    setLoader(true);
    
    db.collection(DATABASE)
      .doc(BASE_ID)
      .get()
      .then((doc) => {
        //console.table(doc.data().questions);
        const questions = doc.data().questions;

        questions.sort((a, b) => a.theme.localeCompare(b.theme));
        setQuestions(questions);
        setLoader(false);
      })
      .catch((err) => console.log(err));
  }, []);

  //Gestion de la suppression et l'édition par selection de la question en cours
  //CallBack pour eviter le render dans <List/>
  const handleDelete = useCallback((question) => {
    setSelection(question);
    setDisplayModalSupression(true);
  }, []);

  const handleEdit = useCallback((question) => {
    setSelection(question);
    setDisplayModalForm(true);
  }, []);

  const deleteQuestion = () => {
    setQuestions(questions.filter((question) => question.id !== selection.id));
    db.collection(DATABASE)
      .doc(BASE_ID)
      .update({ questions: fireTab.arrayRemove(selection) });

    setDisplayModalSupression(false);
    setTextSucces('Supprimé avec Succès');
    setDisplayModalSucces(true);
  };

  const handleSubmit = (e, editedQuest) => {
    e.preventDefault();

    const updatedQuestions = questions.map((question) =>
      question.id === selection.id ? editedQuest : question
    );
    setQuestions(updatedQuestions);

    // Suppression de la base de donnée
    db.collection(DATABASE)
      .doc(BASE_ID)
      .update({
        questions: fireTab.arrayRemove(selection),
      })
      .then(() =>
        db
          .collection(DATABASE)
          .doc(BASE_ID)
          .update({ questions: fireTab.arrayUnion(editedQuest) })
      );

    setDisplayModalForm(false);
    setTextSucces('Modifié avec Succès');
    setDisplayModalSucces(true);
  };

  useEffect(() => {
    const normalizeString = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const filterQuestions = () => {
      return questions.filter((question) => {
        const privateCopy = filtrePrivate === 'oui';

        const matchesTheme = filtreTheme === '' || question.theme === filtreTheme;
        const matchesNiveau = filtreNiveau === '' || question.niveau === filtreNiveau;
        const matchesPrivate = filtrePrivate === '' || question.private === privateCopy;
        const matchesWord =
          filtreWord.length <= 2 ||
          [question.question, question.info, ...question.choix]
            .map(normalizeString)
            .some((text) =>
              text.toLowerCase().includes(normalizeString(filtreWord).toLowerCase())
            );

        return matchesTheme && matchesNiveau && matchesPrivate && matchesWord;
      });
    };

    const filteredQuestions = filterQuestions();
    setFiltered(filteredQuestions);
  }, [questions, filtreTheme, filtreNiveau, filtrePrivate, filtreWord]);

  /*********************Rendu JSX*********************/
  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <div className='ListQuestion'>
          <ScrollTop />
          <h1>Liste des Questions</h1>

          {/* SearchBar */}
          <fieldset className='fieldset-filtre'>
            <legend>
              <FaSearch className='icon' /> Filtrer
            </legend>
            <select value={filtreTheme} onChange={(e) => setFiltreTheme(e.target.value)}>
              <option value=''>Choisir un Thème</option>
              <option value='compagnons'>Les Compagnons</option>
              <option value='coran'>Coran</option>
              <option value='culture'>Culture Générale</option>
              <option value='histoire'>Histoire</option>
              <option value='jurisprudence'>Jurisprudence</option>
              <option value='prophete'>Muhammad ﷺ</option>
              <option value='lesProphetes'>Les Prophètes</option>
              <option value='textes'>Textes en Islam</option>
            </select>

            <select
              value={filtreNiveau}
              onChange={(e) => setFiltreNiveau(e.target.value)}>
              <option value=''>Choisir un Niveau</option>
              <option value='1'>Débutant</option>
              <option value='2'>Intermédiaire</option>
              <option value='3'>Expert</option>
            </select>

            <select
              value={filtrePrivate}
              onChange={(e) => setFiltrePrivate(e.target.value)}>
              <option value=''>Caché?</option>
              <option value='oui'>Oui</option>
              <option value='non'>Non</option>
            </select>

            <input
              type='search'
              placeholder='Chercher un mot'
              value={filtreWord}
              onChange={(e) => setFiltreWord(e.target.value)}
            />

            <span className='nb-question'>
              {filtered.length}/{questions.length}
            </span>
          </fieldset>

          {/* Liste des Questions */}
          <List filtered={filtered} handleDelete={handleDelete} handleEdit={handleEdit} />

          {/* Formulaire */}
          {displayModalForm && (
            <FormEdit
              question={selection}
              setDisplayModalForm={() => setDisplayModalForm(false)}
              handleSubmit={handleSubmit}
            />
          )}

          {/* Affichage du modal confirmation d'edition */}
          {displayModalSucces && (
            <Modal h1={textSucces} close={() => setDisplayModalSucces(false)} />
          )}

          {/* Affichage du modal confirmation de suppression */}
          {displayModalSupression && (
            <ConfirmSupp
              deleteQuestion={deleteQuestion}
              close={() => setDisplayModalSupression(false)}
            />
          )}
        </div>
      )}
    </>
  );
}

export default ListQuestions;
