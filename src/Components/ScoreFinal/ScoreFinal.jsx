import './ScoreFinal.scss';
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import bellURL from '../../Sounds/bell.mp3';
import Loader from './../Loader/Loader';
import Share from '../Share/Share';
import { FaTrophy } from 'react-icons/fa';
import ListClassement from '../ListClassement/ListClassement';
import { CLASSEMENT, CLASSEMENT_ID, TOP } from '../../utils/constants';

function ScoreFinal(props) {
  let couleur, Texte, background;

  const { goodReponse, maxQuestions, score, pseudo } = props;

  const note = `${goodReponse}/${maxQuestions}`;

  // Vérification si le score est strictement positif
  const isScorePositif = score > 0;

  const [classementFinal, setClassementFinal] = useState([]);
  const [rank, setRank] = useState(null);
  const [loader, setLoader] = useState(true);
  const [notBetter, setNotBetter] = useState(false);
  const [oldScore, setOldScore] = useState(null);
  const [offline, setOffline] = useState(false);
  const [updateError, setUpdateError] = useState(false);

  const offlineText = (
    <div className='colorRed'>
      Tu es hors ligne, le classement ne sera pas mis à jour.
    </div>
  );

  const errorText = (
    <div className='colorRed'>
      Une erreur est survenue lors de la mise à jour du classement. Réessaie plus tard.
    </div>
  );

  useEffect(() => {
    // Si le score n'est pas positif, ne pas charger le classement
    if (!isScorePositif) {
      setLoader(false);
      return;
    }

    if (!navigator.onLine) {
      setOffline(true);
      setLoader(false);
      return;
    }

    const classementRef = db.collection(CLASSEMENT).doc(CLASSEMENT_ID);
    const currentTimestamp = Date.now();

    // Utilisation d'une transaction pour garantir l'atomicité et la consistance
    db.runTransaction(async (transaction) => {
      // Récupération du document dans la transaction (sans cache)
      const docSnapshot = await transaction.get(classementRef);

      if (!docSnapshot.exists || !docSnapshot.data() || !docSnapshot.data().classement) {
        // Création du document s'il n'existe pas
        const newClassement = [{ pseudo, score, note, timestamp: currentTimestamp }];
        transaction.set(classementRef, {
          classement: newClassement,
          lastUpdated: currentTimestamp,
        });
        setClassementFinal(newClassement);
        setRank(1);
        return;
      }

      // Récupération et tri du classement
      let classement = [...docSnapshot.data().classement];

      // Ajout d'une migration pour assurer que tous les scores ont un timestamp
      classement = classement.map((entry) => {
        if (!entry.timestamp) {
          // Assigner un timestamp ancien aux entrées qui n'en ont pas
          return { ...entry, timestamp: 1 };
        }
        return entry;
      });

      // Utilisation du timestamp pour le tri en cas de score égal
      classement.sort((a, b) => {
        if (b.score === a.score) {
          // Le score le plus ancien est prioritaire en cas d'égalité
          // Garantir que les timestamps existent avec une valeur par défaut
          const timestampA = a.timestamp || 0;
          const timestampB = b.timestamp || 0;
          return timestampA - timestampB;
        }
        return b.score - a.score;
      });

      // Vérifier si le joueur est déjà dans le classement
      const indexPlayer = classement.findIndex((user) => user.pseudo === pseudo);

      if (indexPlayer > -1) {
        // Joueur déjà dans le classement
        if (score > classement[indexPlayer].score) {
          // Mise à jour du score si meilleur
          classement[indexPlayer] = {
            ...classement[indexPlayer],
            score,
            note,
            timestamp: currentTimestamp,
          };
        } else {
          // Score moins bon
          setNotBetter(true);
          setOldScore(classement[indexPlayer].score);
          return; // Sortir de la transaction sans rien modifier
        }
      } else {
        // Joueur pas encore dans le classement
        if (classement.length < TOP) {
          classement.push({ pseudo, score, note, timestamp: currentTimestamp });
        } else {
          // Vérifier si le score est meilleur que le dernier du classement
          classement.sort((a, b) => b.score - a.score);
          const lastScore = classement[TOP - 1].score;

          if (score > lastScore) {
            classement[TOP - 1] = { pseudo, score, note, timestamp: currentTimestamp };
          } else {
            // Score pas assez bon pour entrer dans le classement
            return; // Sortir de la transaction sans rien modifier
          }
        }
      }

      // Trier le classement final avec prise en compte du timestamp pour les égalités
      classement.sort((a, b) => {
        if (b.score === a.score) {
          // Garantir que les timestamps existent avec une valeur par défaut
          const timestampA = a.timestamp || 0;
          const timestampB = b.timestamp || 0;
          return timestampA - timestampB;
        }
        return b.score - a.score;
      });

      // Mettre à jour dans Firestore avec un timestamp de dernière mise à jour
      transaction.update(classementRef, {
        classement: classement,
        lastUpdated: currentTimestamp,
      });

      // Mise à jour de l'état local
      setClassementFinal(classement);
      const newRank =
        classement.findIndex((user) => user.pseudo === pseudo && user.score === score) +
        1;

      setRank(newRank > 0 ? newRank : null);
    })
      .then(() => {
        setLoader(false);
      })
      .catch((error) => {
        console.error('Transaction failed: ', error);
        setUpdateError(true);
        setLoader(false);
      });
  }, []);

  // Détermination de la couleur selon le score
  switch (true) {
    case goodReponse / maxQuestions === 1:
      couleur = 'green';
      break;

    case goodReponse / maxQuestions > 0.75:
      couleur = 'green';
      break;

    case goodReponse / maxQuestions >= 0.5 && goodReponse / maxQuestions < 0.75:
      couleur = 'orange';
      break;

    case goodReponse / maxQuestions < 0.5:
      couleur = 'red';
      break;

    default:
      couleur = 'red';
      break;
  }

  switch (true) {
    // Cas pour les scores négatifs ou nuls
    case !isScorePositif:
      Texte = (
        <div>
          Ton score doit être supérieur à 0 pour avoir une chance de rentrer dans le
          classement. Continue de t'entrainer !
        </div>
      );
      background = 'backRed';
      break;

    case updateError:
      Texte = (
        <div>
          <span className='colorBlue'>{pseudo} !</span> {errorText}
        </div>
      );
      background = 'backRed';
      break;

    case notBetter === true:
      Texte = (
        <div>
          <span className='colorBlue'>{pseudo} !</span> Tu n'as pas fait mieux que la
          dernière fois (<span className='colorBlue'>{oldScore}</span>).
          <br />
          Continue de t'entrainer pour battre ton record !
        </div>
      );
      background = 'backRed';
      break;

    case rank !== null && rank > 3:
      Texte = (
        <div>
          Machallah <span className='colorBlue'>{pseudo}</span>!
          <div className='align-center'>Tu es {rank}ème</div>
          {offline && offlineText}
        </div>
      );
      background = 'backGreen';
      break;

    case rank === 1:
      Texte = (
        <div className='gold'>
          Machallah <span className='colorBlue'>{pseudo}!</span>
          <div className='align-center'>
            Tu es 1er <FaTrophy className='icon' />
            {offline && offlineText}
          </div>
        </div>
      );
      background = 'backGreen';
      break;

    case rank === 2:
      Texte = (
        <div className='silver'>
          Machallah <span className='colorBlue'>{pseudo}!</span>
          <div className='align-center'>
            Tu es 2ème <FaTrophy className='icon' />
          </div>
          {offline && offlineText}
        </div>
      );
      background = 'backGreen';
      break;

    case rank === 3:
      Texte = (
        <div className='bronze'>
          Machallah <span className='colorBlue'>{pseudo}!</span>
          <div className='align-center'>
            Tu es 3ème <FaTrophy className='icon' />
          </div>
          {offline && offlineText}
        </div>
      );
      background = 'backGreen';
      break;

    default:
      Texte = (
        <div>
          Ne désespère pas <span className='colorBlue'>{pseudo} !</span> continue de
          t'entrainer pour te classer dans le <b>TOP {TOP}</b>!
        </div>
      );
      background = 'backRed';
      break;
  }

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <div className='ScoreFinal'>
          <div className='header'>
            <div className='skews'>
              <div className='skew pseudo'>{pseudo}</div>
              <div className='skew score'>{score}</div>
            </div>
            <div className='note-container'>
              <span className={`note ${couleur}`}>{goodReponse}</span> /{maxQuestions}
            </div>
          </div>
          <div className={`texte ${background}`}>{Texte}</div>
          <div className='links'>
            <a href='/competition'>Rejouer</a>

            {rank && <a href='#userID'>Voir Ton Classement</a>}

            <Share TOP={TOP} />

            {rank && (
              <ListClassement
                pseudo={pseudo}
                score={score}
                classement={classementFinal}
              />
            )}
          </div>

          <audio id='bell' src={bellURL} autoPlay muted={props.mute} />
        </div>
      )}
    </>
  );
}

export default ScoreFinal;
