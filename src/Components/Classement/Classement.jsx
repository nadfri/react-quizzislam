import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import ListClassement from '../ListClassement/ListClassement';
import Loader from '../Loader/Loader';
import ScrollTop from '../ScrollTop/ScrollTop';
import { CLASSEMENT, CLASSEMENT_ID, TOP } from '../../utils/constants';
import './Classement.scss';

function Classement() {
  const [classement, setClassement] = useState([]);
  const [loader, setLoader] = useState(false);

  // console.log({CLASSEMENT});

  useEffect(() => {
    setLoader(true);
    //Chargement du Classement
    db.collection(CLASSEMENT)
      .doc(CLASSEMENT_ID)
      .get()
      .then((doc) => {
        // console.log(doc.data().classement);
        setClassement(doc.data().classement);
        setLoader(false);
      })
      .catch((err) => console.log(err));
  }, []);

  const copyClassement = async () => {
    try {
      // Récupérer le document source
      const sourceDocRef = db
        .collection('classement')
        .doc(process.env.REACT_APP_CLASSEMENT_ID);
      const sourceDoc = await sourceDocRef.get();

      if (!sourceDoc.exists) {
        console.log(
          `Document ${process.env.REACT_APP_CLASSEMENT_ID} non trouvé dans la collection classement.`
        );
        return;
      }

      // Copier le document dans la collection 'classement-dev'
      const targetDocRef = db
        .collection('classement-dev')
        .doc(process.env.REACT_APP_CLASSEMENT_ID_DEV);
      await targetDocRef.set(sourceDoc.data());

      console.log(
        `Document ${process.env.REACT_APP_CLASSEMENT_ID} copié avec succès dans classement-dev sous ${process.env.REACT_APP_CLASSEMENT_ID_DEV}.`
      );
    } catch (error) {
      console.error('Erreur lors de la copie du document :', error);
    }
  };

  // Fonction pour vider le tableau de classement
  const clearClassement = async () => {
    try {
      // Obtenir une référence au document de classement
      const classementRef = db.collection(CLASSEMENT).doc(CLASSEMENT_ID);

      // Vérifier si le document existe
      const doc = await classementRef.get();
      if (!doc.exists) {
        console.log(
          `Document ${CLASSEMENT_ID} non trouvé dans la collection ${CLASSEMENT}.`
        );
        return;
      }

      // Mettre à jour le document avec un tableau vide pour le classement
      await classementRef.update({ classement: [] });

      console.log(
        `Le classement a été vidé avec succès dans la collection ${CLASSEMENT}.`
      );

      // Mettre à jour l'état local
      setClassement([]);
    } catch (error) {
      console.error('Erreur lors de la suppression du classement :', error);
    }
  };

  return (
    <>
      {/* <button onClick={copyClassement}>Copy classement</button> */}
      {/* <button onClick={clearClassement}>Vider le classement</button> */}

      <ScrollTop />
      {loader ? (
        <Loader />
      ) : (
        <div className='Classement'>
          <h1>TOP {TOP}</h1>
          <ListClassement classement={classement} />

          {classement.length === 0 && (
            <p className='classement-zero'>Le classement a été remis à zéro</p>
          )}
        </div>
      )}
    </>
  );
}

export default Classement;
