import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import ListClassement from '../ListClassement/ListClassement';
import Loader from '../Loader/Loader';
import ScrollTop from '../ScrollTop/ScrollTop';
import { CLASSEMENT, CLASSEMENT_ID, TOP } from '../../utils/constants';
import './Classement.scss';

function Classement() {
  const [classement, setClassement] = useState(null);
  const [loader, setLoader] = useState(false);

  // console.log({CLASSEMENT});

  useEffect(() => {
    setLoader(true);
    //Chargement du Classement
    db.collection(CLASSEMENT)
      .doc(CLASSEMENT_ID)
      .get()
      .then((doc) => {
        //console.log(doc.data().classement);
        setClassement(doc.data().classement);
        setLoader(false);
      })
      .catch((err) => console.log(err));
  }, []);

  const copyClassement = async (sourceDocId, targetDocId) => {
    try {
      // Récupérer le document source
      const sourceDocRef = db.collection('classement').doc(sourceDocId);
      const sourceDoc = await sourceDocRef.get();

      if (!sourceDoc.exists) {
        console.log(`Document ${sourceDocId} non trouvé dans la collection classement.`);
        return;
      }

      // Copier le document dans la collection 'classement-dev'
      const targetDocRef = db.collection('classement-dev').doc(targetDocId);
      await targetDocRef.set(sourceDoc.data());

      console.log(
        `Document ${sourceDocId} copié avec succès dans classement-dev sous ${targetDocId}.`
      );
    } catch (error) {
      console.error('Erreur lors de la copie du document :', error);
    }
  };

  return (
    <>
      {/* <button
        onClick={() => copyClassement('XXJ9yQ0slzmwKLLEr1fI', 'b9bhjvrxdElmrAumoxZd')}>
        Copy Classement to Classement-dev
      </button> */}

      <ScrollTop />
      {loader ? (
        <Loader />
      ) : (
        <div className='Classement'>
          <h1>TOP {TOP}</h1>
          {classement && <ListClassement classementFinal={classement} />}
        </div>
      )}
    </>
  );
}

export default Classement;
