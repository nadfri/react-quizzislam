import './Quizz.scss';
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase';

import Loader from '../Loader/Loader';
import Notes from '../Notes/Notes';
import Speaker from '../Speaker/Speaker';
import FormError from '../FormError/FormError';

import backHist from '../../Backgrounds/background2.webp';
import backMoh from '../../Backgrounds/background3.webp';
import backComp from '../../Backgrounds/background5.webp';
import backCult from '../../Backgrounds/background7.webp';
import backJuri from '../../Backgrounds/background8.webp';
import backProph from '../../Backgrounds/background9.webp';
import backCoran from '../../Backgrounds/background10.webp';
import backText from '../../Backgrounds/background11.webp';

import correctURL from '../../Sounds/correct.mp3';
import incorrectURL from '../../Sounds/incorrect.mp3';
import { DB_ID, DATABASE } from '../../utils/constants';
import { randomize } from '../../utils/randomize';

function Quizz(props) {
  /*DOM*/
  const btns = document.querySelectorAll('button');
  const interfaceDiv = document.querySelector('.interfaceDiv');
  const skew = document.querySelector('.skew');

  /*AUDIO*/
  const muteStorage = JSON.parse(localStorage.getItem('mute')) || false;
  const correct = new Audio(correctURL);
  const incorrect = new Audio(incorrectURL);
  const audios = [correct, incorrect];

  /*DATAS*/
  const theme = props.match.params.theme;
  const niveau = props.match.params.niveau > 4 ? '4' : props.match.params.niveau;
  const background = {
    coran: backCoran,
    prophete: backMoh,
    lesProphetes: backProph,
    compagnons: backComp,
    histoire: backHist,
    textes: backText,
    culture: backCult,
    jurisprudence: backJuri,
  };
  const conversion = {
    1: 'Débutant',
    2: 'Intermédiaire',
    3: 'Expert',
    prophete: 'Muhammad ﷺ ',
    coran: 'Coran',
    histoire: 'Histoire',
    lesProphetes: 'Prophètes',
    jurisprudence: 'Jurisprudence',
    textes: 'Textes',
    compagnons: 'Compagnons',
    culture: 'Culture',
  };

  /***STATE HOOKS***/
  const [state, setState] = useState([{ choix: [] }]);
  const [countQuestion, setcountQuestion] = useState(0);
  const [maxQuestions, setMaxQuestions] = useState(20);
  const [score, setScore] = useState(0);
  const [choice, setChoice] = useState(null);
  const [loader, setLoader] = useState(false);
  const [diplayBtnValider, setdiplayBtnValider] = useState(false);
  const [diplayBtnSuivant, setdiplayBtnSuivant] = useState(false);
  const [displayQuizz, setDisplayQuizz] = useState(true);
  const [displayNotes, setDisplayNote] = useState(false);
  const [displayFormError, setDisplayFormError] = useState(false);
  const [skewText, setSkewText] = useState('');
  const [mute, setMute] = useState(muteStorage);
  const reponses = useRef();

  /***USE EFFECT***/
  const resetQuizz = () => {
    setState([{ choix: [] }]);
    setcountQuestion(0);
    setScore(0);
    setChoice(null);
    setdiplayBtnValider(false);
    setdiplayBtnSuivant(false);
    setDisplayQuizz(true);
    setDisplayNote(false);
    setDisplayFormError(false);
    setSkewText('');
  };

  useEffect(() => {
    resetQuizz(); // Réinitialise le quizz lorsque le niveau change
    setLoader(true);
    db.collection(DATABASE)
      .doc(DB_ID)
      .get()
      .then((doc) => {
        setLoader(false);
        //console.log(doc.data().questions.filter((question) => question.theme === theme));
        const questions = randomize(
          doc
            .data()
            .questions.filter(
              (question) =>
                question.theme === theme &&
                (niveau === '4' || question.niveau === niveau) &&
                !question.private
            )
        );

        reponses.current = questions;
        const questionsSansRep = questions.map(({ reponse, ...rest }) => rest);

        setState(questionsSansRep); //questions sans les réponses

        setMaxQuestions(
          niveau === '4' ? questions.length : Math.min(questions.length, 20)
        );
      })
      .catch((err) => console.log(err));
  }, [theme, niveau]);

  /***GESTION DES CHOIX DES REPONSES***/
  const handleChoice = (index) => {
    setChoice(index);
    setdiplayBtnValider(true);
  };

  const displayChoice = state[countQuestion].choix
    .filter((choice) => choice !== '')
    .map((choice, index) => (
      <button key={index} onClick={() => handleChoice(index)} className='choice'>
        {choice}
      </button>
    ));

  /***VALIDATION DES REPONSES***/
  const valider = () => {
    //const reponse = Number(state[countQuestion].reponse);
    const reponse = Number(reponses.current[countQuestion].reponse);
    skew.classList.add('slideSkew');
    if (choice + 1 === reponse) {
      setScore((prev) => ++prev);
      btns[choice].classList.add('right');
      setSkewText('EXACT!');
      skew.classList.add('green');
      correct.play();
    } else {
      btns[choice].classList.add('wrong');
      btns[reponse - 1].classList.add('right');
      setSkewText('FAUX!');
      skew.classList.add('red');
      incorrect.play();
    }

    for (let btn of btns) {
      btn.classList.add('disabled', 'dezoom');
      setTimeout(() => (btn.style.display = 'none'), 200);
    }

    setTimeout(() => {
      btns[choice].style.display = '';
      btns[reponse - 1].style.display = '';
      btns[choice].classList.replace('dezoom', 'zoom');
      btns[reponse - 1].classList.replace('dezoom', 'zoom');
      setdiplayBtnSuivant(true);
    }, 200);
    setdiplayBtnValider(false);
  };

  /***QUESTION SUIVANTE***/
  const suivant = () => {
    if (countQuestion + 1 === maxQuestions) {
      setDisplayQuizz(false);
      setDisplayNote(true);
    } else {
      skew.className = 'skew';
      setcountQuestion((count) => count + 1);
      setdiplayBtnSuivant(false);

      btns.forEach((btn) => (btn.className = 'choice'));
      btns.forEach((btn) => (btn.style.display = ''));

      interfaceDiv.classList.replace('slideIn', 'slideOut');

      setTimeout(() => {
        interfaceDiv.classList.replace('slideOut', 'slideIn');
      }, 300);
    }
  };

  /***GESTION DE L'AUDIO***/
  for (let audio of audios) audio.muted = mute;
  const toggleMute = () => {
    localStorage.setItem('mute', !mute);
    setMute(!mute);
    for (let audio of audios) audio.muted = mute;
  };

  /***RENDU JSX***/
  return (
    <div className='Quizz' style={{ backgroundImage: `url(${background[theme]}` }}>
      {loader && <Loader />}
      <Speaker toggleMute={toggleMute} mute={mute} />
      {displayNotes && (
        <Notes score={score} maxQuestions={maxQuestions} params={props.match.params} />
      )}

      {displayQuizz && state.length > 1 && (
        <>
          <div className='etat'>
            <div>
              <div className='score'>
                {score}/{maxQuestions}
              </div>
              <div className='skew'>{skewText}</div>
            </div>

            <div className='skews'>
              <div>{conversion[theme]}</div>
              <div>{conversion[niveau] || 'TOUT'}</div>
            </div>
          </div>

          <div className='interfaceDiv slideIn'>
            <fieldset>
              <legend>
                Question {countQuestion + 1}/{maxQuestions}
              </legend>
              <p>{state[countQuestion].question}</p>
            </fieldset>
            <div className='container-choix'>{displayChoice}</div>
          </div>
          {diplayBtnValider && (
            <button className='tomato' onClick={valider}>
              Valider
            </button>
          )}
          {diplayBtnSuivant && (
            <>
              {state[countQuestion].info !== '' && (
                <div className='info'>{state[countQuestion].info}</div>
              )}

              <button onClick={suivant} className='blue'>
                Suivant
              </button>
            </>
          )}
          <div
            className='erreur'
            onClick={() => setDisplayFormError(true)}
            role='button'
            tabIndex='0'>
            Signaler une erreur?
          </div>
          {/* <div className='erreur'>
						<a
							href={`mailto: nadfri@gmail.com?subject=QuizzIslam/Erreur/${state[countQuestion].question}`}>
							Signaler une erreur?
						</a>
					</div> */}
        </>
      )}
      {displayFormError && (
        <FormError
          question={state[countQuestion]}
          closeForm={() => setDisplayFormError(false)}
        />
      )}
    </div>
  );
}

export default Quizz;
