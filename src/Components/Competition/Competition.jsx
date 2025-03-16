import './Competition.scss';
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import Loader from '../Loader/Loader';
import correctURL from '../../Sounds/correct.mp3';
import incorrectURL from '../../Sounds/incorrect.mp3';
import Speaker from '../Speaker/Speaker';
import Pseudo from '../Pseudo/Pseudo';
import ProgressBar from '../ProgressBar/ProgressBar';
import ScoreFinal from '../ScoreFinal/ScoreFinal';
import { randomize } from '../../utils/randomize';
import { DB_ID, BONUS, DATABASE, MALUS, MIN_POINT } from '../../utils/constants';

function Competition() {
  /***GLOBAL VARIABLES***/
  /*DOM*/
  let btns = document.querySelectorAll('button');
  let skews = document.querySelectorAll('.skew');
  let interfaceDiv = document.querySelector('.interfaceDiv');

  /*AUDIO*/
  const muteStorage = JSON.parse(localStorage.getItem('mute')) || false;
  const correct = new Audio(correctURL);
  const incorrect = new Audio(incorrectURL);
  const audios = [correct, incorrect];

  /***STATE HOOKS***/
  // Cette ligne initialise l'état qui contiendra les questions du quiz
  const [state, setState] = useState([]);
  const [originalQuestions, setOriginalQuestions] = useState(null);
  const [countQuestion, setcountQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [loader, setLoader] = useState(false);
  const [displayQuizz, setDisplayQuizz] = useState(true);
  const [displayPseudo, setDisplayPseudo] = useState(true);
  const [pseudo, setPseudo] = useState('');
  const [skewText, setSkewText] = useState('');
  const [mute, setMute] = useState(muteStorage);
  const [minuteur, setMinuteur] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [point, setPoint] = useState(null);
  const [goodReponse, setGoodreponse] = useState(0);

  /***Chargement des bases de données***/
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = () => {
    setLoader(true);
    // Si les questions sont déjà chargées, on ne les recharge pas
    if (originalQuestions) {
      const questions = randomize([...originalQuestions]);
      setState(questions);
      setLoader(false);
      return;
    }

    // Première chargement des Questions depuis Firebase
    db.collection(DATABASE)
      .doc(DB_ID)
      .get()
      .then((doc) => {
        setLoader(false);
        const questions = doc.data().questions;
        setOriginalQuestions(questions);
        setState(randomize([...questions]));
      })
      .catch((err) => console.log('Erreur FireBase: ', err));
  };

  // Fonction pour réinitialiser la partie
  const restartGame = () => {
    setcountQuestion(0);
    setScore(0);
    setGoodreponse(0);
    setSkewText('');
    setPoint(null);
    setMinuteur('start');
    setStartTime(Date.now());

    // Réorganiser les questions au lieu de les recharger
    if (originalQuestions) {
      setState(randomize([...originalQuestions]));
    } else {
      loadQuestions();
    }
  };

  /***GESTION DES CHOIX DES REPONSES***/
  /*Affichage des choix*/
  const displayChoice = state[countQuestion]?.choix
    .filter((choice) => choice !== '')
    .map((choice, index) => (
      <button key={index} onClick={() => handleChoice(index)} className='choice'>
        {choice}
      </button>
    ));

  /*Validation du choix*/
  const handleChoice = (index) => {
    btns = document.querySelectorAll('button');
    btns.forEach((btn) => btn.classList.add('disabled'));

    const doublePoint = state[countQuestion].private ? 2 : 1;

    const endTime = Date.now();
    const reponse = Number(state[countQuestion].reponse);

    skews = document.querySelectorAll('.skew');
    skews[0].classList.add('slideSkew');
    skews[1].classList.add('slideSkew');

    if (index + 1 === reponse) {
      setGoodreponse((prev) => ++prev);
      btns[index].classList.add('right');
      skews[0].classList.add('green');
      skews[1].classList.add('green');

      let newScore = Math.floor(BONUS + 100 - (endTime - startTime) / 10) * doublePoint;
      newScore = newScore < MIN_POINT * doublePoint ? MIN_POINT * doublePoint : newScore;
      //console.log('Score', newScore);
      setPoint('+' + newScore);
      setScore((prev) => prev + newScore);
      setSkewText('EXACT!');
      correct.play();
    } else {
      btns[index].classList.add('wrong');
      skews[0].classList.add('red');
      skews[1].classList.add('red');

      setPoint(-MALUS);
      setScore((prev) => prev - MALUS);
      setSkewText('FAUX!');
      incorrect.play();
    }

    setTimeout(suivant, 800);
  };

  /***QUESTION SUIVANTE***/
  const suivant = () => {
    interfaceDiv = document.querySelector('.interfaceDiv');

    if (interfaceDiv) {
      btns.forEach((btn) => (btn.className = 'choice'));

      interfaceDiv.classList.replace('slideIn', 'slideOut');

      setTimeout(() => {
        setcountQuestion((count) => count + 1);
        interfaceDiv.classList.replace('slideOut', 'slideIn');
        setStartTime(Date.now());
        skews[0].className = 'skew';
        skews[1].className = 'skew point';
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

  const startGame = (pseudo) => {
    setMinuteur('start');
    setStartTime(Date.now());
    setDisplayPseudo(false);
    setDisplayQuizz(true);
    setPseudo(pseudo);
  };

  const Double = () => <span className='double'>X2</span>;

  /***RENDU JSX***/
  return (
    <div className='Competition'>
      {displayPseudo && <Pseudo startGame={startGame} />}

      {displayQuizz && minuteur === 'start' && (
        <>
          {loader && <Loader />}
          <Speaker toggleMute={toggleMute} mute={mute} />
          <div className='etat'>
            <div className='score-container'>
              <div className='score'>{score}</div>
              <div className='skew'>{skewText}</div>
              <div className='skew point'>{point}</div>
            </div>

            <ProgressBar over={() => setMinuteur('end')} mute={mute} />
          </div>

          <div className='interfaceDiv slideIn'>
            <fieldset>
              <legend>
                Question {countQuestion + 1} {state[countQuestion].private && <Double />}
              </legend>
              <p>{state[countQuestion].question}</p>
            </fieldset>
            <div className='container-choix'>{displayChoice}</div>
          </div>
        </>
      )}

      {minuteur === 'end' && (
        <ScoreFinal
          pseudo={pseudo}
          score={score}
          maxQuestions={countQuestion}
          goodReponse={goodReponse}
          mute={mute}
          onRestart={restartGame}
        />
      )}
    </div>
  );
}

export default Competition;
