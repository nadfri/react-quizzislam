import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

export default function ListQuestions() {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isDeletionModalVisible, setIsDeletionModalVisible] = useState(false);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  
  const [filters, setFilters] = useState({
    theme: '',
    level: '',
    isPrivate: '',
    keyword: '',
  });
  
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    
    db.collection(DATABASE)
      .doc(BASE_ID)
      .get()
      .then((doc) => {
        const sortedQuestions = doc.data().questions.sort((a, b) => a.theme.localeCompare(b.theme));
        setQuestions(sortedQuestions);
        setIsLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = useCallback((question) => {
    setSelectedQuestion(question);
    setIsDeletionModalVisible(true);
  }, []);

  const handleEdit = useCallback((question) => {
    setSelectedQuestion(question);
    setIsFormModalVisible(true);
  }, []);

  const deleteQuestion = () => {
    setQuestions(questions.filter((question) => question.id !== selectedQuestion.id));
    db.collection(DATABASE)
      .doc(BASE_ID)
      .update({ questions: fireTab.arrayRemove(selectedQuestion) });

    setIsDeletionModalVisible(false);
    setSuccessMessage('Supprimé avec Succès');
  };

  const handleSubmit = (e, editedQuestion) => {
    e.preventDefault();

    const updatedQuestions = questions.map((question) =>
      question.id === selectedQuestion.id ? editedQuestion : question
    );
    setQuestions(updatedQuestions);

    db.collection(DATABASE)
      .doc(BASE_ID)
      .update({
        questions: fireTab.arrayRemove(selectedQuestion),
      })
      .then(() =>
        db
          .collection(DATABASE)
          .doc(BASE_ID)
          .update({ questions: fireTab.arrayUnion(editedQuestion) })
      );

    setIsFormModalVisible(false);
    setSuccessMessage('Modifié avec Succès');
    setIsSuccessModalVisible(true);
  };



  const normalizeString = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const { theme, level, isPrivate, keyword } = filters;
      const privateCopy = isPrivate === 'oui';

      const matchesTheme = theme === '' || question.theme === theme;
      const matchesLevel = level === '' || question.niveau === level;
      const matchesPrivate = isPrivate === '' || question.private === privateCopy;
      const matchesKeyword =
        keyword.length <= 2 ||
        [question.question, question.info, ...question.choix]
          .map(normalizeString)
          .some((text) =>
            text.toLowerCase().includes(normalizeString(keyword).toLowerCase())
          );

      return matchesTheme && matchesLevel && matchesPrivate && matchesKeyword;
    });
  }, [questions, filters]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [filterName]: value }));
  };

  /*********************Rendu JSX*********************/
  return (
    <>
      {isLoading ? (
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
            <select 
              value={filters.theme} 
              onChange={(e) => handleFilterChange('theme', e.target.value)}
            >
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
              value={filters.level}
              onChange={(e) => handleFilterChange('level', e.target.value)}
            >
              <option value=''>Choisir un Niveau</option>
              <option value='1'>Débutant</option>
              <option value='2'>Intermédiaire</option>
              <option value='3'>Expert</option>
            </select>

            <select
              value={filters.isPrivate}
              onChange={(e) => handleFilterChange('isPrivate', e.target.value)}
            >
              <option value=''>Caché?</option>
              <option value='oui'>Oui</option>
              <option value='non'>Non</option>
            </select>

            <input
              type='search'
              placeholder='Chercher un mot'
              value={filters.keyword}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
            />

            <span className='nb-question'>
              {filteredQuestions.length}/{questions.length}
            </span>
          </fieldset>

          <List 
            filtered={filteredQuestions} 
            handleDelete={handleDelete} 
            handleEdit={handleEdit} 
          />

          {isFormModalVisible && (
            <FormEdit
              question={selectedQuestion}
              setDisplayModalForm={() => setIsFormModalVisible(false)}
              handleSubmit={handleSubmit}
            />
          )}

          {isSuccessModalVisible && (
            <Modal 
              h1={successMessage} 
              close={() => setIsSuccessModalVisible(false)} 
            />
          )}

          {isDeletionModalVisible && (
            <ConfirmSupp
              deleteQuestion={deleteQuestion}
              close={() => setIsDeletionModalVisible(false)}
            />
          )}
        </div>
      )}
    </>
  );
}