import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Settings/Settings';
import { db } from '../../firebase';
import { CLASSEMENT, CLASSEMENT_ID } from '../../utils/constants';

function Admin() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isClearingClassement, setIsClearingClassement] = useState(false);
  const [isCopyingClassement, setIsCopyingClassement] = useState(false);

  const handleDownloadDb = async () => {
    if (isDownloading) {
      return;
    }

    setIsDownloading(true);

    try {
      const doc = await db.collection('dataBase').doc(process.env.REACT_APP_DB_ID).get();

      if (!doc.exists) {
        console.error(`Le document est introuvable.`);
        return;
      }

      const json = JSON.stringify(doc.data(), null, 2);
      const today = new Date();

      const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${String(
        today.getMonth() + 1,
      ).padStart(2, '0')}-${today.getFullYear()}`;

      const anchor = document.createElement('a');

      anchor.href = `data:application/json;charset=utf-8,${encodeURIComponent(json)}`;
      anchor.download = `db-${formattedDate}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    } catch (error) {
      console.error('Erreur lors du téléchargement de la DB Firebase :', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const clearClassement = async () => {
    if (isClearingClassement) {
      return;
    }

    setIsClearingClassement(true);

    try {
      const classementRef = db.collection(CLASSEMENT).doc(CLASSEMENT_ID);
      const doc = await classementRef.get();

      if (!doc.exists) {
        console.log(
          `Document ${CLASSEMENT_ID} non trouvé dans la collection ${CLASSEMENT}.`,
        );
        return;
      }

      await classementRef.update({ classement: [] });
      console.log(
        `Le classement a été vidé avec succès dans la collection ${CLASSEMENT}.`,
      );
    } catch (error) {
      console.error('Erreur lors de la suppression du classement :', error);
    } finally {
      setIsClearingClassement(false);
    }
  };

  const copyClassement = async () => {
    if (isCopyingClassement) {
      return;
    }

    setIsCopyingClassement(true);

    try {
      const sourceDocRef = db
        .collection('classement')
        .doc(process.env.REACT_APP_CLASSEMENT_ID);
      const sourceDoc = await sourceDocRef.get();

      if (!sourceDoc.exists) {
        console.log(
          `Document ${process.env.REACT_APP_CLASSEMENT_ID} non trouvé dans la collection classement.`,
        );
        return;
      }

      const targetDocRef = db
        .collection('classement-dev')
        .doc(process.env.REACT_APP_CLASSEMENT_ID_DEV);
      await targetDocRef.set(sourceDoc.data());

      console.log(
        `Document ${process.env.REACT_APP_CLASSEMENT_ID} copié avec succès dans classement-dev sous ${process.env.REACT_APP_CLASSEMENT_ID_DEV}.`,
      );
    } catch (error) {
      console.error('Erreur lors de la copie du document :', error);
    } finally {
      setIsCopyingClassement(false);
    }
  };

  return (
    <div className='Settings'>
      <Link to='/settings/ajout'>Ajouter des Questions</Link>
      <Link to='/settings/list'>Liste des Questions</Link>
      <button
        className='btn-dl'
        type='button'
        onClick={copyClassement}
        disabled={isCopyingClassement}>
        {isCopyingClassement ? 'Copie...' : 'Copier le classement'}
      </button>
      <button
        className='btn-dl'
        type='button'
        onClick={clearClassement}
        disabled={isClearingClassement}>
        {isClearingClassement ? 'Suppression...' : 'Vider le classement'}
      </button>
      <button
        className='btn-dl'
        type='button'
        onClick={handleDownloadDb}
        disabled={isDownloading}>
        {isDownloading ? 'Téléchargement...' : 'Télécharger la DB'}
      </button>
    </div>
  );
}

export default Admin;
