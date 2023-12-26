import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import Modal from '../Modal/Modal';
import Loader from '../Loader/Loader';

export default function Proposition() {
  const form = useRef();

  const config = {
    SERVICE: process.env.REACT_APP_EMAILJS_SERVICE_ID,
    TEMPLATE: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
    PUBLIC_KEY: process.env.REACT_APP_EMAILJS_PUBLIC_KEY_ID,
  };

  const [displayModal, setDisplayModal] = useState(false);
  const [modalText, setModalText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    emailjs
      .sendForm(config.SERVICE, config.TEMPLATE, form.current, config.PUBLIC_KEY)
      .then(
        () => {
          setIsLoading(false);
          setDisplayModal(true);
          setModalText('Envoyé avec Succès');
          form.current.reset();
        },
        (error) => {
          console.error(error.text);
          setIsLoading(false);
          setDisplayModal(true);
          setModalText("Echec de l'envoi, veuillez réessayer plus tard");
        }
      );
  };

  return (
    <div className='AjoutQuestions'>
      <h1>Proposer une Question</h1>

      <form onSubmit={handleSubmit} className='form' ref={form}>
        <fieldset>
          <legend>Email*</legend>
          <input
            type='text'
            name='email'
            placeholder='Votre email'
            pattern="[A-Za-z0-9._+\-']+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}"
            required
          />
        </fieldset>

        <fieldset>
          <legend>Thème*</legend>
          <select name='theme' required>
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
            <input type='radio' id='debutant' name='niveau' value='1' required />
            <label htmlFor='debutant'>Débutant</label>
          </span>
          <span className='radio '>
            <input type='radio' id='intermediaire' name='niveau' value='2' />
            <label htmlFor='intermediaire'>Intermédiaire</label>
          </span>
          <span className='radio'>
            <input type='radio' id='expert' name='niveau' value='3' />
            <label htmlFor='expert'>Expert</label>
          </span>
        </fieldset>

        <fieldset>
          <legend>Question*</legend>
          <textarea
            rows='3'
            name='question'
            placeholder='Votre question, attention aux fautes d’orthographe...'
            maxLength={300}
            required
            spellCheck='true'
          />
        </fieldset>

        <fieldset className='column'>
          <legend>Choix</legend>
          <input type='text' id='choix1' name='choix1' required placeholder='Choix 1*' />

          <input type='text' id='choix2' name='choix2' required placeholder='Choix 2*' />

          <input type='text' id='choix3' name='choix3' placeholder='Choix 3' />

          <input type='text' id='choix4' name='choix4' placeholder='Choix 4' />
        </fieldset>
        <fieldset>
          <legend>Bonne Réponse*</legend>

          <span className='radio medium'>
            <input type='radio' id='rep1' name='reponse' value='1' required />
            <label htmlFor='rep1'>#1</label>
          </span>

          <span className='radio medium'>
            <input type='radio' id='rep2' name='reponse' value='2' />
            <label htmlFor='rep2'>#2</label>
          </span>

          <span className='radio medium'>
            <input type='radio' id='rep3' name='reponse' value='3' />
            <label htmlFor='rep3'>#3</label>
          </span>

          <span className='radio medium'>
            <input type='radio' id='rep4' name='reponse' value='4' />
            <label htmlFor='rep4'>#4</label>
          </span>
        </fieldset>

        <fieldset>
          <legend>Explication*</legend>
          <textarea
            rows='3'
            name='explication'
            placeholder='Explication succinte avec uniquement des sources authentiques et vérifiables...'
            maxLength={300}
            required
            spellCheck='true'
          />
        </fieldset>

        <button type='submit' disabled={isLoading}>
          Proposer
        </button>
      </form>

      {isLoading && <Loader />}

      {displayModal && <Modal h1={modalText} close={() => setDisplayModal(false)} />}
    </div>
  );
}
